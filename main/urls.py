from django.conf.urls.defaults import *

urlpatterns = patterns('main.views',
	url(r'^$', 'repo', name='repo'),
	url(r'^pull/(?P<number>\d+)/$', 'sandcastle', name='sandcastle'),
)
