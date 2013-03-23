/**
 * Interface glue to handle events from 'Exercises' and talk to 'Khan' or some
 * Perseus object, whichever is appropriate for the current exercise.
 *
 * In general, khan-exercises and perseus will want to trigger events on
 * Exercises but only listen to their own events.
 */
(function() {


// (khan-exercises in local mode will stub this out)
// TODO(alpert): Is this icky?
Exercises.getCurrentFramework = function() {
    return Exercises.practiceExercise.getFramework();
};


$(Exercises)
    .bind("problemTemplateRendered", problemTemplateRendered)
    .bind("readyForNextProblem", readyForNextProblem)
    .bind("warning", warning)
    .bind("upcomingExercise", upcomingExercise)
    .bind("gotoNextProblem", gotoNextProblem)
    .bind("updateUserExercise", updateUserExercise)
    .bind("enableCheckAnswer", enableCheckAnswer)
    .bind("disableCheckAnswer", disableCheckAnswer)
    .bind("clearExistingProblem", clearExistingProblem);


function problemTemplateRendered() {
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("problemTemplateRendered");
    }
}

function readyForNextProblem(e, data) {
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
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
    // TODO(alpert): Preload perseus problems in topic mode too
    if (framework === "khan-exercises") {
        $(Khan).trigger("upcomingExercise", data);
    }
}


function gotoNextProblem() {
    var framework = Exercises.getCurrentFramework();
    if (framework === "khan-exercises") {
        $(Khan).trigger("gotoNextProblem");
    }
}

function updateUserExercise(e, data) {
    var framework = Exercises.getCurrentFramework();
    if (framework === "khan-exercises") {
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
    if (framework === "khan-exercises") {
        $(Khan).trigger("cleanupProblem");
    }
    $("#workarea, #hintsarea").empty();
    $("#hint").attr("disabled", false);

    // Take off the event handlers for disabling check answer; we'll rebind
    // if we actually want them
    $("#solutionarea").off(".emptyAnswer");

    Khan.scratchpad.clear();
}


})();
