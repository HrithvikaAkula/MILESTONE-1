
from django.urls import path
from .views import SummaryView, InsightView, SearchView, ChatView

urlpatterns = [
    path('summarize/', SummaryView.as_view(), name='summarize'),
    path('insights/', InsightView.as_view(), name='insights'),
    path('search/', SearchView.as_view(), name='search'),
    path('chat/', ChatView.as_view(), name='chat'),
]
