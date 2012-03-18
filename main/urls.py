from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('main.views',
    url(r'^$', 'repo', name='repo'),
    url(r'^pull/(?P<number>\d+)/$', 'sandcastle', name='sandcastle'),
    url(r'^branch/(?P<branch>.*)/$', 'sandcastle', name='sandcastle'),
)
