from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime
from .models import Reflection

def index_view(request):
    """View for the homepage."""
    today_date = datetime.now().strftime("%A, %B %d, %Y")
    
    reflections = []
    if request.user.is_authenticated:
        reflections = Reflection.objects.filter(user=request.user)
    
    return render(request, 'index.html', {
        'today_date': today_date,
        'reflections': reflections,
    })

@login_required
def dashboard_view(request):
    """View for the user dashboard."""
    # Count total reflections for the user
    reflection_count = Reflection.objects.filter(user=request.user).count()
    
    # Get the most recent reflections
    recent_reflections = Reflection.objects.filter(
        user=request.user
    ).order_by('-date_created')[:5]
    
    return render(request, 'dashboard.html', {
        'reflection_count': reflection_count,
        'recent_reflections': recent_reflections,
    })

@login_required
def timeline_view(request):
    """View for the timeline history of reflections."""
    # Get all reflections for the current user, ordered by date created
    reflections = Reflection.objects.filter(user=request.user).order_by('date_created')
    
    # Group reflections by month and year
    timeline_data = {}
    for reflection in reflections:
        # Format as "Month Year" (e.g., "April 2025")
        month_year = reflection.date_created.strftime("%B %Y")
        if month_year not in timeline_data:
            timeline_data[month_year] = []
        
        timeline_data[month_year].append(reflection)
    
    return render(request, 'timeline.html', {
        'timeline_data': timeline_data,
        'reflections_count': reflections.count(),
    })

def login_view(request):
    """View for handling user login."""
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            # Find user by email
            user = User.objects.get(email=email)
            # Attempt authentication
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                login(request, authenticated_user)
                messages.success(request, "Successfully signed in!")
                return redirect('index')
            else:
                messages.error(request, "Invalid credentials.")
        except User.DoesNotExist:
            messages.error(request, "Invalid credentials.")
    
    return render(request, 'auth/login.html')

def register_view(request):
    """View for handling user registration."""
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        if password != confirm_password:
            messages.error(request, "Passwords don't match.")
            return render(request, 'auth/register.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, "A user with this email already exists.")
            return render(request, 'auth/register.html')
        
        # Create new user
        user = User.objects.create_user(
            username=email,  # Using email as username
            email=email,
            password=password
        )
        
        messages.success(request, "Account created successfully! You can now sign in.")
        return redirect('login')
    
    return render(request, 'auth/register.html')

@login_required
def logout_view(request):
    """View for handling user logout."""
    logout(request)
    messages.success(request, "Successfully signed out!")
    return redirect('index')

@login_required
def add_reflection(request):
    """View for adding a new reflection."""
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        
        # Create new reflection
        Reflection.objects.create(
            user=request.user,
            title=title,
            content=content
        )
        
        messages.success(request, "Reflection saved successfully!")
    
    return redirect('index')

@login_required
def delete_reflection(request, reflection_id):
    """View for deleting a reflection."""
    reflection = get_object_or_404(Reflection, id=reflection_id, user=request.user)
    
    if request.method == 'POST':
        reflection.delete()
        messages.success(request, "Reflection deleted successfully!")
    
    return redirect('index')
