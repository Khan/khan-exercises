Writing Exercises
=================

Exercises are specified entirely using HTML and are contained within a simple HTML page. You can specify a series of problems (which contain a problem introduction, a question, and a valid solution). Additionally you can specify a series of hints that will be provided to the user upon request.

The Basic Structure
*******************

Exercises are designed to be contained within a single HTML file. 

In brief, every exercise should have the following areas:

- ``head`` which includes importing utilities and the exercise title
- ``div.exercise`` which contains everything else to do with the exercise
- ``div.vars`` which declares all variables to be used later
- ``div.problems`` which includes all possible problems
- ``div.hints`` which includes hints on how to solve the problem

Different pages of this wiki will go into more details of each section. The basic layout for a single, simple exercise can be found below.

.. code-block:: html

    <!DOCTYPE html>
    <html data-require="math">
        <head>
            <title>Name of Your Exercise</title>
            <script src="../khan-exercise.js"></script>
        </head>
        <body>
            <div class="exercise">
                <div class="vars">
                    <!-- Your variables in here... -->
                </div>

                <div class="problems">
                    <div id="problem-type-or-description">
                        <p class="problem"><!-- An overview of the problem including all needed info. --></p>
                        <p class="question"><!-- The question to ask the student. --></p>
                        <p class="solution"><!-- The correct answer expected of the student. --></p>
                    </div>
                </div>

                <div class="hints">
                    <!-- Any hints to show to the student. -->
                </div>
            </div>
        </body>
    </html>


You can copy this markup into an HTML file and start building an exercise right away.

Add ``?debug`` to any exercise URL to conjure a useful debug info panel. You can also type "h" to reveal the next hint.


Using Modules
*************

Depending upon the type of exercise that you're writing you'll likely need to load one or more utility modules in order to render the exercise correctly. This can be done by specifying a ``data-require="..."`` attribute on the HTML element of the page.

There are an ever-increasing number of modules (you can find them in the ``utils/`` directory) but the ones that you'll most-likely need are:

- ``math`` (for math-related formulas and utility methods)
- ``math-format`` (often used for formatting fractions)
- ``graphie`` (for everything from drawing geometric shapes to plotting functions)
- ``word-problems`` (for word problems)

There are also utils for angles, calculus, exponents, kinematics, probability, etc.  

We just started working on `documenting all of the utility functions <https://github.com/Khan/khan-exercises/wiki/Utility-Module-Reference>`_. A great way to help out *and* become more familiar
with the modules is to help us expand the documentation by editing the reference wiki. Feel free to adjust
formatting, re-organize, whatever makes it easier for everyone to find the utility modules they need.

.. code-block:: html

    <!DOCTYPE html>
    <html data-require="math word-problems"> <!-- Your modules go on this line... -->
    <head>
    	<title>Name of Your Exercise</title>
    	<script src="../khan-exercise.js"></script>
    </head>
