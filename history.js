/**
 * Event handlers for when problem history is being viewed.
 */

(function() {

$(Exercises)
	.bind("makeProblemPostHook", renderReadOnlyProblem);

function renderReadOnlyProblem(event, userExercise, answerData, answerType, solution, solutionarea, hints, problem) {
    var framework = Exercises.getCurrentFramework();

    if (typeof userExercise !== "undefined" && userExercise.readOnly) {

        if (framework === "perseus") {
            $(Exercises).trigger("warning", ["Problem history is " + 
                    "not yet available for this exercise.", true]);
        } else if (framework === "khan-exercises") {
            if (!userExercise.current) {
                $(Exercises).trigger("warning", ["This exercise may have " +
                    "changed since it was completed", true]);
            }
        }

        var timelineEvents, timeline;

        var timelinecontainer = $("<div id='timelinecontainer'>")
            .append("<div>\n" +
                    "<div id='previous-problem' class='simple-button'>Previous Problem</div>\n" +
                    "<div id='previous-step' class='simple-button'><span>Previous Step</span></div>\n" +
                    "</div>")
            .insertBefore("#problem-and-answer");

        $.fn.disable = function() {
            this.addClass("disabled")
                .css({
                    cursor: "default !important"
                })
                .data("disabled", true);
            return this;
        }

        $.fn.enable = function() {
            this.removeClass("disabled")
                .css({
                    cursor: "pointer"
                })
                .data("disabled", false);
            return this;
        }

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
                    "<div id='next-problem' class='simple-button'>Next Problem</div>\n" +
                    "<div id='next-step' class='simple-button'><span>Next Step</span></div>\n" +
                    "</div>");

        $("<div class='user-activity correct-activity'>Started</div>")
            .data("hint", false)
            .appendTo(timelineEvents);

        var hintNumber = 0;

        /* value[0]: css class
         * value[1]: guess
         * value[2]: time taken since last guess
         */
        $.each(userExercise.userActivity, function(index, value) {
            var guess = value[1] === "Activity Unavailable" ? value[1] : JSON.parse(value[1]),
                thissolutionarea;

            timelineEvents
                .append("<div class='timeline-time'>" + value[2] + "s</div>");

            thissolutionarea = $("<div>")
                .addClass("user-activity " + value[0])
                .appendTo(timelineEvents);

            if (value[0] === "hint-activity") {
                thissolutionarea.attr("title", "Hint used");
                thissolutionarea
                    .data("hint", hintNumber)
                    .prepend("Hint #" + (hintNumber + 1));
                hintNumber += 1;
            } else { // This panel is a solution (or the first panel)
                thissolutionarea.data("hint", false);
                if (guess === "Activity Unavailable") {
                    thissolutionarea.text(guess);
                } else {
                    if (framework === "perseus") {
                        thissolutionarea
                            .removeClass("incorrect-activity")
                            .addClass("correct-activity");
                        thissolutionarea.attr("title", "Answer Attempted");
                        thissolutionarea.append(
                            $("<p class='solution'>Answer attempted</p>")
                        );
                    } else if (framework === "khan-exercises") {
                        // radio and custom are the only answer types that
                        // can't display its own guesses in the activity bar
                        var validator = Khan.answerTypes[answerType].setup(null, solution).validator;

                        if (answerType === "radio") {
                            thissolutionarea.append(
                                // Add the guess to the activity bar
                                $("<p class='solution'>" + guess + "</p>").tmpl()
                            );
                            if (validator(guess)) {
                                thissolutionarea
                                    .removeClass("incorrect-activity")
                                    .addClass("correct-activity");
                                thissolutionarea.attr("title", "Correct Answer");
                            } else {
                                thissolutionarea.attr("title", "Incorrect Answer");
                            }
                        } else if (answerType === "custom") {
                            if (validator(guess)) {
                                thissolutionarea
                                    .removeClass("incorrect-activity")
                                    .addClass("correct-activity");
                                thissolutionarea.attr("title", "Correct Answer");
                                thissolutionarea.append(
                                    $("<p class='solution'>Answer correct</p>")
                                );
                            } else {
                                thissolutionarea.attr("title", "Incorrect Answer");
                                thissolutionarea.append(
                                    $("<p class='solution'>Answer incorrect</p>")
                                );
                            }
                        } else {
                            var thisAnswerData = Khan.answerTypes[answerType].setup(thissolutionarea, solution);

                            thisAnswerData.showGuess(guess);

                            if (thisAnswerData.validator(guess) === true) {
                                // If the user didn't get the problem right on the first try, all
                                // answers are labelled incorrect by default
                                thissolutionarea
                                    .removeClass("incorrect-activity")
                                    .addClass("correct-activity");

                                thissolutionarea.attr("title", "Correct Answer");
                            } else {
                                thissolutionarea
                                    .removeClass("correct-activity")
                                    .addClass("incorrect-activity");
                                thissolutionarea.attr("title", "Incorrect Answer");
                            }
                        }
                    }

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
            timelineMiddle = timeline.width() / 2,
            realHintsArea = $("#hintsarea"),
            realWorkArea = $("#workarea"),
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
                timelineEvents.children('.correct-activity, .incorrect-activity').each(function() {
                    $(this).text('Answer');
                });
            } else if (maxHeight > timelinecontainer.height()) {
                timelinecontainer.height(maxHeight);
                timeline.height(maxHeight);
            }
        });

        var create = function(i) {
            var thisSlide = states.eq(i);

            var thisHintArea, thisProblem,
                hintNum = $("#timeline-events .user-activity:lt(" + (i + 1) + ")")
                        .filter(".hint-activity").length - 1,
                // Bring the currently focused panel as close to the middle as possible
                itemOffset = thisSlide.position().left,
                itemMiddle = itemOffset + thisSlide.width() / 2,
                offset = timelineMiddle - itemMiddle,
                currentScroll = timeline.scrollLeft(),
                timelineMax = states.eq(-1).position().left + states.eq(-1).width() + 5,
                scroll = Math.min(currentScroll - offset, currentScroll + timelineMax - timeline.width() + 25);

            if (hintNum >= 0) {
                $(hints[hintNum]).appendTo(realHintsArea).runModules(problem);
            }

            MathJax.Hub.Queue(function() {
                var recordState = function() {
                    $("#problemarea input").attr({disabled: "disabled"});
                    thisHintArea = realHintsArea.clone();
                    thisProblem = realWorkArea.clone();

                    var thisState = {
                        slide: thisSlide,
                        hintNum: hintNum,
                        hintArea: thisHintArea,
                        problem: thisProblem,
                        scroll: scroll
                    };

                    statelist[i] = thisState;

                    if (i + 1 < states.length) {
                        // Create the next state
                        MathJax.Hub.Queue(function() {
                            create(i + 1);
                        });
                    } else {
                        // Scroll to the starting state
                        activate(currentSlide);
                    }
                };

                if (framework === "khan-exercises") {
                    if (thisSlide.data("guess") !== undefined && $.isFunction(answerData.showCustomGuess)) {
                        KhanUtil.currentGraph = $(realWorkArea).find(".graphie").data("graphie");
                        answerData.showCustomGuess(thisSlide.data("guess"));
                        MathJax.Hub.Queue(recordState);
                    } else {
                        recordState();
                    }
                }

            });
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
                // fire the "show guess" event
                $(Khan).trigger("showGuess");

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

        if (framework === "perseus") {
            // TODO(cbhl): Implement Problem History for Perseus, then remove
            // this hack.
            timelinecontainer.hide();
        }
    }
}

})();
