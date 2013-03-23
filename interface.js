/**
 * Interface glue to handle events from 'Exercises' and talk to 'Khan' or some
 * Perseus object, whichever is appropriate for the current exercise.
 *
 * In general, khan-exercises and perseus will want to trigger events on
 * Exercises but only listen to their own events.
 */
(function() {

// If any of these properties have already been defined, then leave them --
// this happens in local mode
_.defaults(Exercises, {
    khanExercisesUrlBase: "/khan-exercises/",

    getCurrentFramework: function() {
        // TODO(alpert): Is this icky?
        return Exercises.practiceExercise.getFramework();
    }
});

_.extend(Exercises, {
    guessLog: undefined,
    userActivityLog: undefined
});


// Store localMode here so that it's hard to change after the fact via
// bookmarklet, etc.
var localMode = Exercises.localMode,

    originalCheckAnswerText,

    userExercise,
    problemNum,

    attempts,
    numHints,
    hintsUsed,
    lastAttemptOrHint;

$(Exercises)
    .bind("problemTemplateRendered", problemTemplateRendered)
    .bind("newProblem", newProblem)
    .bind("hintUsed", hintUsed)
    .bind("readyForNextProblem", readyForNextProblem)
    .bind("warning", warning)
    .bind("upcomingExercise", upcomingExercise)
    .bind("gotoNextProblem", gotoNextProblem)
    .bind("updateUserExercise", updateUserExercise)
    .bind("clearExistingProblem", clearExistingProblem);


function problemTemplateRendered() {
    // Setup appropriate img URLs
    $("#issue-throbber").attr("src",
            Exercises.khanExercisesUrlBase + "css/images/throbber.gif");

    // 'Check Answer' or 'Submit Answer'
    originalCheckAnswerText = $("#check-answer-button").val();

    // Solution submission
    $("#check-answer-button").click(handleCheckAnswer);
    $("#answerform").submit(handleCheckAnswer);

    // Hint button
    $("#hint").click(handleHint);

    // Next question button
    $("#next-question-button").click(function() {
        $(Exercises).trigger("gotoNextProblem");

        // Disable next question button until next time
        // TODO(alpert): Why? Is blurring not enough?
        $(this)
            .attr("disabled", true)
            .addClass("buttonDisabled");
    });

    // If happy face is clicked, pass click on through.
    $("#positive-reinforcement").click(function() {
        $("#next-question-button").click();
    });

    // Let users close the warning bar when appropriate
    $("#warning-bar-close a").click(function(e) {
        e.preventDefault();
        $("#warning-bar").fadeOut("slow");
    });

    // Scratchpad toggle
    $("#scratchpad-show").click(function(e) {
        e.preventDefault();
        Khan.scratchpad.toggle();

        if (!localMode && userExercise.user) {
            window.localStorage["scratchpad:" + userExercise.user] =
                    Khan.scratchpad.isVisible();
        }
    });

    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        // TODO(alpert)
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("problemTemplateRendered");
    }
}

function newProblem(e, data) {
    Exercises.guessLog = [];
    Exercises.userActivityLog = [];

    attempts = 0;
    numHints = data.numHints;
    hintsUsed = 0;
    lastAttemptOrHint = new Date().getTime();
}


function handleCheckAnswer() {
    var framework = Exercises.getCurrentFramework();

    // Stop if the form is already disabled and we're waiting for a response
    // (in assessment mode, for instance).
    if ($("#answercontent input").not("#hint, #next-question-button")
            .is(":disabled")) {
        return false;
    }

    var score = Khan.scoreInput();

    // Stop if the user didn't enter a response
    if (score.empty) {
        return false;
    }

    var curTime = new Date().getTime();
    var timeTaken = Math.round((curTime - lastAttemptOrHint) / 1000);
    lastAttemptOrHint = curTime;

    Exercises.guessLog.push(score.guess);
    Exercises.userActivityLog.push([
            score.correct ? "correct-activity" : "incorrect-activity",
            JSON.stringify(score.guess), timeTaken]);

    // Update interface corresponding to correctness
    if (Exercises.assessmentMode) {
        disableCheckAnswer();
    } else if (score.correct) {
        // Correct answer, so show the next question button.
        $("#check-answer-button").hide();
        $("#next-question-button")
            .removeAttr("disabled")
            .removeClass("buttonDisabled")
            .show()
            .focus();
        $("#positive-reinforcement").show();
    } else {
        // Wrong answer. Enable all the input elements
        //$("#answercontent input").not("#hint")
        //    .removeAttr("disabled");

        $("#check-answer-button")
            .parent()  // .check-answer-wrapper makes shake behave
            .effect("shake", {times: 3, distance: 5}, 480)
            .val("Try Again");

        // Is this a message to be shown?
        if (score.message != null) {
            $("#check-answer-results > p").html(score.message).tmpl().show();
        } else {
            $("#check-answer-results > p").hide();
        }

        if (framework === "perseus") {
            // TODO(alpert)?
        } else if (framework === "khan-exercises") {
            $(Khan).trigger("refocusSolutionInput");
        }
    }

    if (score.correct) {
        $(Exercises).trigger("problemDone");
    }

    $(Exercises).trigger("checkAnswer", {
        correct: score.correct,

        // Determine if this attempt qualifies as fast completion
        fast: !localMode && userExercise.secondsPerFastProblem >= timeTaken
    });

    if (localMode) {
        // Skip the server; just pretend we have success
        $(Khan).trigger("attemptSaved");
        return false;
    }

    // Save the problem results to the server
    var data = buildAttemptData(score.correct, ++attempts,
            JSON.stringify(score.guess), timeTaken);

    request("problems/" + problemNum + "/attempt", data).then(function() {
        $(Khan).trigger("attemptSaved");
    }, function(xhr) {
        // Alert any listeners of the error before reload
        $(Exercises).trigger("attemptError");

        if (xhr && xhr.readyState === 0) {
            // This path gets called when there is a broken pipe during
            // page unload- browser navigating away during ajax request
            // See http://stackoverflow.com/a/1370383.
            return;
        }

        // Error during submit. Disable the page and ask users to
        // reload in an attempt to get updated data.

        // Hide the page so users don't continue, then warn the user about the
        // problem and encourage reloading the page
        $("#problem-and-answer").css("visibility", "hidden");
        $(Exercises).trigger("warning",
                "This page is out of date. You need to <a href='" +
                _.escape(window.location.href) + "'>refresh</a>, but " +
                "don't worry, you haven't lost progress. If you think " +
                "this is a mistake, <a href='http://www.khanacademy.org/" +
                "reportissue?type=Defect&issue_labels='>tell us</a>.");
    });

    return false;
}

function handleHint() {
    var framework = Exercises.getCurrentFramework();

    if (framework === "perseus") {
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("showHint");
    }
}

function hintUsed() {
    // Grow the scratchpad to cover the new hint
    Khan.scratchpad.resize();

    hintsUsed++;
    var hintsLeft = numHints - hintsUsed;

    // TODO(alpert): Get rid of hints.js; it's silly
    var $hintButton = $("#hint");
    var stepsLeft = hintsLeft === 1 ? "1 hint left" :
            hintsLeft + " hints left";
    $hintButton.val($hintButton.data("buttonText") ||
            "I'd like another hint (" + stepsLeft + ")");

    // If there aren't any more hints, disable the get hint button
    if (hintsLeft === 0) {
        $hintButton.attr("disabled", true);
        $(Exercises).trigger("allHintsUsed");
    }

    var curTime = new Date().getTime();
    var timeTaken = Math.round((curTime - lastAttemptOrHint) / 1000);
    lastAttemptOrHint = curTime;

    Exercises.userActivityLog.push(["hint-activity", "0", timeTaken]);

    // TODO(alpert): Determine answeredCorrectly in a better way
    var answeredCorrectly = $("#next-question-button").is(":visible");
    if (!localMode && !userExercise.readOnly && !answeredCorrectly) {

        // Resets the streak and logs history for exercise viewer
        // Don't do anything on success or failure; silently failing is ok here
        request("problems/" + problemNum + "/hint",
                buildAttemptData(false, attempts, "hint", timeTaken));
    }
}

// Build the data to pass to the server
function buildAttemptData(pass, attemptNum, attemptContent, timeTaken) {
    var framework = Exercises.getCurrentFramework();
    var data;

    if (framework === "perseus") {
        // TODO(alpert)
        data = {};
    } else if (framework === "khan-exercises") {
        data = _.extend({
            complete: pass === true ? 1 : 0
        }, Khan.getSeedInfo());
    }

    _.extend(data, {
        // Ask for camel casing in returned response
        casing: "camel",

        // Whether we're moving to the next problem (i.e., correctness)
        count_hints: hintsUsed,
        time_taken: timeTaken,

        // How many times the problem was attempted
        attempt_number: attemptNum,

        // The answer the user gave
        attempt_content: attemptContent,

        // Whether we're currently in review mode
        review_mode: Exercises.reviewMode ? 1 : 0,

        // Whether we are currently working on a topic, as opposed to an exercise
        topic_mode: (!Exercises.reviewMode && !Exercises.practiceMode) ? 1 : 0,

        // The current card data
        card: JSON.stringify(Exercises.currentCard),

        // Unique ID of the cached stack
        stack_uid: Exercises.completeStack.getUid(),

        // The current topic, if any
        topic_id: Exercises.topic && Exercises.topic.id,

        // How many cards the user has already done
        cards_done: Exercises.completeStack.length,

        // How many cards the user has left to do
        cards_left: Exercises.incompleteStack.length - 1,

        // Custom stack ID if it exists
        custom_stack_id: Exercises.completeStack.getCustomStackID(),

        // The user assessment key if in assessmentMode
        user_assessment_key: Exercises.userAssessmentKey
    });

    return data;
}


var attemptHintQueue = jQuery({});

// If there are any requests left in the queue when the window unloads then we
// will have permanently lost their answers and will need to clear the session
// cache, to make sure we don't override what is passed down from the servers
$(window).unload(function() {
    if (attemptHintQueue.queue().length) {
        $(Exercises).trigger("attemptError");
    }
});

function request(method, data) {
    var apiBaseUrl = (Exercises.assessmentMode ?
            "/api/v1/user/assessment/exercises" : "/api/v1/user/exercises");

    var params = {
        // Do a request to the server API
        url: apiBaseUrl + "/" + userExercise.exerciseModel.name + "/" + method,
        type: "POST",
        data: data,
        dataType: "json"
    };

    var deferred = $.Deferred();

    attemptHintQueue.queue(function(next) {
        $.ajax(params).then(function(data, textStatus, jqXHR) {
            deferred.resolve(data, textStatus, jqXHR);

            // Tell any listeners that we now have new userExercise data
            $(Exercises).trigger("updateUserExercise", {
                userExercise: data,
                source: "serverResponse"
            });
        }, function(jqXHR, textStatus, errorThrown) {
            // Execute passed error function first in case it wants different
            // behavior depending upon the length of the request queue
            // TODO(alpert): Huh? Don't think this matters.
            deferred.reject(jqXHR, textStatus, errorThrown);

            // Clear the queue so we don't spit out a bunch of queued up
            // requests after the error
            attemptHintQueue.clearQueue();
        }).always(function() {
            $(Exercises).trigger("apiRequestEnded");
            next();
        });
    });

    // Trigger an apiRequestStarted event here, and not in the queued function
    // because listeners should know an API request is waiting as soon as it
    // gets queued up.
    $(Exercises).trigger("apiRequestStarted");

    return deferred.promise();
}


function readyForNextProblem(e, data) {
    userExercise = data.userExercise;
    problemNum = userExercise.totalDone + 1;

    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        // TODO(alpert)
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("readyForNextProblem", data);
    }
}

function warning(e, message, showClose) {
    $(function() {
        var warningBar = $("#warning-bar");
        $("#warning-bar-content").html(message);
        if (showClose) {
            warningBar.addClass("warning")
                  .children("#warning-bar-close").show();
        } else {
            warningBar.addClass("error")
                  .children("#warning-bar-close").hide();
        }
        warningBar.fadeIn("fast");
    });
}

function upcomingExercise(e, data) {
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        // TODO(alpert)
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("upcomingExercise", data);
    }
}


function gotoNextProblem() {
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        // TODO(alpert)
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("gotoNextProblem");
    }
}

function updateUserExercise(e, data) {
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        // TODO(alpert)
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("updateUserExercise", data);
    }
}


function enableCheckAnswer() {
    $("#check-answer-button")
        .removeAttr("disabled")
        .removeClass("buttonDisabled")
        .val(originalCheckAnswerText);
}

function disableCheckAnswer() {
    $("#check-answer-button")
        .attr("disabled", "disabled")
        .addClass("buttonDisabled")
        .val("Please wait...");
}

function clearExistingProblem() {
    var framework = Exercises.getCurrentFramework();
    enableCheckAnswer();

    $("#happy").hide();
    if (!$("#examples-show").data("show")) {
        $("#examples-show").click();
    }

    // Toggle the navigation buttons
    $("#check-answer-button").show();
    $("#next-question-button").blur().hide();
    $("#positive-reinforcement").hide();

    // Wipe out any previous problem
    if (framework === "perseus") {
        // TODO(alpert): Do we have cleanup to do?
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("cleanupProblem");
    }
    $("#workarea, #hintsarea").empty();

    // Take off the event handlers for disabling check answer; we'll rebind
    // if we actually want them
    $("#solutionarea").off(".emptyAnswer");

    Khan.scratchpad.clear();
}

})();
