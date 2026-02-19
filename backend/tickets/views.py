import json
import os

from django.db.models import Count, Min, Max, Q
from django.db.models.functions import Now
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView

import openai

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    http_method_names = ['get', 'post', 'patch']
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

    def get_queryset(self):
        qs = super().get_queryset()
        # filtering and search are applied automatically
        return qs

    def partial_update(self, request, *args, **kwargs):
        # allow updating only status, category, priority
        allowed = {'status', 'category', 'priority'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        if not data:
            return Response({'detail': 'Nothing to update'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)


class StatsView(APIView):
    def get(self, request):
        # aggregate counts and breakdowns at DB level
        stats = Ticket.objects.aggregate(
            total_tickets=Count('id'),
            open_tickets=Count('id', filter=Q(status='open')),
            low_priority=Count('id', filter=Q(priority='low')),
            medium_priority=Count('id', filter=Q(priority='medium')),
            high_priority=Count('id', filter=Q(priority='high')),
            critical_priority=Count('id', filter=Q(priority='critical')),
            billing_category=Count('id', filter=Q(category='billing')),
            technical_category=Count('id', filter=Q(category='technical')),
            account_category=Count('id', filter=Q(category='account')),
            general_category=Count('id', filter=Q(category='general')),
            first_date=Min('created_at'),
            last_date=Max('created_at'),
        )
        total = stats.get('total_tickets') or 0
        # calculate avg per day
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
                'open_tickets': stats.get('open_tickets', 0),
                'avg_tickets_per_day': avg_per_day,
                'priority_breakdown': {
                    'low': stats.get('low_priority', 0),
                    'medium': stats.get('medium_priority', 0),
                    'high': stats.get('high_priority', 0),
                    'critical': stats.get('critical_priority', 0),
                },
                'category_breakdown': {
                    'billing': stats.get('billing_category', 0),
                    'technical': stats.get('technical_category', 0),
                    'account': stats.get('account_category', 0),
                    'general': stats.get('general_category', 0),
                },
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
        openai.api_key = api_key
        prompt = (
            "You are an automated ticket classifier.\n"
            "Given a ticket description, output a JSON object with exactly two keys:"
            "suggested_category and suggested_priority.\n"
            "Categories must be one of: billing, technical, account, general.\n"
            "Priorities must be one of: low, medium, high, critical.\n"
            "Respond only with valid JSON, no additional text.\n"
            f"Description: {description}\n"
        )
        try:
            resp = openai.Completion.create(
                engine='text-davinci-003',
                prompt=prompt,
                max_tokens=60,
                temperature=0,
            )
            text = resp.choices[0].text.strip()
            data = json.loads(text)
            cat = data.get('suggested_category')
            pri = data.get('suggested_priority')
            if cat not in ['billing', 'technical', 'account', 'general'] or pri not in ['low', 'medium', 'high', 'critical']:
                raise ValueError('invalid values')
            return Response({'suggested_category': cat, 'suggested_priority': pri})
        except Exception:
            return Response(default)
