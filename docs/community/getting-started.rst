Getting Acquainted
==================


So you want to get involved with the creation of new exercises? Awesome! Play around with `the exercises on the knowledge map <http://www.khanacademy.org/exercisedashboard>`_ to get a sense of what's there and what's missing. You can find a diverse list of good exercises and helpful tips `here <https://github.com/Khan/khan-exercises/wiki/Good-examples-and-pro-tips>`_. In true Khan Academy fashion, Sal and Marcia made `a few videos <http://vimeo.com/album/1688597>`_ on how to make exercises, and the best way to learn is to try it out yourself. :)

What should I work on?
**********************

Check out our `Trello board <https://trello.com/board/exercises/4d87e664967a0775082939ab>`_ and pick a card with a green label. These cards are nicely scoped tasks to help you get acquainted with the code while improving our exercises.

Where is everybody?
*******************

Come hang out with us in our `public chat room <http://www.hipchat.com/g2m3UVDtY>`_! We're in there most of the time and always read the backlogs. We like to learn from one another, brainstorm together, and also coordinate to avoid duplicate work. If you'd like to do one of the tasks listed on Trello, let us know.

Sharing Your Work With Millions of People
*****************************************

To start, `create an account on Github <https://github.com/signup/free>`_ (if you haven't done so already).

Create a fork of the `Khan Exercise Framework <https://github.com/khan/khan-exercises>`_ (`More details of forking <http://help.github.com/forking/>`_).

Before you write any code, be sure to create a new branch in your repository in which all the changes will be committed. More details about Git branches can be found in the `Pro Git chapter on branches <http://progit.org/book/ch3-1.html>`_ and in the chapter on `remote branches <http://progit.org/book/ch3-5.html>`_.

After you pulled the code, make sure that you serve the files from some sort of a server:

.. code-block:: bash

    cd khan-exercises
    python -m SimpleHTTPServer # or python3 -m http.server

Now if you open your browser to ``http://127.0.0.1:8000/`` you should see the contents of the ``khan-exercises`` directory.

After your new branch has been pushed to your repository you can now send a `pull request <http://help.github.com/pull-requests/>`_. Be sure to reference the bug(s) that you're fixing in the commit messages and in the pull request description (this helps us to track the changes easier). Once you've submitted the pull request, you will be able to see it in our `sandcastle <http://sandcastle.khanacademy.org/>`_, which you can learn more about `here <https://github.com/Khan/khan-exercises/wiki/Writing-Exercises:-sandcastle>`_.

Best Practices
**************

* Make sure you include as little JavaScript code inside your exercises as possible. Try to strip out un-needed methods and move extraneous (but reusable) code into the utility modules (located in ``utils/``).
* Be sure to use good code formatting when writing your script. We tend to follow the `jQuery Core Styling Guidelines <http://docs.jquery.com/JQuery_Core_Style_Guidelines>`_.
* Avoid multiple choice in favor of free answer where possible.
* Focus on both question and hint clarity. Exercises do not have to match relevant videos' content word for word, but they should be on par in terms of quality.

Go `learn more about an exercise's components <https://github.com/Khan/khan-exercises/wiki/Writing-Exercises:-Home>`_