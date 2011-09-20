from django.conf.urls.defaults import *

urlpatterns = patterns('main.views',
	url(r'^$', 'index', name='index'),
	url(r'^(?P<repo>.*)/$', 'repo', name='repo'),
)
