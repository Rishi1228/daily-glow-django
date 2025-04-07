
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Reflection

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and profile management."""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'read_only': True}
        }
    
    def create(self, validated_data):
        # Set username to email for simplicity
        validated_data['username'] = validated_data['email']
        
        # Create user with provided details
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        
        return user

class ReflectionSerializer(serializers.ModelSerializer):
    """Serializer for reflection entries."""
    
    class Meta:
        model = Reflection
        fields = ('id', 'title', 'content', 'date_created', 'feedback')
        read_only_fields = ('id', 'date_created')
    
    def create(self, validated_data):
        # Associate the reflection with the authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
