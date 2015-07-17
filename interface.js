/**
 * Interface glue to handle events from 'Exercises' and talk to 'Khan' or some
 * Perseus object, whichever is appropriate for the current exercise.
 *
 * In general, khan-exercises and perseus will want to trigger events on
 * Exercises but only listen to their own events.
 */
(function() {

var ServerActionQueue = {
    LOCAL_STORAGE_KEY: "exercises-server-action-queue",
    ACTION_TIMEOUT_MS: 100,

    queue: [],
    timeoutSet: false,
    timeoutMultiplier: 1,

    /**
     * Reads queued from local storage. If the queue is empty do nothing,
     * otherwise call the timeout function to consume the actions.
     *
     * WARNING: If this function is called twice and we are in the middle
     * of a request the second time (i.e. the request has been sent but
     * the response has not been received yet) there is the possibility
     * that we will have the same request sent twice because the pending
     * request is still in the queue.
     */
    initialize: function() {
        this.queue = LocalStore.get(this.LOCAL_STORAGE_KEY);
        if (this.queue === null) {
            this.queue = [];
        }
        if (this.queue.length > 0) {
            this.onTimeout();
        }
    },

    /**
     * Attempts to send requests, if all the requests are sent then don't
     * reset the timeout. Otherwise reset the timeout.
     */
    onTimeout: function() {
        this.timeoutSet = false;
        this.consumeQueue();
    },

    /**
     * Removes the next action in the queue and returns it.
     *
     * @returns {object} The next action from the queue.
     */
    dequeue: function() {
        output = this.queue.shift();
        LocalStore.set(this.LOCAL_STORAGE_KEY, this.queue);
        return output;
    },

    /**
     * Arm the timeout and increment the timeoutMultiplier
     */
    armTimeout: function() {
        if (!this.timeoutSet) {
            this.timeoutSet = true;
            setTimeout(_.bind(this.onTimeout, this),
                       this.ACTION_TIMEOUT_MS * this.timeoutMultiplier);
        }

        // Increment timeoutMultiplier but max at 20
        this.timeoutMultiplier = Math.min(20, this.timeoutMultiplier+1);
    },

    /**
     * If we are connected to the server this will recursively consume the queue of
     * pending server actions. Otherwise, this will reset the timeout to be called
     * again later.
     */
    consumeQueue: function() {
        if (this.queue.length === 0) {
            return;
        }

        action = ServerActionEnum[this.peek().action];
        actionArgs = this.peek().actionArgs;
        retriesLeft = this.peek().retriesLeft;
        action.apply(null, actionArgs).done(function() {
            // We succeeded so remove this from the queue and reset timeoutMultiplier
            ServerActionQueue.timeoutMultiplier = 1;
            ServerActionQueue.dequeue();
            ServerActionQueue.consumeQueue();
        }).fail(function(xhr) {
            // When we aren't connected to the sesrver we don't get a proper response
            // so responseText is undefined
            if (xhr.status === 0) {
                // We didn't receive a response from the server, reset timeout.
                ServerActionQueue.armTimeout();
            } else {
                // We received an error from the server, retry or remove from the queue
                if (retriesLeft > 0) {
                    ServerActionQueue.peek().retriesLeft -= 1;
                    LocalStore.set(ServerActionQueue.LOCAL_STORAGE_KEY,
                                   ServerActionQueue.queue);
                    ServerActionQueue.armTimeout();
                } else {
                    ServerActionQueue.dequeue();
                    ServerActionQueue.consumeQueue();
                }
            }
        });
    },

    /**
     * Returns next item from queue without removing it.
     */
    peek: function() {
        return this.queue[0];
    },

    /**
     * Add a new action to the queue of actions to be called.
     * @param {string} action - The string mapping to the callback function in
     *                 ServerActionEnum. The callback MUST return a promise
     *                 object so we can know if a request fails or succeeds
     * @param {list} actionArgs - The list of arguments to be passed to the
     *               callback for the action. All of these arguments must be
     *               JSON serializable.
     * @param {int} retries - Number of retries allowed for server errors
     */
    enqueue: function(action, actionArgs, retries) {
        this.queue.push({action: action, actionArgs: actionArgs,
                         retriesLeft: retries});
        LocalStore.set(this.LOCAL_STORAGE_KEY, this.queue);
        this.armTimeout();
    },
};

ServerActionEnum = {
    "makeAttempt": saveAttemptToServer,
    "hintRequest": request,
};

function saveAttemptToServer(url, attemptData) {
    // Save the problem results to the server
    promise = request(url, attemptData).fail(function(xhr) {
        // Alert any listeners of the error before reload
        $(Exercises).trigger("attemptError");

        if (inUnload) {
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

        if (xhr.statusText === "timeout") {
            // TODO(david): Instead of throwing up this error message, try
            //     retrying the request or something. See more details in
            //     comment in request().
            $(Exercises).trigger("warning",
                    $._("Uh oh, it looks like a network request timed out! " +
                        "You'll need to " +
                        "<a href='%(refresh)s'>refresh</a> to continue. " +
                        "If you think this is a mistake, " +
                        "<a href='http://www.khanacademy.org/reportissue?" +
                        "type=Defect'>tell us</a>.",
                        {refresh: _.escape(window.location.href)}
                    )
            );
        } else {
            $(Exercises).trigger("warning",
                    $._("This page is out of date. You need to " +
                        "<a href='%(refresh)s'>refresh</a>, but don't " +
                        "worry, you haven't lost progress. If you think " +
                        "this is a mistake, " +
                        "<a href='http://www.khanacademy.org/reportissue?" +
                        "type=Defect'>tell us</a>.",
                        {refresh: _.escape(window.location.href)}
                    )
            );
        }

        // Also log this failure to a bunch of places so we can see
        // how frequently this occurs, and if it's similar to the frequency
        // that we used to get for the endless spinner at end of task card
        // logs.
        var logMessage = "[" + (+new Date()) + "] request to " +
            url + " failed (" + xhr.status + ", " + xhr.statusText + ") " +
            "with " + (Exercises.pendingAPIRequests - 1) +
            " other pending API requests: " + attemptOrHintQueueUrls +
            " (in khan-exercises/interface.js:handleAttempt)";

        // Log to app engine logs... hopefully.
        $.post("/sendtolog", {message: logMessage, with_user: 1});

        // Also log to Sentry via Raven, just for some redundancy in case
        // the above request doesn't make it to our server somehow.
        if (window.Raven) {
            window.Raven.captureMessage(
                    logMessage, {tags: {ipaddebugging: true}});
        }
    });
    return promise;
}


// If any of these properties have already been defined, then leave them --
// this happens in local mode
_.defaults(Exercises, {
    khanExercisesUrlBase: "/khan-exercises/",

    getCurrentFramework: function(userExerciseOverride) {
        return (userExerciseOverride || userExercise).exerciseModel.fileName ?
            "khan-exercises" : "perseus";
    },

    requestTimeoutMillis: 30000
});

_.extend(Exercises, {
    guessLog: undefined,
    userActivityLog: undefined
});

// The iOS app doesn't use cookies, so we need to send this as an oauth request
// (while letting the webapp send its AJAX request as before).
$.kaOauthAjax = function (options) {
    if ($.oauth) {
        return $.oauth(options);
    } else {
        return $.ajax(options);
    }
};

var PerseusBridge = Exercises.PerseusBridge,

    EMPTY_MESSAGE = $._("There are still more parts of this question to answer."),

    // Store these here so that they're hard to change after the fact via
    // bookmarklet, etc.
    localMode = Exercises.localMode,
    previewingItem,

    originalCheckAnswerText,

    userExercise,
    problemNum,

    canAttempt,
    hintsAreFree,
    attempts,
    numHints,
    hintsUsed,
    lastAttemptOrHint,
    lastAttemptContent,
    currentExercise;

$(Exercises)
    .bind("problemTemplateRendered", problemTemplateRendered)
    .bind("newProblem", newProblem)
    .bind("hintShown", onHintShown)
    .bind("readyForNextProblem", readyForNextProblem)
    .bind("warning", warning)
    .bind("upcomingExercise", upcomingExercise)
    .bind("gotoNextProblem", gotoNextProblem)
    .bind("updateUserExercise", updateUserExercise)
    .bind("subhintExpand", subhintExpand)
    .bind("clearExistingProblem", clearExistingProblem)
    .bind("showOptOut", showOptOut);


function problemTemplateRendered() {
    previewingItem = Exercises.previewingItem;
    // Setup appropriate img URLs
    $("#issue-throbber").attr("src",
            Exercises.khanExercisesUrlBase + "css/images/throbber.gif");

    $("#positive-reinforcement").hide();
    if (localMode) {
        // The /khan-exercises/images/ folder isn't available in GAE prod so
        // don't change the src there, even though it would kind of work.
        $("#positive-reinforcement > img").attr("src",
                Exercises.khanExercisesUrlBase + "images/face-smiley.png");
    }

    // 'Check Answer' or 'Submit Answer'
    originalCheckAnswerText = $("#check-answer-button").val();

    // Solution submission
    $("#check-answer-button").click(handleCheckAnswer);
    $("#answerform").submit(handleCheckAnswer);
    $("#skip-question-button").click(handleSkippedQuestion);
    $("#opt-out-button").click(handleOptOut);

    // Hint button
    $("#hint").click(onHintButtonClicked);

    // Worked example button
    $("#worked-example-button").click(onShowExampleClicked);

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
            LocalStore.set("scratchpad:" + userExercise.user,
                    Khan.scratchpad.isVisible());
        }
    });

    // These shouldn't interfere...
    $(PerseusBridge).trigger("problemTemplateRendered", [Khan.mathJaxLoaded]);
    $(Khan).trigger("problemTemplateRendered");
}

function newProblem(e, data) {
    Exercises.guessLog = [];
    Exercises.userActivityLog = [];

    canAttempt = true;
    hintsAreFree = false;
    attempts = data.userExercise ? data.userExercise.lastAttemptNumber : 0;
    numHints = data.numHints;
    hintsUsed = data.userExercise ? data.userExercise.lastCountHints : 0;
    lastAttemptOrHint = new Date().getTime();
    lastAttemptContent = null;

    if (!localMode && KA.GANDALF_EXERCISES_SERVER_QUEUE) {
        storedExercise = LocalStore.get("currentExercise");
        if (storedExercise != null &&
            storedExercise.exercise === data.userExercise.exercise &&
            storedExercise.problemNum === problemNum) {

            currentExercise = storedExercise;

            while (hintsUsed < storedExercise.hintsUsed) {
                var framework = Exercises.getCurrentFramework();
                if (framework === "perseus") {
                    $(PerseusBridge).trigger("showHint");
                } else if (framework === "khan-exercises") {
                    $(Khan).trigger("showHint");
                }
            }
        }

        // Store currentExercise w/ hints used in local storage (above we
        // should check if the exercise is already stored and update hintsUsed
        // as appropriate)
        currentExercise = {exercise: data.userExercise.exercise,
                           hintsUsed: hintsUsed,
                           problemNum: problemNum};
        LocalStore.set("currentExercise", currentExercise);
    }

    var framework = Exercises.getCurrentFramework();
    $("#problem-and-answer")
            .removeClass("framework-khan-exercises")
            .removeClass("framework-perseus")
            .addClass("framework-" + framework);

    // Enable/disable the get hint button
    $(".hint-box").toggle(numHints !== 0);
    updateHintButtonText();
    $("#hint").attr("disabled", hintsUsed >= numHints);
    enableCheckAnswer();

    if (typeof KA !== "undefined" && KA.language === "en-PT" &&
            previewingItem) {
        // On translate.ka.org when previewing the exercise, we want to open up
        // all the hints to make it easy to translate immediately.
        while (hintsUsed < numHints) {
            onHintButtonClicked();
        }
    }

    // Render related videos, unless we're on the final stage of mastery.
    if (Exercises.RelatedVideos && data.userExercise) {
        var userExercise = data.userExercise;
        var nearMastery = userExercise.exerciseProgress.level === "mastery2" ||
                userExercise.exerciseProgress.level === "mastery3";
        var task = Exercises.learningTask;
        var hideRelatedVideos = task && task.isMasteryTask() && nearMastery;
        var relatedVideos = data.userExercise.exerciseModel.relatedVideos;

        // We have per-problem-type related videos for Perseus
        if (framework === "perseus") {
            var problemTypeName = PerseusBridge.getSeedInfo().problem_type;

            // Filter out related videos that correspond to other problem types
            var problemTypes = data.userExercise.exerciseModel.problemTypes;
            var otherProblemTypes = _.filter(problemTypes, function(type) {
                return type.name !== problemTypeName;
            });
            relatedVideos = _.filter(relatedVideos, function(video) {
                return _.all(otherProblemTypes, function(problemType) {
                    // Note: we have to cast IDs to strings for backwards
                    // compatability as older videos have pure integer IDs.
                    var stringIDs = _.map(problemType.relatedVideos,
                        function(id) {
                            return "" + id;
                        });
                    return !_.contains(stringIDs, "" + video.id);
                });
            });
        }

        if (hideRelatedVideos) {
            Exercises.RelatedVideos.render([]);
        } else {
            Exercises.RelatedVideos.render(relatedVideos);
        }
    }
}

function handleCheckAnswer() {
    return handleAttempt({skipped: false});
}

function handleSkippedQuestion() {
    return handleAttempt({skipped: true});
}

function handleOptOut() {
    Exercises.AssessmentQueue.end();
    return handleAttempt({skipped: true, optOut: true});
}

function handleAttempt(data) {
    var framework = Exercises.getCurrentFramework();
    var skipped = data.skipped;
    var optOut = data.optOut;
    var score;
    var itemId;

    // Score the attempt
    if (framework === "perseus") {
        score = PerseusBridge.scoreInput();
        itemId = PerseusBridge.getSeedInfo().seed;
    } else if (framework === "khan-exercises") {
        score = Khan.scoreInput();
        itemId = Khan.getSeedInfo().seed;
    }

    if (!canAttempt) {
        // Just don't allow further submissions once a correct answer or skip
        // has been called or sometimes the server gets confused.
        return false;
    }

    var isAnswerEmpty = score.empty && !skipped;
    var attemptMessage = null;

    // When the user answers incorrectly, we might show a message in response.
    // It might encourage the user to think about their answer's format (eg.
    // simplify the fraction) or it might explain to the user why the answer
    // was wrong (these are referred to as clues in code, though in
    // conversation we call them rationales). We show nothing at all if that
    // content doesn't exist.
    if (score.message != null) {
        attemptMessage = score.message;
    } else if (isAnswerEmpty) {
        attemptMessage = EMPTY_MESSAGE;
    }

    // We need to alert the user when the given answer is incorrect
    if (!attemptMessage && !(score.correct || skipped)) {
        attemptMessage = $._("Incorrect answer, please try again.");
    }

    var $attemptMessage = $("#check-answer-results > p");

    if (attemptMessage) {
        // NOTE(jeresig): If the message is identical to the message that
        // was there before then the ARIA alert is not triggered. We add in
        // an extra space to force the alert to trigger.
        var isIdentical = attemptMessage === $attemptMessage.text();

        $attemptMessage
            .html(attemptMessage + (isIdentical ? " " : "")).show().tex();

        $(Exercises).trigger("attemptMessageShown", attemptMessage);
    } else {
        $attemptMessage.hide();
    }

    // Stop if the user didn't try to skip the question and also didn't yet
    // enter a response
    if (isAnswerEmpty) {
        return false;
    }

    if (score.correct || skipped) {
        // Once we receive a correct answer or a skip, that's it; further
        // attempts are disallowed.
        canAttempt = false;
    }

    var curTime = new Date().getTime();
    var millisTaken = curTime - lastAttemptOrHint;
    var timeTaken = Math.round(millisTaken / 1000);
    var stringifiedGuess = JSON.stringify(score.guess);

    lastAttemptOrHint = curTime;

    // If user hasn't changed their answer and is resubmitting w/in one second
    // of last attempt, don't allow this attempt. They're probably just
    // smashing Enter.
    if (!skipped &&
            stringifiedGuess === lastAttemptContent && millisTaken < 1000) {
        return false;
    }
    lastAttemptContent = stringifiedGuess;

    Exercises.guessLog.push(score.guess);
    Exercises.userActivityLog.push([
            score.correct ? "correct-activity" : "incorrect-activity",
            stringifiedGuess, timeTaken]);

    if (score.correct || skipped) {
        $(Exercises).trigger("problemDone", {
            card: Exercises.currentCard,
            attempts: attempts
        });
    }

    $(Exercises).trigger("checkAnswer", {
        correct: score.correct,
        item: itemId,
        card: Exercises.currentCard,
        optOut: optOut,
        // Determine if this attempt qualifies as fast completion
        fast: !localMode && userExercise.secondsPerFastProblem >= timeTaken,
        // Used by mobile for skipping problems in a mastery task
        skipped: skipped
    });

    // Update interface corresponding to correctness
    if (skipped || Exercises.assessmentMode) {
        disableCheckAnswer();
    } else if (score.correct) {
        // Correct answer, so show the next question button.
        $("#check-answer-button").hide();
        var nextButtonText;
        if (Exercises.learningTask &&  Exercises.learningTask.isComplete()) {
            nextButtonText = $._("Awesome! Show points...");
        } else {
            nextButtonText = $._("Correct! Next question...");
        }

        $("#next-question-button")
            .prop("disabled", false)
            .removeClass("buttonDisabled")
            .val(nextButtonText)
            .show()
            .focus();
        $("#positive-reinforcement").show();
        $("#skip-question-button").prop("disabled", true);
        $("#opt-out-button").prop("disabled", true);
    } else {
        // Wrong answer. Enable all the input elements

        // NOTE(jeresig): The wrong answer wiggling has been disabled as
        // it causes a re-focus on the answer button to occur, making it
        // impossible to hear what the effect of the press was in a
        // screen reader.
        //$("#check-answer-button")
            //.parent()  // .check-answer-wrapper makes shake behave
            //.effect("shake", {times: 3, distance: 5}, 480);

        if (framework === "perseus") {
            // TODO(alpert)?
        } else if (framework === "khan-exercises") {
            // NOTE(jeresig): Auto-focusing back on to the input when an
            // incorrect answer is given has been disabled. It didn't
            // happen when using the mouse and if you used the keyboard
            // it made the screen reader really confused.
            //$(Khan).trigger("refocusSolutionInput");
        }
    }

    if (!hintsAreFree) {
        hintsAreFree = true;
        $(".hint-box")
            .css("position", "relative")
            .animate({top: -10}, 250)
            .find(".info-box-header")
                .slideUp(250)
                .end()
            .find("#hint")
                .removeClass("orange")
                .addClass("green");
        updateHintButtonText();
    }

    if (localMode || Exercises.currentCard.get("preview")) {
        // Skip the server; just pretend we have success
        return false;
    }

    if (previewingItem) {
        $("#next-question-button").prop("disabled", true);

        // Skip the server; just pretend we have success
        return false;
    }

    // If we're in a practice task but not at the end of it (so the
    // user will be doing another question next), let's make the
    // request on the multithreaded module: we don't care that much
    // how long the request takes (it happens while the user is trying
    // the next question) and it's cheaper.
    var useMultithreadedModule = (
        !score.correct ||
        (Exercises.learningTask && !Exercises.learningTask.isComplete()));

    var url = fullUrl(
            "problems/" + problemNum + "/attempt", useMultithreadedModule);

    // This needs to be after all updates to Exercises.currentCard (such as the
    // "problemDone" event) or it will send incorrect data to the server
    var attemptData = buildAttemptData(
            score.correct, ++attempts, stringifiedGuess, timeTaken, skipped,
            optOut);

    if (!localMode && KA.GANDALF_EXERCISES_SERVER_QUEUE) {
        ServerActionQueue.enqueue("makeAttempt", [url, attemptData], 3);
    } else {
        saveAttemptToServer(url, attemptData);
    }

    if (skipped && !Exercises.assessmentMode) {
        // Skipping should pull up the next card immediately - but, if we're in
        // assessment mode, we don't know what the next card will be yet, so
        // wait for the special assessment mode triggers to fire instead.
        $(Exercises).trigger("gotoNextProblem");
    }

    if (Exercises.assessmentMode) {
        // Tell the assessment queue that the current question has been
        // answered so that it can serve up the next question when its ready
        // Set a small timeout to give the browser a chance to show the
        // disabled check-answer button.  Otherwise in chrome it doesn't show
        // Please wait...
        setTimeout(function() {
            Exercises.AssessmentQueue.answered(score.correct);
        },10);
    }
    return false;
}

/**
 * Handle the even when a user wants to see a worked example.
 * Currently only works on some Perseus problems.
 */
function onShowExampleClicked() {
    $(PerseusBridge).trigger("showWorkedExample");
}

/**
 * Handle the event when a user clicks to use a hint.
 *
 * This deals with the internal work to do things like sending the event up
 * to the server, as well as triggering the external event "hintUsed" so that
 * other parts of the UI may update first. It's separated into two events so
 * that the XHR can be sent after the other items have a chance to respond.
 */
function onHintButtonClicked() {
    var curTime = new Date().getTime();
    var timeTaken = Math.round((curTime - lastAttemptOrHint) / 1000);
    lastAttemptOrHint = curTime;
    var logEntry = ["hint-activity", "0", timeTaken];
    Exercises.userActivityLog.push(logEntry);

    if (!previewingItem && !localMode && !userExercise.readOnly &&
            !Exercises.currentCard.get("preview") && canAttempt) {

        // buildAttemptData reads the number of hints we have taken
        // from hintsUsed.  However, we haven't updated that yet since
        // we haven't gotten a response back, from, you guessed it,
        // this request itself. So we increment hintsUsed while
        // forming this request so that it gets the number of hints
        // that will have been used when this request returns
        // successfully.
        hintsUsed++;
        // Always put hints on the (cheaper) multithreaded module,
        // since we don't care what the API call returns so we don't
        // care how slow it is.
        var url = fullUrl("problems/" + problemNum + "/hint", true);
        var attemptData = buildAttemptData(false, attempts, "hint",
                                           timeTaken, false, false);
        if (!localMode && KA.GANDALF_EXERCISES_SERVER_QUEUE) {
            ServerActionQueue.enqueue("hintRequest", [url, attemptData], 3);
        } else {
            request(url, attemptData);
        }
        hintsUsed--;
    }

    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        $(PerseusBridge).trigger("showHint");
    } else if (framework === "khan-exercises") {
        $(Khan).trigger("showHint");
    }

    if (!localMode && KA.GANDALF_EXERCISES_SERVER_QUEUE) {
        // onHintShown updated the hintsUsed so we should save that to
        // localStorage.
        currentExercise.hintsUsed = hintsUsed;
        LocalStore.set("currentExercise", currentExercise);
    }
}

function onHintShown(e, data) {
    // Grow the scratchpad to cover the new hint
    Khan.scratchpad.resize();

    hintsUsed++;
    updateHintButtonText();

    $(Exercises).trigger("hintUsed", data);
    // If there aren't any more hints, disable the get hint button
    if (hintsUsed === numHints) {
        $("#hint").attr("disabled", true);
    }

    // When a hint is shown, clear the "last attempt content" that is used to
    // detect duplicate, repeated attempts. Once the user clicks on a hint, we
    // consider their next attempt to be unique and legitimate even if it's the
    // same answer they attempted previously.
    lastAttemptContent = null;
}

function updateHintButtonText() {
    var $hintButton = $("#hint");
    var hintsLeft = numHints - hintsUsed;

    if (hintsAreFree) {
        $hintButton.val(hintsUsed ?
                $._("Show next hint (%(hintsLeft)s left)", {hintsLeft: hintsLeft}) :
                $._("Show hints (%(hintsLeft)s available)", {hintsLeft: hintsLeft}));
    } else {
        $hintButton.val(hintsUsed ?
                $.ngettext("I'd like another hint (1 hint left)",
                           "I'd like another hint (%(num)s hints left)",
                           hintsLeft) :
                $._("I'd like a hint"));
    }
}

// Build the data to pass to the server
function buildAttemptData(correct, attemptNum, attemptContent, timeTaken,
                          skipped, optOut) {
    var framework = Exercises.getCurrentFramework();
    var data;

    if (framework === "perseus") {
        data = PerseusBridge.getSeedInfo();
    } else if (framework === "khan-exercises") {
        data = Khan.getSeedInfo();
    }

    _.extend(data, {
        // Ask for camel casing in returned response
        casing: "camel",

        // Whether we're moving to the next problem (i.e., correctness)
        complete: (correct || skipped) ? 1 : 0,

        count_hints: hintsUsed,
        time_taken: timeTaken,

        // How many times the problem was attempted
        attempt_number: attemptNum,

        // The answer the user gave
        attempt_content: attemptContent,

        // If working in the context of a LearningTask (on the new learning
        // dashboard), supply the task ID.
        // TODOX(laura): The web view in the iOS app doesn't have a learningTask
        // object on Exercises. To simplify this line, add getTaskId to
        // Exercises on the webapp as well.
        task_id: (Exercises.getTaskId && Exercises.getTaskId()) ||
                (Exercises.learningTask && Exercises.learningTask.get("id")),

        task_generation_time: (Exercises.learningTask &&
                Exercises.learningTask.get("generationTime")),

        user_mission_id: Exercises.userMissionId,

        // The current topic, if any
        topic_slug: Exercises.topicSlug,

        // The user assessment key if in assessmentMode
        user_assessment_key: Exercises.userAssessmentKey,

        // Whether the user is skipping the question
        skipped: skipped ? 1 : 0,

        // Whether the user is opting out of the task
        opt_out: optOut ? 1 : 0,

        // The client-reported datetime in local time (not UTC!).
        // Used by streaks.
        client_dt: moment().format()
    });

    return data;
}


var inUnload = false;

$(window).on("beforeunload", function() {
    inUnload = true;
});

// If there are any requests left in the queue when the window unloads then we
// will have permanently lost their answers and will need to clear the session
// cache, to make sure we don't override what is passed down from the servers
$(window).unload(function() {
    if (attemptOrHintQueue.queue().length) {
        $(Exercises).trigger("attemptError");
    }
});

function fullUrl(method, useMultithreadedModule) {
    // The multithreaded module is slower but cheaper.  We use it for
    // all hints, and problem-attempts that we know are not the last
    // attempt in a task.  (This is because it usually takes people at
    // least a few seconds to read a hint or attempt the next problem,
    // which is plenty of time even when on the slower module.)
    var apiBaseUrl;
    if (Exercises.assessmentMode && useMultithreadedModule) {
        apiBaseUrl = "/api/internal/_mt/user/assessment/exercises";
    } else if (Exercises.assessmentMode) {
        apiBaseUrl = "/api/internal/user/assessment/exercises";
    } else if (useMultithreadedModule) {
        apiBaseUrl = "/api/internal/_mt/user/exercises";
    } else {
        apiBaseUrl = "/api/internal/user/exercises";
    }

    return apiBaseUrl + "/" + userExercise.exerciseModel.name + "/" + method;
}

var attemptOrHintQueue = jQuery({});
// Used for error reporting: what urls are in the queue when an error happens?
var attemptOrHintQueueUrls = [];

function request(url, data) {
    var params = {
        // Do a request to the server API
        url: url,
        type: "POST",
        data: data,
        dataType: "json",

        // If we don't receive a response within this many milliseconds, we
        // throw up an error (the red bar) and prevent the user from
        // continuing. Why do we timeout requests? Dropped requests seem to be
        // a real thing and causes problems. First, a dropped request is bad by
        // itself, but also prevents any future requests from being sent
        // because we queue up requests on the client. Also, before we render
        // the end-of-task card, we wait for all requests to return, and if
        // there's a dropped request, we throw up a spinner that spins forever.
        // This is a real problem that we were first made aware of from iPad
        // Safari users in classrooms. We also added logging after 60 seconds
        // of waiting for all requests to return at the pre-end-of-task card
        // spinner, and it occurs frequently (several times every minute).
        // Though it would be good to retry requests, that's going to be
        // slightly tricker to do to ensure the server can be idempotent or be
        // able to handle multiple requests. So for now, we are just showing
        // the red error bar, which, although jarring, is hopefully less bad
        // than being stuck with an endless spinner before the end of task
        // card and then losing all progress since the first dropped request.
        timeout: Exercises.requestTimeoutMillis
    };

    var deferred = $.Deferred();

    attemptOrHintQueue.queue(function(next) {
        var requestEndedParameters;

        attemptOrHintQueueUrls.push(params.url);
        $.kaOauthAjax(params).then(function(data, textStatus, jqXHR) {
            // This line calls any callbacks registered with the promise
            deferred.resolve(data, textStatus, jqXHR);

            // Tell any listeners that we now have new userExercise data
            $(Exercises).trigger("updateUserExercise", {
                userExercise: data,
                source: "serverResponse"
            });
        }, function(jqXHR, textStatus, errorThrown) {
            // Execute passed error function first in case it wants
            // to log the request queue or something like that.
            deferred.reject(jqXHR, textStatus, errorThrown);

            // Clear the queue so we don't spit out a bunch of queued up
            // requests after the error.
            // TODO(csilvers): do we need to call apiRequestEnded for
            // all these as well?  Exercises.pendingAPIRequests is now off.
            attemptOrHintQueue.clearQueue();
            attemptOrHintQueueUrls = [];

            requestEndedParameters = {
                "error": {
                    textStatus: textStatus,
                    errorThrown: errorThrown
                }
            };
        }).always(function() {
            var attemptedUrl = attemptOrHintQueueUrls.pop();
            // Sanity check.  attemptedUrl will be undefined on send-error.
            if (attemptedUrl && attemptedUrl !== params.url) {
                KhanUtil.debugLog("We just sent " + params.url + " but " +
                                  attemptedUrl + " was at queue-front!");
            }
            $(Exercises).trigger("apiRequestEnded", requestEndedParameters);
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

    $(Exercises).trigger("updateUserExercise", {userExercise: userExercise});

    // (framework depends on userExercise set above)
    var framework = Exercises.getCurrentFramework();
    if (framework === "perseus") {
        $(PerseusBridge).trigger("readyForNextProblem", data);
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
    var framework = Exercises.getCurrentFramework(data.userExercise);
    if (framework === "perseus") {
        $(PerseusBridge).trigger("upcomingExercise", data);
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

function showOptOut() {
    $("#opt-out-button").show();
}

function enableCheckAnswer() {
    $("#check-answer-button")
        .prop("disabled", false)
        .removeClass("buttonDisabled")
        .val(originalCheckAnswerText);

    $("#skip-question-button")
        .prop("disabled", false)
        .removeClass("buttonDisabled");

    $("#opt-out-button")
        .prop("disabled", false)
        .removeClass("buttonDisabled");
}

function disableCheckAnswer() {
    $("#check-answer-button")
        .prop("disabled", true)
        .addClass("buttonDisabled")
        .val($._("Please wait..."));

    $("#skip-question-button")
        .prop("disabled", true)
        .addClass("buttonDisabled");

    $("#opt-out-button")
        .prop("disabled", true)
        .addClass("buttonDisabled");
}

function subhintExpand(e, subhintName) {
    // write to KALOG capturing the subhint-expand
    // click
    if (!localMode) {
        $.post("/api/internal/misc/subhint_expand", {
            subhintName: subhintName
        });
    }
}

function clearExistingProblem() {
    $("#happy").hide();

    // Toggle the navigation buttons
    $("#check-answer-button").show();
    $("#next-question-button").blur().hide();
    $("#positive-reinforcement").hide();

    // #solutionarea might have been moved by makeProblem(), so put it back
    // to the default location (which is also where Perseus expects it to be)
    $(".solutionarea-placeholder").after($("#solutionarea"));

    // Wipe out any previous problem
    PerseusBridge.cleanupProblem() || Khan.cleanupProblem();
    $("#workarea, #hintsarea, #solutionarea").empty();

    // Take off the event handlers for disabling check answer; we'll rebind
    // if we actually want them
    $("#solutionarea").off(".emptyAnswer");

    // Restore the hint button's original appearance
    $("#hint")
        .removeClass("green")
        .addClass("orange")
        .val($._("I'd like a hint"))
        .data("buttonText", false)
        .appendTo("#get-hint-button-container");
    $(".hint-box")
        .css("top", 0)
        .find(".info-box-header")
            .show();

    Khan.scratchpad.clear();
}

if (!localMode && KA.GANDALF_EXERCISES_SERVER_QUEUE) {
    // When this file is sourced, initialize the queue with what is stoed in localstorage
    ServerActionQueue.initialize();
}

})();
