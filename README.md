sandcastle
==========

This is a Django application which allows you to test pull requests from your browser.

Configuration
-------------

You can set a default repository by setting `SANDCASTLE_USER` and 
`SANDCASTLE_REPO` in `settings.py`. For example, to set this repository
as the default it would look like this:

	SANDCASTLE_USER = "jpulgarin"
	SANDCASTLE_REPO = "sandcastle"

Used At
-------

It is currently in use at [Khan Academy](http://sandcastle.khanacademy.org) to
test pull requests to their exercise framework.
