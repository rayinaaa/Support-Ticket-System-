from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TicketViewSet, StatsView, ClassifyView

router = DefaultRouter()
router.register(r'', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', StatsView.as_view(), name='stats'),
    path('classify/', ClassifyView.as_view(), name='classify'),
]
