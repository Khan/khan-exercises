Testing Exercises
=================

To test exercises, you need to also have the `QUnit testing Framework <http://docs.jquery.com/QUnit>`_ in the directory khan-exercises/tests/qunit.  This is a separate download.   Once you do that, you can navigate to these pages to see test results:

* khan-exercises/test has regression tests for exercises
* khan-exercises/utils/test has unit tests for utility functions


setting up qunit:
*****************

you should just be able to do a git submodule init; git submodule update from within the khan-exercises repo

.. code-block::  shell

    user:~/khan-exercises/ $ git submodule init
    Submodule 'test/qunit' (https://github.com/jquery/qunit.git) registered for path 'test/qunit'
    
    user:~/khan-exercises/ $ git submodule update
    Cloning into test/qunit...
    remote: Counting objects: 1408, done.
    remote: Compressing objects: 100% (907/907), done.
    remote: Total 1408 (delta 636), reused 1253 (delta 495)
    Receiving objects: 100% (1408/1408), 228.73 KiB | 215 KiB/s, done.
    Resolving deltas: 100% (636/636), done.
    Submodule path 'test/qunit': checked out 'bd6a75e29e97576f12bed0c6d8f949d7bafcd9d7'


If that doesn't work, an alternative is this:

* cd to the same parent directory that you downloaded khan-exercises into
* Use this command to obtain qunit

.. code-block::  shell

    git clone http://github.com/jquery/qunit


* cd into khan-exercises/test and make a symbolic link to the qunit directory

.. code-block::  shell

    cd khan-exercises/test
    ln -s ../../qunit qunit
