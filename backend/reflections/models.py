
from django.db import models
from django.contrib.auth.models import User

class Reflection(models.Model):
    """Model representing a user's daily reflection entry."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    title = models.CharField(max_length=255)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    feedback = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return f"{self.title} - {self.user.username} ({self.date_created.date()})"
