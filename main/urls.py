from django.conf.urls.defaults import *

urlpatterns = patterns('main.views',
	url(r'^$', 'index', name='index'),
	url(r'^(?P<user>.*)/(?P<repo>.*)/pull/(?P<number>\d+)/$', 'sandcastle', name='sandcastle'),
	url(r'^(?P<user>.*)/(?P<repo>.*)/$', 'repo', name='repo'),
)
