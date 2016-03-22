/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-console, no-undef, no-unused-vars, no-var, one-var, prefer-spread, space-before-blocks */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* khan-exercise.js

    The main entry point here is essentially the onjQueryLoaded method around
    line 750. It loads in many of the pre-reqs and then calls, one way or
    another, setUserExercise and loadModule for each required module in utils/.

    setProblemNum updates some instance vars that get looked at by other
    functions.

    loadModule will load an individual exercise util module (e.g.,
    word-problems.js, etc). It _also_ loads in the Khan Academy site skin and
    exercise template via injectSite which runs prepareSite first then
    makeProblem when it finishes loading dependencies.

    prepareSite and makeProblem are both fairly heavyweight functions.

    If you are trying to register some behavior when the page loads, you
    probably want it to go in either prepareSite here or, if it makes sense, in
    problemTemplateRendered in interface.js. By the time prepareSite is called,
    jQuery and any core plugins are already available.

    If you are trying to do something each time a problem loads, you probably
    want to look at makeProblem.

    At the end of evaluation, the inner Khan object is returned/exposed as well
    as the inner Util object.


    Catalog of events fired on the Khan object by khan-exercises:

    * newProblem -- when a new problem has completely finished rendering

    * hintUsed -- when a hint has been used by the user

    * checkAnswer -- when the user attempts to check an answer, incorrect or
      correct

    * problemDone -- when the user has completed a problem which, in this case,
      usually means supplying the correct answer. Note the user may have made
      multiple attempts to finally get at the correct answer. A summary object
      including {attempts: <number>, card: <Object>} is included as an
      event parameter.

    * attemptError -- when an error occurs during an API attempt

    * apiRequestStarted / apiRequestEnded -- when an API request is sent
      outbound or completed, respectively. Listeners can keep track of whether
      or not khan-exercises is still waiting on API responses.

    * updateUserExercise -- when an updated userExercise has been received
      and is being used by khan-exercises, either via the result of an API
      call or initialization

    * showGuess -- when a guess is populated in the answer area in problem
      history mode

    * attemptMessageShown -- when a user attempts a problem and a message is
      shown in response, e.g. "We don't understand your answer."
*/
define(function(require) {

var crc32 = require("./utils/crc32.js");

// Numbers which are coprime to the number of bins, used for jumping through
// exercises.  To quickly test a number in python use code like:
// import fractions
// fractions.gcd( 197, 200)
var primes = [197, 3, 193, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
47, 53, 59, 61, 67, 71, 73, 79, 83],

    userExercise,

    // Check to see if we're in local mode
    localMode = Exercises.localMode,

    // Set in prepareSite when Exercises.init() has already been called
    assessmentMode,

    // The ID, filename, and name of the exercise -- these will only be set here in localMode
    currentExerciseId = ((/([^\/.]+)(?:\.html)?$/.exec(window.location.pathname) || [])[1]) || "",
    currentExerciseFile = currentExerciseId + ".html",
    currentExerciseName = deslugify(currentExerciseId),

    // Bin users into a certain number of realms so that
    // there is some level of reproducability in their questions.
    // If you change this, make sure all entries in the array "primes"
    // set above are coprime to the new value.
    bins = 200,

    // Number of past problems to consider when avoiding duplicates
    dupWindowSize = 5,

    // The seed information
    randomSeed,

    // Holds the current username
    user = null,
    userCRC32,

    // The current problem and its corresponding exercise
    problem,    // the unprocessed contents of a specific problem type
    exercise,   // the unprocessed contents of all problem types and vars

    // The number of the current problem that we're on
    problemNum = 1,

    // Info for constructing the seed
    seedOffset = 0,
    jumpNum = 1,
    currentProblemSeed = 0,
    seedsSkipped = 0,
    consecutiveSkips = 0,

    currentProblemType,

    // The current validator function
    answerData,
    validator,
    getAnswer,

    hints,

    // The exercise elements
    exercises,

    hintsUsed,

    // Bug-hunting "undefined" attempt content
    debugLogLog = ["start of log"],
    debugLog = function(l) {
        debugLogLog.push(l);
    },

    // Dictionary of loading and loaded exercises; keys are exercise IDs,
    // values are promises that are resolved when the exercise is loaded
    exerciseFilePromises = {},

    // A promise for each loaded or loading module, keyed by module filename
    // (module.src), as well as a single promise for the loading of the base
    // modules that are common to every exercise. These will be resolved when
    // the module is loaded (on the live site, immediately)
    modulePromises = {},
    baseModulesPromise = null;
    initialModulesPromise = $.Deferred(),

    urlBase = localMode ?  "../" :
        Exercises.khanExercisesUrlBase != null ?
            Exercises.khanExercisesUrlBase :
            "/khan-exercises/",

    // In local mode, we use khan-exercises local copy of the /images
    // directory.  But in production (on www.khanacademy.org), we use
    // the canonical location of images, which is under '/'.
    imageBase = localMode ? urlBase + "images/" : "/images/",

    lastFocusedSolutionInput = null,

    // Keeps track of failures in MakeProblem so we don't endlessly try and
    // re-Make a bad problem
    failureRetryCount = 0;

// Add in the site stylesheets
if (localMode) {
    (function() {
        var addLink = function(url) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = urlBase + url;
            document.getElementsByTagName("head")[0].appendChild(link);
        };

        addLink("css/khan-site.css");
        addLink("css/khan-exercise.css");
        addLink("local-only/katex/katex.css");
    })();
}

// The main Khan Module
var Khan = {

    // Set of modules currently in use -- keys are module names, value is
    // always true
    modules: {},

    // Map from exercise ID to a list of required modules (data-require),
    // These module names are used in resetModules() and indirectly by
    // runModules(), where $.fn["module-name"], $.fn["module-nameLoad"],
    // and $.fn["module-nameCleanup"] are called.
    exerciseModulesMap: {},

    // So modules can use file paths properly
    urlBase: urlBase,

    imageBase: imageBase,

    // Inter-util dependencies. This map is currently necessary so that we
    // can expose only the appropriate $.fn["module-nameLoad"] hooks used
    // by each problem. Dependencies on third-party files need not be
    // listed here.
    // TODO(alpert): Now that these deps are now encoded in require()
    // lines, find a way to remove this map.
    moduleDependencies: {
        "math": ["knumber"],
        "exponents": ["math", "math-format"],
        "kinematics": ["math"],
        "math-format": ["math", "expressions"],
        "polynomials": ["math", "expressions"],
        "stat": ["math"],
        "word-problems": ["math"],
        "interactive": ["graphie", "knumber", "kvector", "kpoint", "kline"],
        "mean-and-median": ["stat"],
        "congruency": ["angles", "interactive", "graphie-helpers"],
        "graphie": ["kpoint"],
        "graphie-3d": ["graphie", "kmatrix", "kvector"],
        "graphie-geometry": ["graphie", "kmatrix", "kvector", "kline"],
        "graphie-helpers": ["math-format"],
        "kmatrix": ["expressions"],
        "chemistry": ["math-format"],
        "kvector": ["knumber"],
        "kpoint": ["kvector", "knumber"],
        "kray": ["kpoint", "kvector"],
        "kline": ["kpoint", "kvector"],
        "constructions": ["kmatrix"]
    },

    warn: function(msg) {
        $(Exercises).trigger("warning", [msg + i18n._(" Refresh the page or " +
                "<a href='' id='warn-report'>report a problem</a>."),
                false]);
        // TODO(alpert): This event binding is kind of gross
        $("#warn-report").click(function(e) {
            e.preventDefault();
            $(".report-issue-link").click();
        });

    },

    warnMathJaxError: function(file) {
        Khan.warn(i18n._("Sorry!  There seems to be an issue with our math " +
                    "renderer loading the file: %(file)s.", {file: file}));
    },

    warnFont: function() {
        var warning;
        if ($.browser.msie) {
            warning = i18n._("You should " +
                "<a href='http://missmarcialee.com/2011/08/" +
                "how-to-enable-font-download-in-internet-explorer-8/' " +
                "target='_blank'>enable font download</a> " +
                "to improve the appearance of math expressions."
            );
        } else {
            warning = i18n._("You should enable font download in your " +
                "browser to improve the appearance of math expressions");
        }

        $(Exercises).trigger("warning", [warning, true]);
    },

    // TODO(alpert): This doesn't need to be in the Khan object.
    // TODO(charlie): It'd be nice to get rid of this now that we have the
    // `loadBaseModules` method, but these are also needed elsewhere (e.g.,
    // in the `runModules` method), so we'll always have some duplication.
    getBaseModules: function() {
        // Base modules required for every problem.  These are specified
        // as filenames (minus the .js extension) relative to util/.
        // subhints is here to support the intervention experiment.
        // Note: if you update these, you should also update the loading
        // of the base modules in `loadBaseModules`.
        return [
            "answer-types", "tmpl", "tex", "jquery.adhesion", "scratchpad",
            "subhints"
        ];
    },

    loadBaseModules: function() {
        if (baseModulesPromise) {
            return baseModulesPromise;
        } else {
            baseModulesPromise = $.Deferred();
        }
        debugLog("loadBaseModules");

        // Load the base modules. These should be in sync with the results of
        // `getBaseModules`, but are required here explicitly as strings so
        // that they can be detected by JavaScript bundlers.
        require([
            "./utils/answer-types.js",
            "./utils/tmpl.js",
            "./utils/tex.js",
            "./utils/jquery.adhesion.js",
            "./utils/scratchpad.js",
            "./utils/subhints.js",
        ], function() {
            baseModulesPromise.resolve();
        });

        return baseModulesPromise;
    },

    resetModules: function(exerciseId) {
        var modules = Khan.getBaseModules().concat(
                Khan.exerciseModulesMap[exerciseId]);
        var moduleSet = {};

        $.each(modules, function(i, mod) {
            useModule(mod);
        });

        Khan.modules = moduleSet;

        function useModule(modNameOrObject) {
            if (typeof modNameOrObject === "string") {
                moduleSet[modNameOrObject] = true;
                var deps = Khan.moduleDependencies[modNameOrObject] || [];

                $.each(deps, function(i, mod) {
                    useModule(mod);
                });
            } else if (modNameOrObject.name) {
                moduleSet[modNameOrObject.name] = true;
            }
        }
    },

    loadLocalModeSiteWhenReady: function() {
        initialModulesPromise.then(function() {
            loadLocalModeSite();
        });
    },

    // Populate this with modules
    Util: {
        debugLog: debugLog,

        // http://burtleburtle.net/bob/hash/integer.html
        // This is also used as a PRNG in the V8 benchmark suite
        random: function() {
            // Robert Jenkins' 32 bit integer hash function.
            var seed = randomSeed;
            seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
            seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
            seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
            seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
            seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
            seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
            return (randomSeed = (seed & 0xfffffff)) / 0x10000000;
        },

        // Rounds num to X places, and uses the proper decimal seperator.
        // But does *not* insert thousands separators.
        localeToFixed: function(num, places) {
            var localeDecimalSeperator = icu.getDecimalFormatSymbols().decimal_separator;
            var localeFixed = num.toFixed(places).replace(".", localeDecimalSeperator);
            if (localeFixed === "-0") {
                localeFixed = "0";
            }
            return localeFixed;
        }
    },

    // Query String Parser
    // Original from:
    // http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript/2880929#2880929
    queryString: function() {
        var urlParams = {},
            e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function(s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.search.substring(1);

        while ((e = r.exec(q))) {
            urlParams[d(e[1])] = d(e[2]);
        }

        return urlParams;
    },

    // Display error messages
    error: function() {
        if (typeof console !== "undefined") {
            $.each(arguments, function(ix, arg) {
                debugLog("error: " + arg);
                console.error(arg);
            });
        }
    },

    scratchpad: (function() {
        var disabled = false, wasVisible, pad;

        var actions = {
            disable: function() {
                wasVisible = actions.isVisible();
                actions.hide();

                $("#scratchpad-show").hide();
                $("#scratchpad-not-available").show();
                disabled = true;
            },

            enable: function() {
                if (wasVisible) {
                    actions.show();
                    wasVisible = false;
                }

                $("#scratchpad-show").show();
                $("#scratchpad-not-available").hide();
                disabled = false;
            },

            isVisible: function() {
                return $("#scratchpad").is(":visible");
            },

            show: function() {

                if (actions.isVisible()) {
                    return;
                }

                var makeVisible = function() {
                    if (!$("#scratchpad").length) {
                        // Scratchpad's gone! The exercise template
                        // probably isn't on screen right now, so let's
                        // just not try and initialize stuff otherwise
                        // Raphael will attach an <svg> to the body.
                        return;
                    }

                    $("#scratchpad").show();
                    $("#scratchpad-show").text(i18n._("Hide scratchpad"));

                    // If pad has never been created or if it's empty
                    // because it was removed from the DOM, recreate a new
                    // scratchpad.
                    if (!pad || !$("#scratchpad div").children().length) {
                        pad = new DrawingScratchpad(
                            $("#scratchpad div")[0]);
                    }

                    // Outline things floating on top of the scratchpad
                    $(".above-scratchpad").css("border", "1px solid #ccc");
                };

                makeVisible();
            },

            hide: function() {
                if (!actions.isVisible()) {
                    return;
                }

                $("#scratchpad").hide();
                // Un-outline things floating on top of the scratchpad
                $(".above-scratchpad").css("border", "");
                $("#scratchpad-show").text(i18n._("Show scratchpad"));
            },

            toggle: function() {
                actions.isVisible() ? actions.hide() : actions.show();
            },

            clear: function() {
                if (pad) {
                    pad.clear();
                }
            },

            resize: function() {
                if (pad) {
                    pad.resize();
                }
            }
        };

        return actions;
    })(),

    getSeedInfo: function() {
        return {
            // A hash representing the exercise version
            sha1: typeof userExercise !== "undefined" ?
                    userExercise.exerciseModel.sha1 : currentExerciseId,
            seed: currentProblemSeed,
            problem_type: currentProblemType
        };
    },

    getPreviewUrl: function() {
        return window.location.protocol + "//" + window.location.host +
            "/preview/content/e/" + currentExerciseId + "?seed=" +
            currentProblemSeed + "&problem=" + currentProblemType;
    },

    getIssueInfo: function() {
        return {
            framework: "khan-exercises",
            pretitle: currentExerciseName,
            exercise: currentExerciseId,
            item: currentProblemType + "/" + currentProblemSeed,
            sha: userExercise.exerciseModel.sha1,
            previewUrl: "http://sandcastle.kasandbox.org/media/castles/Khan:master/exercises/" +
                    currentExerciseFile + "?seed=" + currentProblemSeed + "&problem=" +
                    currentProblemType + "&debug&lang=" + icu.getLocale(),
            editUrl: "http://exercises.ka.local/exercises/" +
                    currentExerciseFile + "?seed=" + currentProblemSeed + "&problem=" +
                    currentProblemType + "&debug",
            bodyInfo: JSON.stringify(Exercises.guessLog)
        };
    },

    scoreInput: function() {
        return validator(getAnswer());
    },

    submitIssue: function(issueInfo, onSuccess, onFailure) {
        var dataObj = {
            fields: {
                project: { key: "AI" },
                issuetype: { name: "Item issue report" },
                summary: issueInfo.pretitle + " - " + issueInfo.title,
                description: issueInfo.bodyInfo,
                customfield_10024: [issueInfo.exercise],  // exercise
                customfield_10026: issueInfo.sha,         // sha
                customfield_10027: issueInfo.previewUrl,  // preview url
                customfield_10028: issueInfo.editUrl,     // edit url
                customfield_10025: [issueInfo.item],      // item
                customfield_10029: { value: issueInfo.framework },  // framework
                customfield_10202: issueInfo.debugInfo,   // debug info
                customfield_10204: issueInfo.userFlags,   // User Type
                customfield_10205: navigator.userAgent,   // user agent
                customfield_10300: { value: issueInfo.type || "Other" },  // issue type
                customfield_10301: [icu.getLocale()]      // locale
            }
        };

        $.ajax({
            url: "/jirapost",
            type: "POST",
            data: JSON.stringify(dataObj),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    },

    autoSubmitIssue: function(title, description) {
        // Capture a stack trace for easier debugging. Safari requires an
        // exception to be thrown in order for .stack to be set
        var err;
        try {
            throw new Error();
        } catch (e) {
            err = e;
        }
        description += "\n\n" + err.stack;

        var framework = Exercises.getCurrentFramework();
        var issueInfo = framework === "khan-exercises" ?
            Khan.getIssueInfo() :
            Exercises.PerseusBridge.getIssueInfo();
        $.extend(issueInfo, {
            pretitle: "AutoGenerated",
            title: title,
            bodyInfo: description,
            type: "Other",
            userFlags: [{ value: "Auto-generated by a robot" }],
            debugInfo: description + "\n\n" +
                JSON.stringify(Khan.getSeedInfo()) +
                "\n\n" + debugLogLog.join("\n")
        });

        Khan.submitIssue(issueInfo);
    },

    /**
     * Hijacks a specified link so that it opens up the issue form.
     * @param {string} selector The link selector - defaults to "#report"
     */
    initReportIssueLink: function(selector) {
        selector = selector || "#report";
        $(selector).click(function(e) {
            e.preventDefault();

            if (typeof KA !== "undefined" && KA.vipIssueReporter) {
                $("#issue .info-box-header").text(i18n._("VIP Issue Report"));
            }

            // If the hint button isn't visible, we don't want the user to
            // see hints for some reason (e.g., this is an assessment).
            // So also hide the show answer button.
            if (!$("#hint").is(':visible')) {
                $("#issue-show-answer").hide();
            }

            var report = $("#issue").css("display") !== "none";
            var form = $("#issue .issue-form").css("display") !== "none";

            if (report && form) {
                $("#issue").hide();
            } else if (!report || !form) {
                $("#issue-status").removeClass("error").hide();
                $("#issue, #issue .issue-form").show();
                $("html, body").animate({
                    scrollTop: $("#issue").offset().top
                }, 500, function() {
                    $("#issue-title").focus();
                });
            }
        });

        $("input[name=issue-type]").on("click", function() {
            if ($(this).prop("id") === "issue-wrong-answer") {
                $("#issue-body").prop("placeholder", i18n._("Tell us what " +
                        "the correct answer should be, and how you got " +
                        "that answer."));
            } else if ($(this).prop("id") === "issue-typo") {
                $("#issue-body").prop("placeholder", i18n._("Tell us what " +
                        "the incorrect text says and what it should say " +
                        "instead."));
            } else if ($(this).prop("id") === "issue-confusing") {
                $("#issue-body").prop("placeholder", i18n._("Tell us exactly " +
                        "what you found confusing. How would you reword " +
                        "the question or hints to be less confusing?"));
            } else if ($(this).prop("id") === "issue-bug") {
                $("#issue-body").prop("placeholder", i18n._("Tell us exactly " +
                        "what happened and what you had expected to happen " +
                        "instead."));
                // TODO(csilvers): the following two are obsolete and
                // can be removed.
            } else if ($(this).prop("id") === "issue-hints-wrong") {
                $("#issue-body").prop("placeholder", i18n._("Tell us exactly " +
                        "what's wrong with the hints. What answer did " +
                        "you get and how did you get it?"));
            } else if ($(this).prop("id") === "issue-answer-wrong") {
                $("#issue-body").prop("placeholder", i18n._("Tell us exactly " +
                        "how you tried to input the answer from the " +
                        "hints. Did a different answer work instead?"));
            } else {
                $("#issue-body").prop("placeholder", "");
            }
        });

        // Hide "Question or hints are in English" option for english users
        if (icu.getLanguage() === "en") {
            $("#issue-i18n").parent().hide();
        }

        // Hide issue form.
        $("#issue-cancel").click(function(e) {
            e.preventDefault();

            $("#issue").hide(500);
            $("#issue-title, #issue-body").val("");
        });

        // When the Show Answer button of the issue form is clicked,
        // we need to show all of the hints.
        $("#issue-show-answer").click(function(e) {
            e.preventDefault();

            // If there is a hint available, we'll show it by clicking
            // on the hint button. If there are no hints available,
            // that means that we're done showing hints so we disable
            // the Show Answer button.
            var showHintIfAvailable = function showHintIfAvailable() {
                // This button runs with both khan-exercise code and
                // Perseus code. The only common place to look to see
                // if there are more hints remaining is the state of the
                // hint button.
                if ($("#hint").attr("disabled")) {
                    $(Exercises).off("hintShown", showHintIfAvailable);

                    // "this" is bound to the Show Answer button itself
                    $(this).addClass("disabled");
                } else {
                    $("#hint").click();
                }
            }.bind(this);

            // The hintShown event is the key to looping through the
            // hints. It is our signal that the asynchronously managed
            // display of a hint has completed so that we can try to
            // then show the next hint.
            $(Exercises).on("hintShown", showHintIfAvailable);

            // Kick off the cycle by showing the first hint.
            showHintIfAvailable();
        });

        $(Exercises).bind("newProblem", function() {
            $("#issue-show-answer").removeClass("disabled");
        });

        // Submit an issue.
        $("#issue .issue-form input:submit").click(function(e) {

            e.preventDefault();

            var framework = Exercises.getCurrentFramework();
            var issueInfo = framework === "khan-exercises" ?
                Khan.getIssueInfo() :
                Exercises.PerseusBridge.getIssueInfo();

            // don't do anything if the user clicked a second time quickly
            if ($("#issue .issue-form").css("display") === "none") {
                return;
            }

            // Validate body
            var body = $("#issue-body").val();
            if (body === "") {
                $("#issue-status").addClass("error")
                    .html(i18n._("Please provide a description of the issue.")).show();
                return;
            }
            issueInfo.bodyInfo = body + "\n\n" + issueInfo.bodyInfo;

            // Title is first 50 characters of description
            issueInfo.title = body.substr(0, 50).replace(/\n/g, " ") +
                    (body.length > 50 ? "..." : "");

            // Validate type
            var type = $("input[name=issue-type]:checked").prop("id");
            if (!type) {
                $("#issue-status").addClass("error")
                    .html(i18n._("Please specify the issue type.")).show();
                return;
            }

            issueInfo.type = {
                "issue-wrong-answer": "Wrong answer",
                "issue-typo": "Typo",
                "issue-confusing": "Question or hints confusing",
                "issue-bug": "Bug",
                "issue-i18n": "Not translated",
                // TODO(csilvers): these are obsolete and can be removed.
                "issue-hints-wrong": "Answer in hints is wrong",
                "issue-answer-wrong": "Answer in hints not accepted",
            }[type];


            // Construct debug info
            var mathjaxInfo = "MathJax is " + (typeof MathJax === "undefined" ? "NOT loaded" :
                    ("loaded, " + (MathJax.isReady ? "" : "NOT ") + "ready, queue length: " +
                    MathJax.Hub.queue.queue.length));
            var sessionStorageInfo = (typeof sessionStorage === "undefined" ||
                    typeof sessionStorage.getItem === "undefined" ?
                    "sessionStorage NOT enabled" : null);
            var warningInfo = $("#warning-bar-content").text();
            var parts = [sessionStorageInfo, mathjaxInfo, warningInfo];
            var debugInfo = $.grep(parts, function(e) { return e != null; }).join("\n\n");
            var mathjaxLoadFailures = $.map(MathJax.Ajax.loading, function(info, script) {
                if (info.status === -1) {
                    return [script + ": error"];
                } else {
                    return [];
                }
            }).join("\n");
            if (mathjaxLoadFailures.length > 0) {
                debugInfo += "\n\n" + mathjaxLoadFailures;
            }
            issueInfo.debugInfo += "\n\n" + debugLogLog.join("\n");


            // Flag special users.
            // TODO(csilvers): figure out how to get this information
            // back into perseus (if this code is even used there).
            var profile = typeof KA !== "undefined" && KA.getUserProfile && KA.getUserProfile();
            var powerUser = profile && profile.get("points") >= 500000;
            var vip = typeof KA !== "undefined" && KA.vipIssueReporter;
            issueInfo.userFlags = [];
            if (powerUser) {
                issueInfo.userFlags.push({ value: "500k+ points" });
            }
            if (vip) {
                issueInfo.userFlags.push({ value: "VIP" });
                if (profile) {
                    issueInfo.bodyInfo = "VIP issue from " +
                            profile.get("nickname") + " (" +
                            profile.get("email") + ")\n\n" +
                            issueInfo.bodyInfo;
                }
            }

            var formElements = $("#issue input").add("#issue textarea");

            // disable the form elements while waiting for a server response
            formElements.attr("disabled", true);
            $("#issue-cancel").hide();
            $("#issue-throbber").show();

            var onSuccess = function(data) {
                // hide the form
                $("#issue-throbber").hide();
                $("#issue .issue-form").hide();

                var bugid = data.key;
                // VIPs get a link to the issue
                if (vip) {
                    bugid = "<a href='https://khanacademy.atlassian.net/browse/" +
                            data.key + "'>" + data.key + "</a>";
                }

                // show status message
                $("#issue-status").removeClass("error")
                    .html(i18n._("<p>Thank you for your feedback! " +
                        "Issue <b>%(bugid)s</b> has been opened and " +
                        "we'll look into it shortly.</p>",
                        {bugid: bugid}))
                    .show();

                // reset the form elements
                formElements.attr("disabled", false)
                    .not("input:submit").val("");

                // replace throbber with the cancel button
                $("#issue-cancel").show();
                $("#issue-throbber").hide();
            };

            var onFailure = function() {
                // Sometimes communication to JIRA will fail and there's not
                // much we can do. Instead, just thank the user for taking the
                // time to give feedback.
                // TODO(eater): Figure out why JIRA occasionally fails
                $("#issue-status").html(i18n._("Thank you for your feedback!"))
                    .show();

                // enable the inputs
                formElements.attr("disabled", false);

                // replace throbber with the cancel button
                $("#issue-cancel").show();
                $("#issue-throbber").hide();
            };

            // /_mt/ puts this on a multithreaded module, which is
            // slower but cheaper.  We don't care how long this takes,
            // so it's a good choice for us!
            $.post("/api/internal/_mt/bigbingo/mark_conversions", {
                conversion_ids: "exercise_submit_issue"
            });

            Khan.submitIssue(issueInfo, onSuccess, onFailure);
        });
    },

    cleanupProblem: function() {
        $("#workarea, #hintsarea").runModules(problem, "Cleanup");
    }
};
// see line 178. this ends the main Khan module

// Assign these here so that when we load the base modules, `Khan` is already
// defined on the global namespace
window.Khan = Khan;
window.KhanUtil = Khan.Util;

// Load query string params
Khan.query = Khan.queryString();

if (Khan.query.activity !== undefined) {
    userExercise = {
        current: true,
        exerciseModel: {},
        readOnly: true,
        userActivity: JSON.parse(Khan.query.activity)
    };
}

// Seed the random number generator with the user's hash
if (localMode && Khan.query.seed) {
    randomSeed = parseFloat(Khan.query.seed);
} else {
    randomSeed = userCRC32 || (new Date().getTime() & 0xffffffff);
}

onjQueryLoaded();

function onjQueryLoaded() {
    initEvents();

    // Initialize to an empty jQuery set
    exercises = $();

    Khan.mathJaxLoaded = loadMathJax();

    $(function() {
        var promises = [];

        // Load all base modules, and if this is local mode, any specified
        // in the data-require on <html>
        promises.push(Khan.loadBaseModules());
        if (localMode) {
            var modString = document.documentElement.getAttribute(
                    "data-require") || "";
            var exMods = modString.length ? modString.split(" ") : [];

            Khan.exerciseModulesMap[currentExerciseId] = exMods;
            $.each(exMods, function(i, mod) {
                promises.push(loadModule(mod));
            });
        }

        promises.push(Khan.mathJaxLoaded);

        // Ensure that all local exercises get tagged with the exercise ID
        $("div.exercise").data("name", currentExerciseId);

        $.when.apply($, promises).then(function() {
            // All modules have now been loaded
            initialModulesPromise.resolve();
        });
    });

    $.fn.extend({
        // Run the methods provided by a module against some elements
        runModules: function(problem, type) {
            type = type || "";

            var info = {
                localMode: localMode,
                exerciseId: currentExerciseId
            };

            this.each(function(i, elem) {
                elem = $(elem);

                // Run the main method of any modules
                $.each(Khan.modules, function(mod) {
                    if ($.fn[mod + type]) {
                        elem[mod + type](problem, info);
                    }
                });
            });
            return this;
        }
    });
}

function loadAndRenderExercise(nextUserExercise) {
    debugLog("loadAndRenderExercise(" + (nextUserExercise && nextUserExercise.exercise) + ")");

    setUserExercise(nextUserExercise);

    var typeOverride = userExercise.problemType,
        seedOverride = userExercise.seed;

    var exerciseId = userExercise.exerciseModel.name,
        exerciseFile = userExercise.exerciseModel.fileName;

    function finishRender() {
        // Make scratchpad persistent per-user
        if (user && window.LocalStore) {
            var lastScratchpad = LocalStore.get("scratchpad:" + user);
            if (typeof lastScratchpad !== "undefined" && JSON.parse(lastScratchpad)) {
                Khan.scratchpad.show();
            }
        }

        $(Exercises).trigger("clearExistingProblem");

        // Generate a new problem
        makeProblem(exerciseId, typeOverride, seedOverride);
    }

    debugLog("loading and rendering " + exerciseId);
    loadExercise(exerciseId, exerciseFile).then(
        function() {
            debugLog("loaded " + exerciseId + ", now rendering");
            finishRender();
        });
}

/**
 * Returns whether we should skip the current problem because it's
 * a duplicate (or too similar) to a recently done problem in the same
 * exercise.
 */
function shouldSkipProblem() {
    // We don't need to skip duplicate problems in test mode, which allows
    // us to use the LocalStore localStorage abstraction from shared-package
    if (typeof LocalStore === "undefined") {
        return false;
    }

    var cacheKey = "prevProblems:" + user + ":" + currentExerciseName;
    var cached = LocalStore.get(cacheKey);
    var lastProblemNum = (cached && cached["lastProblemNum"]) || 0;

    if (lastProblemNum === problemNum) {
        // Getting here means the user refreshed the page or returned to
        // this exercise after being away. So, we don't need to and
        // shouldn't skip this problem.
        return false;
    }

    var pastHashes = (cached && cached["history"]) || [];
    var varsHash = $.tmpl.getVarsHash();

    // Should skip the current problem if we've already seen it in the past
    // few problems, but not if we've been fruitlessly skipping for a while.
    // The latter situation could happen if a problem has very few unique
    // problems (eg. exterior angles problem type of angles_of_a_polygon).
    if (_.contains(pastHashes, varsHash) && consecutiveSkips < dupWindowSize) {
        consecutiveSkips++;
        return true;
    } else {
        consecutiveSkips = 0;
        pastHashes.push(varsHash);
        while (pastHashes.length > dupWindowSize) {
            pastHashes.shift();
        }

        if (LocalStore.isEnabled()) {
            LocalStore.set(cacheKey, {
                lastProblemNum: problemNum,
                history: pastHashes
            });
        }
        return false;
    }
}


function checkIfAnswerEmpty(guess) {
    // If multiple-answer, join all responses and check if that's empty
    // Remove commas left by joining nested arrays in case multiple-answer is nested
    return $.trim(guess) === "" || (guess instanceof Array &&
             $.trim(guess.join("").replace(/,/g, "")) === "");
}

function makeProblem(exerciseId, typeOverride, seedOverride) {
    debugLog("makeProblem(" + exerciseId + ", " + typeOverride + ", " + seedOverride + ")");

    Khan.scratchpad.enable();

    // Allow passing in an arbitrary seed
    if (typeof seedOverride !== "undefined") {
        currentProblemSeed = seedOverride;

    // If no user, just pick a random seed
    } else if (user == null) {
        currentProblemSeed = Math.abs(randomSeed % bins);
    }
    debugLog("  using seed " + currentProblemSeed + " for " + exerciseId);

    // Set randomSeed to what currentProblemSeed is (save currentProblemSeed for recall later)
    randomSeed = currentProblemSeed;

    // Check to see if we want to test a specific problem
    if (localMode) {
        typeOverride = typeof typeOverride !== "undefined" ? typeOverride : Khan.query.problem;
    }

    // problems contains the unprocessed contents of each problem type within exerciseId
    var problems = exercises.filter(function() {
        return $.data(this, "name") === exerciseId;
    }).children(".problems").children();

    if (!problems.length) {
        Khan.error("No problem matching exerciseId " + exerciseId);
    }

    if (typeof typeOverride !== "undefined") {
        problem = /^\d+$/.test(typeOverride) ?
            // Access a problem by number
            problems.eq(parseFloat(typeOverride)) :

            // Or by its ID
            problems.filter("#" + typeOverride);

        currentProblemType = typeOverride;

    // Otherwise create a random problem from weights
    } else {
        var typeIndex = [];
        $.each(problems, function(index) {
            if ($(this).data("weight") === 0) { return; }
            var weight = $(this).data("weight") || 1;
            _.times(weight, function(){ typeIndex.push(index); });
        });
        var typeNum = typeIndex[Math.floor(KhanUtil.random() * typeIndex.length)];
        problem = problems.eq(typeNum);
        currentProblemType = $(problem).attr("id") || "" + typeNum;
    }

    // TODO(brianmerlob): If we still don't have a problem then it's time to fail as gracefully
    // as we can. This probably occurs during mastery challenges when some sort of race
    // condition causes the type for one problem to sneak it's way in for another problem
    // and then `problem = problems.eq(type)` returns an empty object (thus length === 0).
    // This should _never_ happen, and hopefully these autoSubmitIssues will help debug.
    if (!problem.length && problems.length) {
        Khan.autoSubmitIssue("type was for the incorrect problem; failed gracefully");
        problem = problems.eq(Math.floor(KhanUtil.random() * problems.length));
    }

    // Find which exercise this problem is from
    exercise = problem.parents("div.exercise").eq(0);

    debugLog("  chose problem type [" + currentProblemType + "] and seed [" + currentProblemSeed + "] for " + exerciseId);

    // Work with a clone to avoid modifying the original
    problem = problem.clone();

    debugLog("cloned problem");

    $("#workarea").append(problem);

    // If there's an original problem, add inherited elements
    var parentType = problem.data("type");

    // We want to wait until problem is "fully formed" before
    // attempting to move #solutionarea
    while (parentType) {
        // Copy over the parent element to the child
        var original = exercise.find(".problems #" + parentType).clone();
        problem.prepend(original.children().data("inherited", true));

        // Keep copying over the parent elements (allowing for deep inheritance)
        parentType = original.data("type");
    }

    // Add any global exercise defined elements
    problem.prepend(exercise.children(":not(.problems)").clone().data("inherited", true));

    debugLog("cloned global elements");

    // Apply templating
    var children = problem
        // var blocks append their contents to the parent
        .find(".vars").tmplApply({attribute: "class", defaultApply: "appendVars"}).end()

        // Individual variables override other variables with the same name
        .find(".vars [id]").tmplApply().end()

        // We also look at the main blocks within the problem itself to override,
        // ignoring graphie and spin blocks
        .children("[class][class!='graphie'][class!='spin']").tmplApply({attribute: "class"});

    debugLog("ran tmplApply to vars and main elements");

    // Finally we do any inheritance to the individual child blocks (such as problem, question, etc.)
    children.each(function() {
        // Apply while adding problem.children() to include
        // template definitions within problem scope
        $(this).find("[id]").add(children).tmplApply();
    });

    debugLog("ran tmplApply to [id]");

    // Remove and store hints to delay running modules on it
    hints = problem.children(".hints").remove();

    // Only show the calculator if it's specifically allowed for this problem
    if (problem.data("calculator") == null) {
        $("#calculator").hide();
    } else {
        $("#calculator").show();
    }

    debugLog("removed hints from DOM");

    // Evaluate any inline script tags in this exercise's source
    $.each(exercise.data("script") || [], function(i, scriptContents) {
        $.globalEval(scriptContents);
    });

    debugLog("evaled inline scripts");

    // ...and inline style tags.
    if (exercise.data("style")) {
        var exerciseStyleElem = $("#exercise-inline-style");

        // Clear old exercise style definitions
        if (exerciseStyleElem.length && exerciseStyleElem[0].styleSheet) {
            // IE refuses to modify the contents of <style> the normal way
            exerciseStyleElem[0].styleSheet.cssText = "";
        } else {
            exerciseStyleElem.empty();
        }

        // Then add rules specific to this exercise.
        $.each(exercise.data("style"), function(i, styleContents) {
            if (exerciseStyleElem.length && exerciseStyleElem[0].styleSheet) {
                // IE refuses to modify the contents of <style> the normal way
                exerciseStyleElem[0].styleSheet.cssText = exerciseStyleElem[0].styleSheet.cssText + styleContents;
            } else {
                exerciseStyleElem.append(styleContents);
            }
        });
    }

    debugLog("added inline styles");

    // Reset modules to only those required by the current exercise
    Khan.resetModules(exerciseId);

    // Run the main method of any modules
    problem.runModules(problem, "Load");
    debugLog("done with runModules Load");
    problem.runModules(problem);
    debugLog("done with runModules");

    if (typeof seedOverride === "undefined" && shouldSkipProblem()) {
        // If this is a duplicate problem we should skip, just generate
        // another problem of the same problem type but w/ a different seed.
        debugLog("duplicate problem!");
        $(Exercises).trigger("clearExistingProblem");
        nextSeed(1);
        return makeProblem(exerciseId);
    }

    // Store the solution to the problem
    var solution = problem.find(".solution");

    // Get the multiple choice problems
    var choices = problem.find(".choices");

    // Get the area into which solutions will be inserted,
    // Removing any previous answer
    var solutionarea = $("#solutionarea").empty();

    // XXX(alex): Proactively move #solutionarea back to its original location,
    // in case it is not already there. This should never be the case,
    // but that's somehow not very reassuring.
    $(".solutionarea-placeholder").after($("#solutionarea"));

    // See if we're looking for a specific style of answer
    var answerType = solution.data("type");

    // Make sure that the answer type exists
    if (answerType) {
        if (Khan.answerTypes && !Khan.answerTypes[answerType]) {
            Khan.error("Unknown answer type specified: " + answerType);
            return;
        }
    }

    if (!answerType) {
        // If a multiple choice block exists
        if (choices.length) {
            answerType = "radio";

        // Otherwise we assume the smart number type
        } else {
            answerType = "number";
        }
    }

    // Generate a type of problem
    // (this includes possibly generating the multiple choice problems,
    // if this fails then we will need to try generating another one.)
    debugLog("decided on answer type " + answerType);

    // Move the answer area into the question:
    if (problem.find(".render-answer-area-here").length) {
        // Either to a specific place in the question...
        problem.find(".render-answer-area-here").before($("#solutionarea"));
    } else {
        // ...or else just to the end of the question.
        problem.append($("#solutionarea"));
    }

    // This is where we actually insert content into #solutionarea
    answerData = Khan.answerTypes[answerType].setup(solutionarea, solution);

    validator = answerData.validator;
    getAnswer = answerData.answer;
    debugLog("validator created");

    // A working solution was generated
    if (validator) {
        // Have MathJax redo the font metrics for the solution area
        // (ugh, this is gross)
        KhanUtil.processAllMath($("#solutionarea")[0], true);

        // Focus the first input
        // Use .select() and on a delay to make IE happy
        var firstInput = solutionarea.find(":input").first();
        if ($(".calculator input:visible").length) {
            firstInput = $(".calculator input");
        }

        setTimeout(function() {
            if (!firstInput.is(":disabled")) {
                firstInput.focus();
                if (firstInput.is("input:text")) {
                    firstInput.select();
                }
            }
        }, 1);

        lastFocusedSolutionInput = firstInput;
        solutionarea.find(":input").focus(function() {
            // Save which input is focused so we can refocus it after the user hits Check Answer
            lastFocusedSolutionInput = this;
        });
    } else {
        // Making the problem failed, let's try again (up to 3 times)
        debugLog("validator was falsey");

        // Put back #solutionarea
        // TODO(alex): Consider delaying the #solutionarea move until after we
        // have confirmed that a working solution was generated so that we
        // don't have to put it back right away if one wasn't
        $(".solutionarea-placeholder").after($("#solutionarea"));

        problem.remove();
        if (failureRetryCount < 100) {
            failureRetryCount++;
            // If this seed didn't work for some reason, just try the next
            // seed for the same problem type. This probably happens because:
            //
            // 1)  Something with a multiple-choice answer requires, say 4
            //     choices, but this seed was only able to generate three
            //     choices.
            // 1a) A multiple choice question doesn't require a specific number
            //     of choices and therefore requires all choices to be shown,
            //     but there were duplicates among the generate choices leading
            //     to fewer than all of them able to be shown, so we give up
            //     and have to try with a different seed.
            //
            // TODO(eater): Handle this case better. Since this leads to
            // potentially duplicate problems (e.g., when seed 10, 11, and 12
            // all fall back to seed 12), users see less variety.
            var newSeed = (currentProblemSeed + 1) % bins;

            makeProblem(exerciseId, typeOverride, newSeed);
        } else {
            debugLog("Failed making problem too many times");
            Khan.error("Failed while attempting to MakeProblem too many " +
                "times in a row");
        }
        return;
    }

    // Remove the solution and choices elements from the display
    // Some exercises (e.g., parabola_intuition_3) break if we don't remove
    // so always do it unless ?noremovesolution is explicitly passed
    if (localMode && Khan.query.noremovesolution != null) {
        solution.hide();
        choices.hide();
    } else {
        solution.remove();
        choices.remove();
    }

    // Add the problem into the page
    Khan.scratchpad.resize();

    // Enable the all answer input elements except the check answer button.
    $("#answercontent input")
        .not("#check-answer-button, #show-prereqs-button")
        .prop("disabled", false);

    // save a normal JS array of hints so we can shift() through them later
    hints = hints.tmpl().children().get();

    // Hook out for exercise test runner
    if (localMode && parent !== window && typeof parent.jQuery !== "undefined") {
        parent.jQuery(parent.document).trigger("problemLoaded", [makeProblem, answerData.solution]);
    }

    $("#hint").val(i18n._("I'd like a hint"));

    $(Exercises).trigger("newProblem", {
        numHints: hints.length,
        userExercise: userExercise,
        answerData: answerData,
        answerType: answerType,
        solution: solution,
        hints: hints,
        problem: problem
    });

    hintsUsed = 0;

    // The server says the user has taken hints on this problem already
    // show all lastCountHints it says we have seen
    if (userExercise && userExercise.lastCountHints) {
        _(userExercise.lastCountHints).times(showHint);
    }

    // Let listeners (like the mobile app) know that we've finished rendering
    // the initial hints.
    $(Exercises).trigger("initialHintsShown");

    // Add autocomplete="off" attribute so IE doesn't try to display previous answers
    $("#problem-and-answer").find("input[type='text'], input[type='number']")
                            .attr("autocomplete", "off");

    // If the textbox is empty disable "Check Answer" button
    // Note: We don't do this for multiple choice, number line, etc.
    if (answerType === "text" || answerType === "number") {
        var checkAnswerButton = $("#check-answer-button");
        var skipQuestionButton = $("#skip-question-button");
        checkAnswerButton.attr("disabled", "disabled").attr(
            "title", i18n._("Type in an answer first."));
        // Enables the check answer button - added so that people who type
        // in a number and hit enter quickly do not have to wait for the
        // button to be enabled by the key up
        $("#solutionarea")
            .on("keypress.emptyAnswer", function(e) {
                if (e.keyCode !== 13) {
                    checkAnswerButton.prop("disabled", false)
                        .removeAttr("title");
                }
            })
            .on("keyup.emptyAnswer", function(e) {
                var guess = getAnswer();
                if (checkIfAnswerEmpty(guess)) {
                    skipQuestionButton.prop("disabled", false);
                    checkAnswerButton.prop("disabled", true);
                } else if (e.keyCode !== 13) {
                    // Enable check answer button again as long as it is
                    // not the enter key
                    checkAnswerButton.prop("disabled", false);
                    skipQuestionButton.prop("disabled", true);
                }
            });

    }

    return answerType;
}

function showHint() {
    debugLog("showHint()");
    // Called when user hits hint button triggering showHint event or when
    // the server side data says the last_count_hints is not 0 when
    // exercise is loaded.
    var hint = hints.shift();
    if (!hint) {
        // :(
        return;
    }

    hintsUsed++;

    var problem = $(hint).parent();

    // Append first so MathJax can sense the surrounding CSS context properly
    // Also add in some properties so that the hint is focusable
    $(hint).attr({
        tabIndex: "-1"
    }).appendTo("#hintsarea").runModules(problem);

    if (hints.length === 0) {
        $(hint).addClass("last-hint");
    }

    // Focus the hint, forcing it to be read by a screen reader
    $(hint).focus();

    // TODO(james): figure out a way to trigger hintUsed to ensure that the
    // cards are updated properly, but make sure the ajax calls to
    // submit the hints are not resubmited for the case where we are
    // calling this function because last_count_hints was not 0
}

function renderDebugInfo() {
    debugLog("renderDebugInfo()");
    // triggered on newProblem

    if (userExercise == null || Khan.query.debug != null) {
        $("#problem-permalink").text("Permalink: " +
                                     currentProblemType + " #" +
                                     currentProblemSeed)
            .attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + "?debug&problem=" + currentProblemType + "&seed=" + currentProblemSeed);
    }

    // Show the debug info
    if (localMode && Khan.query.debug != null) {
        $(document).keypress(function(e) {
            if (e.charCode === 104) {
                $("#hint").click();
            }
        });
        var debugWrap = $("#debug").css({"margin-right": "15px"}).empty();
        var debugURL = window.location.protocol + "//" + window.location.host + window.location.pathname +
            "?debug&problem=" + currentProblemType;

        $("<h3>Debug Info</h3>").appendTo(debugWrap);

        var src = exercise.data("src");
        if (src != null) {
            var srcInfo = $("<p>").appendTo(debugWrap);
            srcInfo.append("From ");

            $("<a>")
                .text(src)
                .attr("href", src + "?debug")
                .appendTo(srcInfo);
        }

        var links = $("<p>").appendTo(debugWrap);

        if (!Khan.query.activity) {
            var historyURL = debugURL + "&seed=" + currentProblemSeed + "&activity=";
            $("<a>Problem history</a>").attr("href", "javascript:").click(function() {
                window.location.href = historyURL + encodeURIComponent(
                        JSON.stringify(Exercises.userActivityLog));
            }).appendTo(links);
        } else {
            $("<a>Random problem</a>")
                .attr("href", window.location.protocol + "//" +
                        window.location.host + window.location.pathname +
                        "?debug")
                .appendTo(links);
        }

        links.append("<br><b>Problem types:</b><br>");

        exercises.children(".problems").children().each(function(n, prob) {
            var probID = $(prob).attr("id") || "" + n;
            links.append($("<div>")
                .css({
                    "padding-left": "20px",
                    "outline":
                        (currentProblemType === probID) ?
                        "1px dashed gray" : ""
                })
                .append($("<span>").text(n + ": "))
                .append($("<a>")
                    .text(probID)
                    .attr("href", window.location.protocol + "//" +
                        window.location.host + window.location.pathname +
                        "?debug&problem=" + probID)
                ));
        });


        // If this is a child exercise, show which one it came from
        if (exercise.data("name") !== currentExerciseId) {
            links.append("<br>");
            links.append("Original exercise: " + exercise.data("name"));
        }

        if ($.tmpl.DATA_ENSURE_LOOPS > 0) {
            var dataEnsureInfo = $("<p>");
            dataEnsureInfo.append("Data-ensure loops: " + $.tmpl.DATA_ENSURE_LOOPS);
            if ($.tmpl.DATA_ENSURE_LOOPS > 15) {
                dataEnsureInfo.css("background-color", "yellow");
            }
            if ($.tmpl.DATA_ENSURE_LOOPS > 30) {
                dataEnsureInfo.css("background-color", "orange");
            }
            if ($.tmpl.DATA_ENSURE_LOOPS > 50) {
                dataEnsureInfo.css("background-color", "red");
            }
            dataEnsureInfo.appendTo(debugWrap);
        }

        if (typeof $.tmpl.VARS !== "undefined") {
            var varInfo = $("<p>");

            $.each($.tmpl.VARS, function(name, value) {
                var str;

                if (typeof value === "function") {
                    str = value.toString();
                } else {
                    // JSON is prettier (when it works)
                    try {
                        str = JSON.stringify(value);
                    } catch (e) {
                        str = value.toString();
                    }
                }

                varInfo.append($("<b>").text(name));
                varInfo.append(": ");
                varInfo.append($("<var>").text(str));
                varInfo.append("<br>");
            });

            varInfo.appendTo(debugWrap);
        }

        // for special style rules

        $("body").addClass("debug");
    }
}

function renderExerciseBrowserPreview() {
    debugLog("renderExerciseBrowserPreview()");
    // triggered on newProblem

    // Version of the site used by Khan/exercise-browser for the iframe
    // preview
    if (localMode && Khan.query.browse != null) {
        $("html").addClass("exercise-browser");

        var browseWrap = $("#browse").empty();

        var links = $("<div>").addClass("problem-types");

        links.append($("<b>").text("Problem types:"));

        exercises.children(".problems").children().each(function(n, prob) {
            var probName = $(prob).attr("id");
            var probID = probName || n;
            var weight = $(prob).data("weight");
            weight = weight != null ? weight : 1;

            if (weight !== 0) {
                $("<a>").addClass("problem-type-link")
                    .text("#" + (n + 1) +
                        (probName != null ? ": " + probName : ""))
                    .attr("href", window.location.protocol + "//" +
                        window.location.host + window.location.pathname +
                        "?browse&problem=" + probID)
                    .appendTo(links);
            }
        });

        browseWrap.append(links);
    }
}

function renderNextProblem(data) {
    if (localMode) {
        // Just generate a new problem from existing exercise
        $(Exercises).trigger("clearExistingProblem");
        makeProblem(currentExerciseId);
    } else {
        loadAndRenderExercise(data.userExercise);
    }
}

/**
 * Called once each time an exercise page is initialized.
 * For multi-exercise pages, this can be called multiple times!
 * (e.g. in a tutorial view, where there is client side navigation between
 * different exercises).
 */
function prepareSite() {
    debugLog("prepareSite()");

    assessmentMode = !localMode && Exercises.assessmentMode;

    // Load and initialize the calculator
    require(["./genfiles/calculator.js"], function() {
        require(["./utils/init-calculator.js"], function() {
            Calculator.init();
        });
    });

    Khan.initReportIssueLink("#extras .report-issue-link");

    $("#answer_area").delegate("input.button, select", "keydown", function(e) {
        // Don't want to go back to exercise dashboard; just do nothing on backspace
        if (e.keyCode === 8) {
            return false;
        }
    });

    // Prepare for the debug info if requested
    if (localMode && Khan.query.debug != null) {
        $('<div id="debug"></div>').appendTo("#answer_area");
    }

    // Likewise, if we're in browse mode, setup for that
    if (localMode && Khan.query.browse != null) {
        $('<div id="browse"></div>').appendTo("#answer_area");
    }

    $(Khan)
        .bind("updateUserExercise", function(ev, data) {
            // TODO(alpert): Why isn't this in setUserExercise?
            // Any time we update userExercise, check if we're
            // setting/switching usernames
            if (data && data.userExercise) {
                user = data.userExercise.user || user;
                userCRC32 = user != null ? crc32(user) : null;
                randomSeed = userCRC32 || randomSeed;
            }
        });

    $(Khan).bind("gotoNextProblem", function() {
        if (localMode) {
            // Automatically advance to the next problem
            nextProblem(1);
            renderNextProblem();
        } else {
            // Just listen for the readyForNextProblem event, which will
            // include an updated userExercise (and thus an updated problem
            // number)
        }
    });
}

function initEvents() {
    // This function gets called as soon as jQuery is loaded -- on the live
    // site, that's immediately upon execution
    $(Khan)
        .bind("problemTemplateRendered", prepareSite)
        .bind("readyForNextProblem", function(ev, data) {
            renderNextProblem(data);
        })
        .bind("upcomingExercise", function(ev, data) {
            var userExercise = data.userExercise;
            loadExercise(
                    userExercise.exercise,
                    userExercise.exerciseModel.fileName);
        })
        .bind("showHint", function() {
            showHint();
            $(Exercises).trigger("hintShown", {
                card: Exercises.currentCard
            });
        })
        .bind("refocusSolutionInput", function() {
            // Refocus text field so user can type a new answer
            if (lastFocusedSolutionInput != null) {
                setTimeout(function() {
                    var focusInput = $(lastFocusedSolutionInput);

                    if (!focusInput.is(":disabled")) {
                        // focus should always work; hopefully select
                        // will work for text fields
                        focusInput.focus();
                        if (focusInput.is("input:text")) {
                            focusInput.select();
                        }
                    }
                }, 1);
            }
        });
    $(Exercises)
        .bind("newProblem", renderDebugInfo)
        .bind("newProblem", renderExerciseBrowserPreview);
}

function deslugify(name) {
    name = name.replace(/_/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function setProblemNum(num) {
    problemNum = num;
    currentProblemSeed = (seedOffset + jumpNum * (problemNum - 1 + seedsSkipped)) % bins;
}

function getSeedsSkippedCacheKey() {
    return "seedsSkipped:" + user + ":" + currentExerciseName;
}

/**
 * Advances the seed (as if the problem number had been advanced) without
 * actually changing the problem number. Caches how many seeds we've skipped
 * so that refreshing does not change the generated problem.
 * @param {number} num Number of times to advance the seed.
 */
function nextSeed(num) {
    seedsSkipped += num;
    if (typeof LocalStore !== "undefined") {
        LocalStore.set(getSeedsSkippedCacheKey(), seedsSkipped);
    }
    setProblemNum(problemNum);
}

function nextProblem(num) {
    setProblemNum(problemNum + num);
}

function setUserExercise(data) {
    userExercise = data;

    if (data && data.exercise) {
        currentExerciseId = data.exercise;
        currentExerciseName = data.exerciseModel.displayName;
        currentExerciseFile = data.exerciseModel.fileName;
    }

    if (user != null) {
        // How far to jump through the problems
        jumpNum = primes[userCRC32 % primes.length];

        // The starting problem of the user
        seedOffset = userCRC32 % bins;

        // The number of seeds that were skipped due to duplicate problems
        seedsSkipped = (typeof LocalStore !== "undefined" &&
            LocalStore.get(getSeedsSkippedCacheKey()) || 0);

        // Advance to the current problem seed
        setProblemNum(userExercise.totalDone + 1);
    }
}

/**
 * Load an exercise and return a promise that is resolved when an exercise
 * is loaded
 *
 * @param {string} exerciseId uniquely identifies exercise (e.g. addition_1)
 * @param {string} fileName identifies the exercise's path
 */
function loadExercise(exerciseId, fileName) {
    var promise = exerciseFilePromises[exerciseId];
    if (promise != null) {
        // Already started (or finished) loading this exercise
        return promise;
    } else {
        promise = exerciseFilePromises[exerciseId] = $.Deferred();
    }

    // Promises for remote exercises contained within this one
    var subpromises = [];

    debugLog("loadExercise start " + fileName);
    // Packing occurs on the server but at the same "exercises/" URL
    $.get(urlBase + "exercises/" + fileName).done(function(data) {
        debugLog("loadExercise got " + fileName);

        // Get rid of any external scripts in data before we shove data
        // into a jQuery object. IE8 will attempt to fetch these external
        // scripts otherwise.
        // See https://github.com/Khan/khan-exercises/issues/10957
        data = data.replace(/<script[^>]+src=[^<]*<\/script>/, "");

        var newContents = $(data).filter(".exercise");

        // ...then save the exercise ID and fileName for later
        newContents.data({
            name: exerciseId,
            fileName: fileName
        });

        // Add the new exercise elements to the exercises DOM set
        exercises = exercises.add(newContents);

        // Extract data-require
        var match = data.match(
                /<html(?:[^>]+)data-require=(['"])((?:(?!\1).)*)\1/);
        var requires;
        if (match != null) {
            requires = match[2].length ? match[2].split(" ") : [];
        } else {
            requires = [];
        }

        $.each(requires, function(i, mod) {
            debugLog("loadExercise submod " + (mod.src || mod));
            subpromises.push(loadModule(mod));
        });
        subpromises.push(Khan.loadBaseModules());

        // Store the module requirements in exerciseModulesMap
        Khan.exerciseModulesMap[exerciseId] = requires;

        // Extract contents from various tags and save them up for parsing
        // when actually showing this particular exercise.
        var tagsToExtract = {
            // TODO(alpert): Do we use title?
            title: /<title>([^<]*(?:(?!<\/title>)<[^<]*)*)<\/title>/gi,

            // Scripts with no src
            script: /<(?:)script\b[^s>]*(?:(?!src=)s[^s>]*)*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/gi,

            style: /<style[^>]*>([\s\S]*?)<\/style>/gi
        };

        $.each(tagsToExtract, function(tag, regex) {
            var result = [];
            while ((match = regex.exec(data)) != null) {
                result.push(match[1]);
            }

            newContents.data(tag, result);
        });

        // Wait for any modules to load, then resolve the promise
        $.when.apply($, subpromises).then(function() {
            // Success; all modules loaded
            debugLog("loadExercise finish " + fileName);
            promise.resolve();
        }, function() {
            // Failure; some modules failed to load
            // TODO(alpert): Find a useful error message
            debugLog("loadExercise subfail " + fileName);
            promise.reject();
        });
    }).fail(function(xhr, status) {
        debugLog("loadExercise err " + xhr.status + " " + fileName);
        if (status === "timeout") {
            Khan.warn(i18n._("Your internet might be too slow to see an " +
                             "exercise."));
        } else if (xhr.status === 404) {
            Khan.warn(i18n._("Oops!  We can't seem to find this exercise."));
        } else {
            Khan.warn(i18n._("Oops!  There was a problem loading this " +
                             "exercise."));
        }
    });

    return promise;
}

function loadModule(moduleName) {
    // Return the promise if it exists already
    var selfPromise = modulePromises[moduleName];
    if (selfPromise) {
        return selfPromise;
    } else {
        selfPromise = $.Deferred();
    }
    debugLog("loadModule mod " + moduleName);

    // Load the module
    require(["./utils/" + moduleName + ".js"], function() {
        selfPromise.resolve();
    });

    modulePromises[moduleName] = selfPromise;
    return selfPromise;
}

// Load a script by URL, then execute callback
function loadScript(url, callback) {
    var head = document.getElementsByTagName("head")[0];

    debugLog("loadScript loading " + url);

    // Adapted from jQuery getScript (ajax/script.js) -- can't use
    // jQuery here because we load jQuery using this routine
    var script = document.createElement("script");
    script.async = "async";
    script.src = url;

    script.onerror = function() {
        // No error in IE, but this is mostly for debugging during
        // development so it's probably okay
        // http://stackoverflow.com/questions/2027849/how-to-trigger-script-onerror-in-internet-explorer
        Khan.error("Error loading script " + script.src);
    };

    script.onload = script.onreadystatechange = function() {
        if (!script.readyState ||
                (/loaded|complete/).test(script.readyState)) {
            debugLog("loadScript loaded " + url);

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }

            // Dereference the script
            script = undefined;

            callback();
        }
    };

    head.appendChild(script);
}

function loadMathJax() {
    var deferred = $.Deferred();

    // We don't want to finish until MathJax is done loading all of its
    // dependencies.

    if (window.MathJax) {
        waitForMathJaxReady();
    } else {
        loadScript(urlBase + "third_party/MathJax/2.1/MathJax.js?config=KAthJax-3d6f4e415c7ff2242f5279bfbcbb5c9f", waitForMathJaxReady);
    }

    function waitForMathJaxReady() {
        MathJax.Hub.Queue(deferred.resolve);
    }

    return deferred.promise();
}

function loadLocalModeSite() {
    // TODO(alpert): Is the DOM really not yet ready?
    $(function() {
        // Inject the site markup
        if (localMode) {
            $.get(urlBase + "exercises/khan-site.html", function(site) {
                $.get(urlBase + "exercises/khan-exercise.html",
                    function(ex) {
                        injectLocalModeSite(site, ex);
                    });
            });
        }
    });
}

function injectLocalModeSite(html, htmlExercise) {
    $("body").prepend(html);
    $("#container .exercises-header h2").append(document.title);
    $("#container .exercises-body .current-card-contents").html(
            htmlExercise);

    if (Khan.query.layout === "lite") {
        $("html").addClass("lite");
    }

    $(Exercises).trigger("problemTemplateRendered");

    exercises = exercises.add($("div.exercise").detach());
    // Generate the initial problem when dependencies are done being loaded
    makeProblem(currentExerciseId);
}

});
