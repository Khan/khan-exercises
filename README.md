# Khan Academy Exercises

Copyright 2012 Khan Academy

The exercise framework is [MIT licensed](http://en.wikipedia.org/wiki/MIT_License).

The exercises are under a [Creative Commons by-nc-sa license](http://en.wikipedia.org/wiki/Creative_Commons_licenses).

## Exercise Framework

Khan Academy has created a generic framework for building exercises. This framework, together with the exercises themselves, can be used completely independently of the Khan Academy application.

The framework exists in two components:

* An HTML markup for specifying exercises.
* A jQuery plugin for generating a usable, interactive, exercise from the HTML markup.

## Writing Exercises

The process for writing exercises is rather well documented. More information about this process can be found in the [Khan Exercises wiki](https://github.com/Khan/khan-exercises/wiki). Specifically:

* [How to Get Involved](https://github.com/Khan/khan-exercises/wiki/Getting-Involved)
* [How to Write Exercises](https://github.com/Khan/khan-exercises/wiki/Writing-Exercises:-Home)
* [How to Test Exercises](https://github.com/Khan/khan-exercises/wiki/Testing-Exercises)

## More

If you're passionate about creating these exercises and want to apply to be a full-time exercise developer at the Khan Academy, [please do so](http://hire.jobvite.com/CompanyJobs/Careers.aspx?c=qd69Vfw7&page=Job%20Description&j=ohjSVfw7).

sandcastle

This is a Django project which allows you to test pull requests from your browser.

Configuration
-------------

Specify your repository by setting `SANDCASTLE_USER` and
`SANDCASTLE_REPO` in `settings.py`. For example, setting up sandcastle
for this repository would look like:

    SANDCASTLE_USER = 'jpulgarin'
    SANDCASTLE_REPO = 'sandcastle'

Used At
-------

It is currently in use at [Khan Academy](http://www.khanacademy.org) to
test pull requests to their exercise framework. It is hosted at [sandcastle.khanacademy.org](http://sandcastle.khanacademy.org).
