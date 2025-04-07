
from django.urls import path
from .views import (
    SignUpView, 
    SignInView,
    ReflectionListCreateView,
    ReflectionDetailView,
    FeedbackView
)

urlpatterns = [
    # Authentication endpoints
    path('auth/signup', SignUpView.as_view(), name='signup'),
    path('auth/signin', SignInView.as_view(), name='signin'),
    
    # Reflection endpoints
    path('entries', ReflectionListCreateView.as_view(), name='entries-list'),
    path('entries/<int:pk>', ReflectionDetailView.as_view(), name='entry-detail'),
    
    # Feedback endpoint
    path('feedback', FeedbackView.as_view(), name='feedback'),
]
