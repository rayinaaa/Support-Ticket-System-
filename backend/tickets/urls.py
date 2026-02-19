from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TicketViewSet, StatsView, ClassifyView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('stats/', StatsView.as_view(), name='stats'),
    path('classify/', ClassifyView.as_view(), name='classify'),
    path('', include(router.urls)),
]
