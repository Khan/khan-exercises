from django.conf.urls.defaults import *
from django.conf import settings

urlpatterns = patterns('main.views',
	url(r'^$', 'repo', name='repo'),
	url(r'^pull/(?P<number>\d+)/$', 'sandcastle', name='sandcastle'),
	url(r'^branch/(?P<branch>.*)/$', 'sandcastle', name='sandcastle'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': True,
        }),
   )