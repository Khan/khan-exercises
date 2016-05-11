/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-console, no-undef, no-var, one-var, prefer-spread, space-before-blocks */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* khan-exercise.js

    TODO(csilvers): THIS DOCSTRING IS NOW WAY OUT OF DATE.  DON'T TRUST IT!

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

var userExercise,

    currentExerciseId = ((/([^\/.]+)(?:\.html)?$/.exec(window.location.pathname) || [])[1]) || "",

    // The seed information
    randomSeed = new Date().getTime() & 0xffffffff,

    // The current problem and its corresponding exercise
    problem,    // the unprocessed contents of a specific problem type

    // Info for constructing the seed
    currentProblemSeed = 0,

    currentProblemType,

    // Bug-hunting "undefined" attempt content
    debugLogLog = ["start of log"],
    debugLog = function(l) {
        debugLogLog.push(l);
    },

    // A promise for each loaded or loading module, keyed by module filename
    // (module.src), as well as a single promise for the loading of the base
    // modules that are common to every exercise. These will be resolved when
    // the module is loaded (on the live site, immediately)
    baseModulesPromise = null,
    initialModulesPromise = $.Deferred(),

    urlBase = Exercises.khanExercisesUrlBase != null ?
            Exercises.khanExercisesUrlBase :
            "/khan-exercises/";

// The main Khan Module
var Khan = {

    // Set of modules currently in use -- keys are module names, value is
    // always true
    modules: {},

    imageBase: "/images/",

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

    loadBaseModules: function() {
        if (baseModulesPromise) {
            return baseModulesPromise;
        } else {
            baseModulesPromise = $.Deferred();
        }
        debugLog("loadBaseModules");

        // Load the base modules.
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
        var wasVisible, pad;

        var actions = {
            disable: function() {
                wasVisible = actions.isVisible();
                actions.hide();

                $("#scratchpad-show").hide();
                $("#scratchpad-not-available").show();
            },

            enable: function() {
                if (wasVisible) {
                    actions.show();
                    wasVisible = false;
                }

                $("#scratchpad-show").show();
                $("#scratchpad-not-available").hide();
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
                customfield_10029: { value: 'perseus' },  // framework
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

            var issueInfo = Exercises.PerseusBridge.getIssueInfo();

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
};
// see line 100. this ends the main Khan module

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

onjQueryLoaded();

function onjQueryLoaded() {
    initEvents();

    Khan.mathJaxLoaded = loadMathJax();

    $(function() {
        var promises = [];

        // Load all base modules, and if this is local mode, any specified
        // in the data-require on <html>
        promises.push(Khan.loadBaseModules());
        promises.push(Khan.mathJaxLoaded);

        // Ensure that all local exercises get tagged with the exercise ID
        $("div.exercise").data("name", currentExerciseId);

        $.when.apply($, promises).then(function() {
            // All modules have now been loaded
            initialModulesPromise.resolve();
        });
    });

    $.fn.extend({
        // (There aren't any modules anymore!)
        runModules: function() { return this; }
    });
}

/**
 * Called once each time an exercise page is initialized.
 * For multi-exercise pages, this can be called multiple times!
 * (e.g. in a tutorial view, where there is client side navigation between
 * different exercises).
 */
function prepareSite() {
    debugLog("prepareSite()");

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

    // NOTE: Instead of using gotoNextProblem, listen for the
    // readyForNextProblem event, which will include an updated
    // userExercise (and thus an updated problem number)
}

function initEvents() {
    // This function gets called as soon as jQuery is loaded -- on the live
    // site, that's immediately upon execution
    $(Khan).bind("problemTemplateRendered", prepareSite);
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

});
