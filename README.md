
# Daily Bright - Reflective Learning Assistant

Daily Bright is a web application that helps users track their daily learnings and receive AI-powered insights to enhance their personal growth journey.

## Features

- User authentication (signup/signin)
- Daily reflection entries with title and content
- AI-generated feedback on reflections
- View and manage past reflections
- Responsive design

## Project Structure

This project consists of:

1. **Frontend**: React-based UI with HTML/CSS (in the `src` directory)
2. **Backend**: Django REST API with authentication and data storage (in the `backend` directory)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

The Django server will run at http://127.0.0.1:8000/

### Frontend Setup

The frontend is already built in the React application. To access it, simply navigate to the main URL when the Django server is running.

## Usage

1. Register a new account using your email
2. Sign in to access the dashboard
3. Create new reflections by filling out the form
4. View your past reflections and get AI insights on them

## API Endpoints

- **Authentication**:
  - `POST /api/auth/signup` - Create a new user account
  - `POST /api/auth/signin` - Get authentication token

- **Reflections**:
  - `GET /api/entries` - List all entries for the authenticated user
  - `POST /api/entries` - Create a new entry
  - `GET /api/entries/{id}` - Get a specific entry
  - `DELETE /api/entries/{id}` - Delete an entry

- **AI Feedback**:
  - `POST /api/feedback` - Generate AI feedback for reflection content
