from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Support Ticket System API',
        'version': '1.0',
        'endpoints': {
            'tickets': '/api/tickets/tickets/',
            'ticket_stats': '/api/tickets/stats/',
            'ticket_classify': '/api/tickets/classify/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/tickets/', include('tickets.urls')),
]
