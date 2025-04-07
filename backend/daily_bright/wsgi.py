
"""
WSGI config for daily_bright project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daily_bright.settings')

application = get_wsgi_application()
