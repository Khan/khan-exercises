# Django settings for sandcastle project.
from os import path

# Look at local_settings.py.template for an example local_settings.py
from local_settings import *

PROJECT_DIR = path.dirname(__file__)

ADMINS = (
    ('Julian Pulgarin', 'jp@julianpulgarin.com'),
)

# Following users are emailed when a broken link is detected
SEND_BROKEN_LINK_EMAILS = False
MANAGERS = ADMINS

# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
TIME_ZONE = 'UTC'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = False
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
MEDIA_ROOT = path.join(PROJECT_DIR, 'media/')
STATIC_ROOT = path.join(PROJECT_DIR, 'static/')

MEDIA_URL = '/media/'
ADMIN_MEDIA_PREFIX = '/static/admin/'
STATIC_URL = '/static/'

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    path.join(PROJECT_DIR, 'templates'),
)

INSTALLED_APPS = (
    'django.contrib.staticfiles',
    'main',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
