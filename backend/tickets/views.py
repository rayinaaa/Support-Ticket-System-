import json
import os

from django.db.models import Count, Min, Max, Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    http_method_names = ['get', 'post', 'patch']
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']


    def partial_update(self, request, *args, **kwargs):
        # allow updating only status, category, priority
        allowed = {'status', 'category', 'priority'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        if not data:
            return Response({'detail': 'Nothing to update'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)


class StatsView(APIView):
    """Return aggregated ticket statistics.

    The view builds a single database query and then formats the
    results into a simple JSON structure. Looping over the choice
    tuples keeps the code DRY and makes it easy to add/remove values
    later.
    """

    def get(self, request):
        qs = Ticket.objects
        # base aggregation for totals and date bounds
        stats = qs.aggregate(
            total=Count('id'),
            open=Count('id', filter=Q(status='open')),
            first_date=Min('created_at'),
            last_date=Max('created_at'),
        )

        # breakdowns for priorities and categories
        for field, choices in (
            ('priority', Ticket.PRIORITY_CHOICES),
            ('category', Ticket.CATEGORY_CHOICES),
        ):
            for value, _ in choices:
                key = f"{field}_{value}"
                stats[key] = qs.filter(**{field: value}).count()

        total = stats['total'] or 0
        first = stats.get('first_date')
        last = stats.get('last_date')
        if first and last and first != last:
            days = (last - first).days or 1
            avg_per_day = total / days
        else:
            avg_per_day = total

        return Response(
            {
                'total_tickets': total,
                'open_tickets': stats.get('open', 0),
                'avg_tickets_per_day': avg_per_day,
                'priority_breakdown': {v: stats.get(f'priority_{v}', 0) for v, _ in Ticket.PRIORITY_CHOICES},
                'category_breakdown': {v: stats.get(f'category_{v}', 0) for v, _ in Ticket.CATEGORY_CHOICES},
            }
        )


class ClassifyView(APIView):
    def post(self, request):
        description = request.data.get('description', '')
        default = {'suggested_category': 'general', 'suggested_priority': 'low'}
        if not description:
            return Response(default)
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return Response(default)
        try:
            # lazily import the new OpenAI client so the package isn't a hard
            # dependency for every use of the module.
            from openai import OpenAI

            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an automated ticket classifier. Given a ticket "
                            "description, output a JSON object with exactly two keys: "
                            "suggested_category and suggested_priority. Categories must "
                            "be one of: billing, technical, account, general. Priorities "
                            "must be one of: low, medium, high, critical. Respond only "
                            "with valid JSON, no additional text."
                        ),
                    },
                    {"role": "user", "content": f"Description: {description}"},
                ],
                max_tokens=60,
                temperature=0,
            )
            text = response.choices[0].message.content.strip()
            data = json.loads(text)
            cat = data.get('suggested_category')
            pri = data.get('suggested_priority')
            if cat not in {c for c, _ in Ticket.CATEGORY_CHOICES} or pri not in {p for p, _ in Ticket.PRIORITY_CHOICES}:
                raise ValueError("invalid values")
            return Response({'suggested_category': cat, 'suggested_priority': pri})
        except Exception:
            return Response(default)
