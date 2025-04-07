
from django.contrib import admin
from .models import Reflection

@admin.register(Reflection)
class ReflectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'date_created')
    list_filter = ('date_created', 'user')
    search_fields = ('title', 'content', 'user__username')
