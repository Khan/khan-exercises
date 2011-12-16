Variables
*********

Most mathematical problems that you generate will have some bit of randomness to them (in order to make for an interesting, not-identical, problem). You can generate these values up-front so that you can re-use them again in your problems.

To start you'll want to populate some variables inside the ``<div class="vars">...</div>``. Variables are typically defined by using a ``<var>...</var>`` element. You'll want to specify an ID for the var as that'll be the name that you'll refer to in the future. The content of a ``<var>...</var>`` block will be executed as JavaScript, with access to to all the `properties and methods provided by the JavaScript Math object <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math>`_, as well as all the properties and methods defined in the modules which you have included.

For example to make a variable named ``SPEED1`` that is a number from 11 to 20 you would do:

.. code-block:: html

	<!-- Random number 11 to 20. -->
	<var id="SPEED1">11 + rand(9)</var>


Since the content of ``<var>...</var>`` blocks is executed as JavaScript, you also have full access to the regular syntax of JavaScript, so you can do something slightly more complicated:

.. code-block:: html

  <!-- Random number -10 to -1, 1 to 10. -->
  <var id="A">(random() > 0.5 ? -1 : 1) * (rand(9) + 1)</var>


Generating Random Numbers
-------------------------



If your goal is to generate a random number, there are various options; you can use Math's ``random()``, or one of the following methods defined in the ``math.js`` module (which should be included in all exercises):

- ``randRange( min, max )`` - Get a random integer in [min, max].
- ``randRange( min, max, count )`` - Get a random integer between ``min`` and ``max``, inclusive. If ``count`` is specified, will return an array of random integers in the range.
- ``randRangeUnique( min, max, count )`` - Get an array of unique random numbers between ``min`` and ``max``, inclusive.
- ``randRangeWeighted( min, max, target, perc )`` - Get a random integer between ``min`` and ``max``, inclusive, with a ``perc`` chance of hitting ``target`` (which may or may not be in the range).
- ``randRangeExclude( min, max, excludes )`` - Get a random integer between ``min`` and ``max``, inclusive, that is never any of the values in the ``excludes`` array.
- ``randRangeWeightedExclude( min, max, target, perc, excludes )`` - Get a random integer between ``min`` and ``max``, inclusive, with a ``perc`` chance of hitting ``target`` (which may or may not be in the range). It will never return any of the values in the ``excludes`` array.
- ``randRangeNonZero( min, max )`` - Get a random integer between ``min`` and ``max`` that is never zero.
- ``randFromArray( arr )`` - Get a random member of ``arr``.
- ``shuffle( arr )`` - Returns a copy of ``arr``, shuffled.


Variable Reference
------------------

Inside of a ``<var>...</var>`` you can refer to other variables that you've already defined (order matters) by simply referencing their name. For example in the following we define two variables (``AVG`` and ``TIME``) and then multiply them together and store them in a third variable (``DIST``).

.. code-block:: html

  <!-- Compute one value based upon two others. -->
  <var id="AVG">31 + rand(9)</var>
  <var id="TIME">1 + rand(9)</var>
  <var id="DIST">AVG * TIME</var>


Variable Constraints
--------------------

If you want to make sure certain conditions are met when choosing variables, add a ``data-ensure`` attribute to the vars block. For example, if you want to choose two variables such that the first is greater than the second, you can write:

.. code-block:: html

    <div class="vars" data-ensure="A > B">
        <var id="A">randRange(1, 10)</div>
        <var id="B">randRange(1, 10)</div>
    </div>


If the condition in the ``data-ensure`` block evaluates to false, the entire block will be re-evaluated until the ``data-ensure`` condition evaluates to true. Make sure the condition does not fail too often; if it does, then the variables will have to be re-chosen many times, slowing down the browser, and this is usually a sign that the variables could have been chosen more efficiently.

If only a certain subset of variables need to meet a condition, then you can use a ``data-ensure`` on a subset of variables with a ``div`` element.

.. code-block:: html

    <div class="vars">
        <var id="A">randRange(1, 10)</var>
        <div data-ensure="B < C">
            <var id="B">randRange(1, 10)</var>
            <var id="C">randRange(1, 10)</var>
        </div>
    </div>


This is preferable to placing a ``data-ensure`` on the entire vars block when possible, since only the necessary variables will be re-evaluated.

There may also be cases where you want to make sure a certain condition is met when choosing a *single* variable; in this case, add a ``data-ensure`` attribute to the individual ``var`` element. For example, if you want to make sure two variables have different values, you can write:

.. code-block:: html

    <div class="vars">
        <var id="A">randRange(1, 10)</var>
        <var id="B" data-ensure="A !== B">randRange(1, 10)</var>
    </div>


If you can, place ``data-ensure`` elements as deep into the tree of elements as you can; that is, avoid placing ``data-ensure`` elements on large groups of variables if it's not necessary. Not all behavior can be achieved by placing ``data-ensure`` elements on single variables (for example, choosing A and B such that A < B will produced a skewed distribution if you only place the condition only when choosing B). The idea is to have no "wasted" computation inside ``data-ensure`` elements, since all those computations must be repeated each time the ``data-ensure`` fails.

