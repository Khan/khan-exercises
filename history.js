/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-undef, no-var, one-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/**
 * Event handlers for when problem history is being viewed.
 *
 * This happens in two situations currently:
 * (1) viewing another user's exercises (e.g. a student)
 * (2) The 'problem-out-of-order' banner is showing
 * This is not well-tested code; it may currently be broken in one or both
 * or these situations!
 */

(function() {

$(Exercises).bind("newProblem", renderReadOnlyProblem);

function renderReadOnlyProblem(event, args) {
    var userExercise = args.userExercise;
    var answerData = args.answerData;
    var hints = args.hints;
    var problem = args.problem;

    var solutionarea = $("#solutionarea");

    if (typeof userExercise !== "undefined" && userExercise.readOnly) {

        $(Exercises).trigger("warning", [i18n._("Problem history is " +
                "not yet available for this exercise."), true]);

        var timelineEvents, timeline;

        var timelinecontainer = $("<div id='timelinecontainer'>")
            .append("<div>\n" +
                    "<div id='previous-problem' class='simple-button'>" +
                    i18n._("Previous Problem") + "</div>\n" +
                    "<div id='previous-step' class='simple-button'><span>" +
                    i18n._("Previous Step") + "</span></div>\n</div>")
            .insertBefore("#problem-and-answer");

        $.fn.disable = function() {
            this.addClass("disabled")
                .css({
                    cursor: "default !important"
                })
                .data("disabled", true);
            return this;
        };

        $.fn.enable = function() {
            this.removeClass("disabled")
                .css({
                    cursor: "pointer"
                })
                .data("disabled", false);
            return this;
        };

        if (userExercise.totalDone === 0) {
            $("#previous-problem").disable();
        }

        timeline = $("<div id='timeline'>").appendTo(timelinecontainer);
        timelineEvents = $("<div id='timeline-events'>").appendTo(timeline);

        // Grab both scrubbers packaged up in one jQuery object. This is
        // wrapped in a function just because the variables held inside are
        // not used elsewhere
        var scrubber = (function() {
            var scrubberCss = {
                        display: "block",
                        width: "0",
                        height: "0",
                        "border-left": "6px solid transparent",
                        "border-right": "6px solid transparent",
                        position: "absolute"
                    },

                scrubber1 = $("<div>")
                    .css($.extend({}, scrubberCss, {
                        "border-top": "6px solid #888",
                        top: "0"
                    }))
                    .appendTo(timeline),

                scrubber2 = $("<div>")
                    .css($.extend({}, scrubberCss, {
                        "border-bottom": "6px solid #888",
                        bottom: "0"
                    }))
                    .appendTo(timeline);

            return scrubber1.add(scrubber2);
        })();

        timelinecontainer
            .append("<div>\n" +
                    "<div id='next-problem' class='simple-button'>" +
                    i18n._("Next Problem") + "</div>\n" +
                    "<div id='next-step' class='simple-button'><span>" +
                    i18n._("Next Step") + "</span></div>\n</div>");

        $("<div class='user-activity correct-activity'>" + i18n._("Started") + "</div>")
            .data("hint", false)
            .appendTo(timelineEvents);

        var hintNumber = 0;

        /* value[0]: css class
         * value[1]: guess
         * value[2]: time taken since last guess
         */
        $.each(userExercise.userActivity, function(index, value) {
            // TODO(emily): figure out where this is coming from, and if we
            // can remove it. It shouldn't be i18n-ized though
            var guess = value[1] === "Activity Unavailable" ? value[1] : JSON.parse(value[1]),
                thissolutionarea;

            timelineEvents
                // I18N: This is a number of seconds, like '3s'
                .append("<div class='timeline-time'>" + i18n._("%(time)ss", {time: value[2]}) + "</div>");

            thissolutionarea = $("<div>")
                .addClass("user-activity " + value[0])
                .appendTo(timelineEvents);

            if (value[0] === "hint-activity") {
                thissolutionarea.attr("title", i18n._("Hint used"));
                thissolutionarea
                    .data("hint", hintNumber)
                    .prepend(i18n._("Hint #%(num)s", {num: (hintNumber + 1)}));
                hintNumber += 1;
            } else { // This panel is a solution (or the first panel)
                thissolutionarea.data("hint", false);
                // See above, this shouldn't be i18n-ized
                if (guess === "Activity Unavailable") {
                    thissolutionarea.text(guess);
                } else {
                    thissolutionarea
                        .removeClass("incorrect-activity")
                        .addClass("correct-activity");
                    thissolutionarea.attr("title", i18n._("Answer Attempted"));
                    thissolutionarea.append(
                        $("<p class='solution'>" + i18n._("Answer attempted") + "</p>")
                    );

                    thissolutionarea
                        .data("guess", guess)
                            .find("input")
                            .attr("disabled", true)
                        .end()
                            .find("select")
                            .attr("disabled", true);
                }
            }
        });

        if (timelinecontainer.height() > timeline.height()) {
            timeline.height(timelinecontainer.height());
        }

        var states = timelineEvents.children(".user-activity"),
            currentSlide = Math.min(states.length - 1, 1),
            numSlides = states.length,
            realHintsArea = $("#hintsarea"),
            statelist = [],
            previousHintNum = 100000;

        // So highlighting doesn't fade to white
        $("#solutionarea").css("background-color", $("#answercontent").css("background-color"));

        // scroll to the slide held in state
        var scrub = function(state, fadeTime) {
            var timeline = $("#timeline"),
                slide = state.slide;

            timeline.animate({
                scrollLeft: state.scroll
            }, fadeTime);

            scrubber.animate({
                left: (timeline.scrollLeft() + slide.position().left + slide.outerWidth() / 2 + 2) + "px"
            }, fadeTime);
        };

        // Set the width of the timeline (starts as 10000px) after MathJax loads
        MathJax.Hub.Queue(function() {
            var maxHeight = 0;
            timelineEvents.children().each(function() {
                maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
            });

            // This thing looks ridiculous above about 100px
            if (maxHeight > 100) {
                timelineEvents.children(".correct-activity, .incorrect-activity").each(function() {
                    $(this).text(i18n._("Answer"));
                });
            } else if (maxHeight > timelinecontainer.height()) {
                timelinecontainer.height(maxHeight);
                timeline.height(maxHeight);
            }
        });

        var create = function(i) {
            var hintNum = $("#timeline-events .user-activity:lt(" + (i + 1) + ")")
                        .filter(".hint-activity").length - 1;

            if (hintNum >= 0) {
                $(hints[hintNum]).appendTo(realHintsArea).runModules(problem);
            }
        };

        var activate = function(slideNum) {
            var thisState,
                thisSlide = states.eq(slideNum),
                fadeTime = 150;

            // All content for this state has been built before
            if (statelist[slideNum]) {
                thisState = statelist[slideNum];

                scrub(thisState, fadeTime);

                $("#workarea").remove();
                $("#hintsarea").remove();
                $("#problemarea").append(thisState.problem).append(thisState.hintArea);

                if (thisSlide.data("guess") !== undefined) {
                    solutionarea.effect("highlight", {}, fadeTime);

                    // If there is a guess we show it as if it was filled in by the user
                    answerData.showGuess(thisSlide.data("guess"));
                } else {
                    answerData.showGuess();
                }

                // TODO: still highlight even if hint modifies problem (and highlight following hints)
                if (slideNum > 0 && (thisState.hintNum > statelist[slideNum - 1].hintNum)) {
                    $("#hintsarea").children().each(function(index, elem) {
                        if (index > previousHintNum) {
                            $(elem).effect("highlight", {}, fadeTime);
                        }
                    });

                    previousHintNum = thisState.hintNum;
                }

                $("#previous-step, #next-step").enable();
                if (slideNum === 0) {
                    previousHintNum = -1;
                    $("#previous-step").disable();
                } else if (slideNum === numSlides - 1) {
                    $("#next-step").disable();
                }
            }
        };

        MathJax.Hub.Queue(function() {create(0);});

        // Allow users to use arrow keys to move left and right in the
        // timeline
        $(document).keydown(function(event) {
            if (event.keyCode === 37) { // left
                currentSlide -= 1;
            } else if (event.keyCode === 39) { // right
                currentSlide += 1;
            } else {
                return;
            }

            currentSlide = Math.min(currentSlide, numSlides - 1);
            currentSlide = Math.max(currentSlide, 0);

            activate(currentSlide);

            return false;
        });

        // Allow users to click on points of the timeline
        $(states).click(function() {
            var index = $(this).index("#timeline .user-activity");

            currentSlide = index;
            activate(currentSlide);

            return false;
        });

        $("#previous-step").click(function() {
            if (currentSlide > 0) {
                currentSlide -= 1;
                activate(currentSlide);
            }

            return false;
        });

        $("#next-step").click(function() {
            if (currentSlide < numSlides - 1) {
                currentSlide += 1;
                activate(currentSlide);
            }

            return false;
        });

        $("#next-problem").click(function() {
            window.location.href = userExercise.nextProblemUrl;
        });

        $("#previous-problem").click(function() {
            if (!$(this).data("disabled")) {
                window.location.href = userExercise.previousProblemUrl;
            }
        });

        // Some exercises use custom css
        $("#timeline input[type='text']").css("width",
            $("#answer_area input[type='text']").css("width")
        );

        $("#hint").attr("disabled", true);
        $("#answercontent input").attr("disabled", true);
        $("#answercontent select").attr("disabled", true);

        // TODO(cbhl): Implement Problem History for Perseus, then remove
        // this hack.
        timelinecontainer.hide();
    }
}

})();
