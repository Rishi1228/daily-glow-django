
"""
URL configuration for the daily_bright project.
"""
from django.contrib import admin
from django.urls import path, include
from reflections.views_frontend import (
    index_view, login_view, register_view, logout_view, 
    add_reflection, delete_reflection
)

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('reflections.urls')),
    
    # Frontend views
    path('', index_view, name='index'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('reflection/add/', add_reflection, name='add_reflection'),
    path('reflection/<int:reflection_id>/delete/', delete_reflection, name='delete_reflection'),
]
