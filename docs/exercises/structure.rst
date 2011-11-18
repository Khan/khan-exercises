Problem Structure
=================

Problems are a collection of a problem overview (or introduction), a question, and a solution. All problems are contained within an element with a class of "problems".

Single Problems
***************

The basic structure of a problem looks something like this (indents will be appropriate for copy and paste):

.. code-block:: html

    <div class="problems">
        <div id="problem-type-or-description">
            <p class="problem"><!-- An overview of the problem including all needed info. --></p>
            <p class="question"><!-- The question to ask the student. --></p>
            <p class="solution"><!-- The correct answer expected of the student. --></p>
        </div>
    </div>


The exact elements that you use aren't important (they could be divs or paragraphs or something else entirely); all that matters is that they have the proper classes ("problem", "question", and "solution").

When defining the various parts of the problem, it will be necessary to refer to the variables you defined in the vars block. When defining the introduction, question, and solution, you can always refer to previously-defined variables with a ``<var></var>`` block; for the full list of formatting options (which are all available when defining the introduction and question), see the Formatting section of this wiki.

Note on ``div class="problems"`` and ``p class="problem"``
----------------------------------------------------------

You will see that at the top, we have a ``<div class="problems">`` markup.  This is a wrapper which contains all the code that generates the problem - the question, the solution, the hints, multiple types of problems, everything except globally declared variables.

In contrast, the ``<p class="problem">`` markup indicates that you are generating the intro or overview part of the problem. We want to use the class ``"problem"`` here for consistency but you can can think of it as "introduction" or "overview" or "needed info."

Problem or Introduction
-----------------------

The problem overview/introduction is optional and is defined with a class of "problem." It is mainly useful for word problems or any kind of problem that has important text or information that isn't explicitly part of the statement of the question. For example, a Physics problem may describe the situation and the various objects in the world before asking about a certain quality of a certain object.

You could also put information in after the question if you want to provide clarity on how to answer the question.  For example:

.. code-block:: html


    <p class="question">Express <var>DECIMAL</var> as a fraction.</p>
    <p class="extra-info"><i>(Extra Info: You can express this as any fraction -
      you don't have to "reduce to lowest terms" for the correct answer)</i></p>



will let the user know what kind of answer is acceptable.  If you are doing this, ``extra-info`` can be used for consistency.

Question
--------

The question is required and is defined with a class of "question". At the moment, the question is appended directly after the problem and is formatted the same, although this may change depending on the system.

We provide these guidelines for how to choose the problem overview content and question content, but they are ultimately left at the discretion of the exercise author. The contents are not handled or interpreted in any particular way.

Solution
--------

Unlike problem introductions and questions, solutions do have a very specific form of markup. Like introductions and questions, it is the class name ("solution") which matters, not the element type; however, the content of the solution element is very important and is used as the basis for validating the user's input.

 For example, a valid solution that is dynamically-generated from a previously-created variable would be:

.. code-block:: html

    <p class="solution"><var>round(DIST1)</var></p>


The user would then need to enter a number into the fill-in-the-blank form that matches the ``DIST1`` variable, rounded to the nearest integer.



Multiple Problem Structure
**************************

While it's totally possible that you might create an exercise with a single type of problem, it's very likely that you'll want to provide students with multiple styles of problems to challenge them.

You will recall that the problem section of an exercise looks like this:

.. code-block:: html

    <div class="problems">
        <div id="problem-type-or-description">
            <p class="problem"><!-- An overview of the problem including all needed info. --></p>
            <p class="question"><!-- The question to ask the student. --></p>
            <p class="solution"><!-- The correct answer expected of the student. --></p>
        </div>
    </div>


When building an exercise with multiple problems, the problems part of the code will look like:

.. code-block:: html

    <div class="problems">
        <div id="problem-type-or-description-ONE">
            <p class="problem"><!-- An overview of the problem including all needed info. --></p>
            <p class="question"><!-- The question to ask the student. --></p>
            <p class="solution"><!-- The correct answer expected of the student. --></p>
        </div>

        <div id="problem-type-or-description-TWO">
            <p class="problem"><!-- An overview of the problem including all needed info. --></p>
            <p class="question"><!-- The question to ask the student. --></p>
            <p class="solution"><!-- The correct answer expected of the student. --></p>
        </div>
    </div>


So all the problems exist between the ``<div class="problems">`` wrapper and each different type of problem should have its own unique ID (examples below). Thankfully, you won't have to re-write the entire problem from scratch.  You'll only have to write the new portions of the problem that differ from the original.

OR: If you are doing word problems and you do have similar problems that have completely different structures (e.g. multiplication word problems involving money and multiplication word problems involving objects), then this structure also allows you to change everything within unique problem ID: variables, overview, question, solution, hints, everything.

Let's go through each of these two examples of create multiple problem.

Expanding / Extending a base or core problem
--------------------------------------------

For expanding and extending an existing problem, the way you do it is by adding a unique ID to one of your problems and then referencing it from subsequent problems using a ``data-type="ID"`` attribute.

For example one problem could ask for total distance travelled, another could ask for how long it took the travel the distance, etc. In the following markup we create two types of problems. One is the base or core problem (with the ID of "original") and the other is the problem that inherits from the original.

.. code-block:: html

    <div id="original">
        <div class="problem">
            <p>Ben traveled by <var>CAR1</var> at an avg speed of <var>SPEED1</var> mph.</p>
            <p>He also traveled by <var>CAR2</var> at an avg speed of <var>SPEED2</var> mph.</p>
            <p>The total distance covered was <var>DIST</var> miles for <var>TIME</var> hours.</p>
        </div>
        <p class="question">How many miles did Ben go by <var>VEHICLE1</var>? (Round to the nearest mile.)</p>
        <p class="solution"><var>round(DIST1)</var></p>
    </div>

    <div id="vehicle-2-distance" data-type="original">
        <p class="question">How many miles did Ben go by <var>VEHICLE2</var>? (Round to the nearest mile.)</p>
        <p class="solution"><var>round(DIST2)</var></p>
    </div>


Note how the second problem doesn't provide a problem definition. This problem definition is inherited directly from the original problem when we put in ``data-type="original"`` next to "vehicle-2-distance." Any markup provided by a subsequent problem will override the original. For example providing a "question" in a follow-up problem will override the "question" coming from the original.

Using this technique you can easily generate many different styles of problems with only minimal amounts of typing.

In general, we would like exercises to be as modular as possible, so consider creating multiple separate exercises unless the problems you are considering are fundamentally very similar. 

Similar Problems, Completely Difference Structures
--------------------------------------------------

There are times where you will want two types of problems in the same exercise that share nothing in common, not even variables.  The following is the basic layout for an X problem, X structure exercise (This is everything between the ``<div class="exercise">`` tags:

.. code-block:: html

    <div class="problems">

        <div id="problem-type-or-description-ONE">
            <div class="vars">
                <var id="NUM_1">randRange( 3, 12 )</var>
                <var id="AMT_1">randRange( 2, 12 )</var>
            </div>

            <p class="problem">A scarf costs $<var>NUM_1</var>. You buy multiple scarves.</p>
            <p class="question">How much would <var>AMT_1</var> scarves cost?</p>
            <p class="solution"><var>NUM_1 * AMT_1</var></p>

            <div class="hints">
                <p>This is a multiplication question.</p>
                <p>The answer is <var>NUM_1 * AMT_1</var> dollars.</p>
            </div>

        </div>

        <div id="problem-type-or-description-TWO">
            <div class="vars" data-ensure="PARENT_MULT * CHILD_AGE -19 > CHILD_AGE">
                <var id="CHILD_AGE">randRange(2, 9)</var>
                <var id="PARENT_MULT">randRange(2, 12)</var>
                <!-- parent can be 108 years old max, reasonable -->
            </div>

            <p class="problem">Sally is <var>CHILD_AGE</var> years old.
                               Her mom is <var>PARENT_MULT</var> times older.</p>
            <p class="question">How old is Sally's mom?</p>
            <p class="solution"><var>PARENT_MULT * CHILD_AGE</var></p>

            <div class="hints">
                <p>"Times older" is a clue word for multiplication.</p>
                <p>Sally's mom is <var>PARENT_MULT * CHILD_AGE</var> years old.</p>
            </div>
        </div>
    </div>


As you can see, with this structure, each problem type is a completely self contained unit, where each problem type has defined its own variables, questions, solutions and hints.

There is more on Multiple Problems at: [More on Multiple Problems](https://github.com/Khan/khan-exercises/wiki/More-on-Multiple-Problems)
