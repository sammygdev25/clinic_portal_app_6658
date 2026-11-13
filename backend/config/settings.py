"""
Django settings -- auto-generated from ProjectContract.
DO NOT EDIT middleware or installed_apps manually.
These are managed by the ProjectContract.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Secure defaults: nothing set means production. Previews and docker-compose set DEBUG=1 explicitly.
DEBUG = os.getenv('DEBUG', '0') == '1'
SECRET_KEY = os.getenv('SECRET_KEY', '')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-dev-only-key'
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured('SECRET_KEY must be set when DEBUG is off')
# Comma separated hostnames, no wildcard fallback. With DEBUG on and an empty list Django allows localhost.
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', '').split(',') if h.strip()]

INSTALLED_APPS = [
    'daphne',
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "knox",
    "corsheaders",
    "django_filters",
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database: PostgreSQL everywhere, never SQLite. DATABASE_URL first (Railway and most hosts give one); with
# DEBUG on and none set, the local server start.sh runs for previews; with DEBUG off a missing one stops the app.
from urllib.parse import parse_qsl, unquote, urlparse


def _database_from_url(url):
    parts = urlparse(url)
    if parts.scheme not in ('postgres', 'postgresql') or not parts.path.strip('/'):
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured('DATABASE_URL must be postgres://user:password@host:port/name')
    database = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': unquote(parts.path.lstrip('/')),
        'USER': unquote(parts.username or ''),
        'PASSWORD': unquote(parts.password or ''),
        'HOST': parts.hostname or '',
        'PORT': str(parts.port or 5432),
        'CONN_MAX_AGE': int(os.getenv('DB_CONN_MAX_AGE', '0')),
    }
    options = dict(parse_qsl(parts.query))
    if options:
        database['OPTIONS'] = options
    return database


DATABASE_URL = os.getenv('DATABASE_URL', '')
if not DATABASE_URL:
    if not DEBUG:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured('DATABASE_URL must be set when DEBUG is off')
    DATABASE_URL = 'postgresql://app:app@localhost:5432/app'
DATABASES = {'default': _database_from_url(DATABASE_URL)}


AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS and CSRF: explicit origins from env. The wildcard applies only when CORS_ALLOW_ALL_ORIGINS=1 is set (previews, docker-compose).
CORS_ALLOWED_ORIGINS = [o.strip() for o in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if o.strip()]
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', '0') == '1'
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',') if o.strip()] or CORS_ALLOWED_ORIGINS

# Transport and header security. Outside DEBUG the site is HTTPS only; set SECURE_SSL_REDIRECT=0 behind a proxy that does not send X-Forwarded-Proto.
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
SESSION_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'SAMEORIGIN'
if DEBUG:
    # Previews run inside the Shikshya iframe on another origin.
    MIDDLEWARE = [m for m in MIDDLEWARE if 'XFrameOptionsMiddleware' not in m]
else:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', '1') == '1'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# Fixtures
FIXTURE_DIRS = [BASE_DIR]

# Stripe: keys from the environment only. With no STRIPE_SECRET_KEY the payment routes answer 503 and the rest of the app runs.
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
STRIPE_CURRENCY = os.getenv('STRIPE_CURRENCY', 'usd')
# Where Stripe sends the browser back when the request's origin is not an allowed CORS origin.
FRONTEND_URL = os.getenv('FRONTEND_URL', '')

# Django Channels
ASGI_APPLICATION = 'config.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(os.getenv('REDIS_HOST', 'localhost'), int(os.getenv('REDIS_PORT', 6379)))],
        },
    },
}

# Celery
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'


# Sign-in tokens (django-rest-knox, P1b.6 R2): one per device, stored hashed; they expire after 12 idle hours (each
# use renews them, at most once a minute) and never live past 30 days from sign-in.
from datetime import timedelta
REST_KNOX = {
    "TOKEN_TTL": timedelta(hours=12),
    "AUTO_REFRESH": True,
    "AUTO_REFRESH_MAX_TTL": timedelta(days=30),
    "MIN_REFRESH_INTERVAL": 60,
}
# REST Framework -- Token Auth
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'knox.auth.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Uploads (P1b.6 R2): with STORAGE_BUCKET set (a Railway bucket, or any S3-compatible store) they go to that private
# bucket and pages show them through links signed for an hour; without it they stay in MEDIA_ROOT (previews, local
# runs, one server). Shikshya Cloud's Deploy button creates the bucket and sets these.
if os.getenv('STORAGE_BUCKET'):
    STORAGES = {
        'default': {'BACKEND': 'config.storage.UploadStorage', 'OPTIONS': {
            'bucket_name': os.environ['STORAGE_BUCKET'],
            'endpoint_url': os.getenv('STORAGE_ENDPOINT') or None,
            'access_key': os.getenv('STORAGE_ACCESS_KEY_ID') or None,
            'secret_key': os.getenv('STORAGE_SECRET_ACCESS_KEY') or None,
            'region_name': os.getenv('STORAGE_REGION') or None,
            'addressing_style': 'path' if os.getenv('STORAGE_URL_STYLE', '').lower().startswith('path') else 'virtual',
            'signature_version': 's3v4',
            'querystring_auth': True,
            'querystring_expire': 3600,
            'file_overwrite': False,
            'default_acl': None,
        }},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
else:
    STORAGES = {
        'default': {'BACKEND': 'config.storage.SignedFileStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }

# Production security overlay
from .security import *  # noqa: F403
# Star import runs security.py in its own namespace, so the
# REST_FRAMEWORK merge must happen here where both are in scope.
REST_FRAMEWORK.update(REST_FRAMEWORK_SECURITY)  # noqa: F405
# Production middleware (P1b.6 R2): request ids and the health answers first, static and frontend files after the
# security middleware; outside DEBUG the clickjacking header (DENY), the Content-Security-Policy and the
# Permissions-Policy (previews run inside Shikshya's frame).
MIDDLEWARE.insert(0, "config.middleware.HealthCheckMiddleware")  # noqa: F405
MIDDLEWARE.insert(0, "config.middleware.RequestIdMiddleware")  # noqa: F405
MIDDLEWARE.insert(MIDDLEWARE.index("django.middleware.security.SecurityMiddleware") + 1,  # noqa: F405
                  "whitenoise.middleware.WhiteNoiseMiddleware")
if not DEBUG:  # noqa: F405
    X_FRAME_OPTIONS = "DENY"
    if "django.middleware.clickjacking.XFrameOptionsMiddleware" not in MIDDLEWARE:  # noqa: F405
        MIDDLEWARE.append("django.middleware.clickjacking.XFrameOptionsMiddleware")  # noqa: F405
    MIDDLEWARE.append("config.middleware.SecurityHeadersMiddleware")  # noqa: F405

AUTH_USER_MODEL = 'api.User'
