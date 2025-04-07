
import json
from django.contrib.auth.models import User
from rest_framework import status, views, generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Reflection
from .serializers import UserSerializer, ReflectionSerializer

class SignUpView(generics.CreateAPIView):
    """View for user registration."""
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if email already exists
        email = serializer.validated_data.get('email')
        if User.objects.filter(email=email).exists():
            return Response(
                {"message": "User with this email already exists."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        return Response(
            {"message": "User registered successfully."}, 
            status=status.HTTP_201_CREATED
        )

class SignInView(views.APIView):
    """View for user authentication and token generation."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"message": "Email and password are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid credentials."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {"message": "Invalid credentials."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
        })

class ReflectionListCreateView(generics.ListCreateAPIView):
    """View for listing and creating reflection entries."""
    serializer_class = ReflectionSerializer
    
    def get_queryset(self):
        # Return only the authenticated user's reflections
        return Reflection.objects.filter(user=self.request.user)

class ReflectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a reflection entry."""
    serializer_class = ReflectionSerializer
    
    def get_queryset(self):
        # Return only the authenticated user's reflections
        return Reflection.objects.filter(user=self.request.user)

class FeedbackView(views.APIView):
    """View for generating AI feedback for a reflection."""
    
    def post(self, request):
        content = request.data.get('content')
        entry_id = request.data.get('entryId')
        
        if not content:
            return Response(
                {"message": "Content is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # In a real implementation, you'd connect to an AI service here
        # For now, we'll generate a simple feedback
        
        feedback = generate_simple_feedback(content)
        
        # If an entry ID was provided, save the feedback to that entry
        if entry_id and request.user.is_authenticated:
            try:
                reflection = Reflection.objects.get(id=entry_id, user=request.user)
                reflection.feedback = feedback
                reflection.save()
            except Reflection.DoesNotExist:
                pass
        
        return Response({"feedback": feedback})

def generate_simple_feedback(content):
    """
    Generate a simple feedback based on the content.
    In a real implementation, this would connect to an AI service.
    """
    word_count = len(content.split())
    
    if word_count < 20:
        base_feedback = "Your reflection is quite brief. Consider expanding on your thoughts to gain deeper insights."
    elif word_count < 50:
        base_feedback = "You've made a good start. Try to connect these ideas to your previous knowledge."
    elif word_count < 100:
        base_feedback = "This is a thoughtful reflection. Consider how you might apply these learnings in practice."
    else:
        base_feedback = "Your detailed reflection shows deep engagement with the material. Consider what specific actions you can take based on these insights."
    
    # Add some specific analysis based on content
    if "learned" in content.lower() or "discovered" in content.lower():
        insight = " Your focus on new discoveries is valuable for building knowledge."
    elif "challenge" in content.lower() or "difficult" in content.lower():
        insight = " Reflecting on challenges helps build resilience and problem-solving skills."
    elif "connect" in content.lower() or "relate" in content.lower():
        insight = " Making connections between concepts strengthens your understanding."
    else:
        insight = " Regular reflection like this builds self-awareness and metacognition."
    
    return base_feedback + insight
