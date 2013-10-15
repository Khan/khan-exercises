/* khan-exercise.js

    The main entry point here is essentially the onjQueryLoaded method around
    line 750. It loads in many of the pre-reqs and then calls, one way or
    another, setUserExercise and loadModule for each required module in utils/.

    setProblemNum updates some instance vars that get looked at by other
    functions.

    loadModule will load an individual exercise util module (e.g.,
    word-problems.js, etc). It _also_ loads in the Khan Academy site skin and
    exercise template via injectSite which runs prepareSite first then
    makeProblemBag and makeProblem when it finishes loading dependencies.

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

    * allHintsUsed -- when all possible hints have been used by the user

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
*/

var Khan = (function() {
    // Numbers which are coprime to the number of bins, used for jumping through
    // exercises.  To quickly test a number in python use code like:
    // import fractions
    // fractions.gcd( 197, 200)
    var primes = [197, 3, 193, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
    47, 53, 59, 61, 67, 71, 73, 79, 83],

    /*
    ===============================================================================
    Crc32 is a JavaScript function for computing the CRC32 of a string
    ...............................................................................

    Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/

    -------------------------------------------------------------------------------
    Copyright (c) 2006 Andrea Ercolino
    http://www.opensource.org/licenses/mit-license.php
    ===============================================================================
    */

    // CRC32 Lookup Table
    table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 " +
            "9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD " +
            "E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D " +
            "6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC " +
            "14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 " +
            "A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C " +
            "DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC " +
            "51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F " +
            "2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB " +
            "B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F " +
            "9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB " +
            "086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E " +
            "6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA " +
            "FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE " +
            "A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A " +
            "346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 " +
            "5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 " +
            "CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 " +
            "B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 " +
            "9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 " +
            "E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 " +
            "6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 " +
            "10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 " +
            "A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B " +
            "D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF " +
            "4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 " +
            "220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 " +
            "B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A " +
            "9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE " +
            "0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 " +
            "68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 " +
            "FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 " +
            "A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D " +
            "3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 " +
            "47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 " +
            "CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 " +
            "B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D",

    /* Number */
    crc32 = function(str, crc) {
        if (crc == null) {
            crc = 0;
        }
        var n = 0; //a number between 0 and 255
        var x = 0; //a hex number

        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            n = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = "0x" + table.substr(n * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return Math.abs(crc ^ (-1));
    },

    userExercise,

    // Check to see if we're in local mode
    localMode = typeof Exercises === "undefined",

    // Set in prepareSite when Exercises.init() has already been called
    assessmentMode,

    // The ID, filename, and name of the exercise -- these will only be set here in localMode
    exerciseId = ((/([^\/.]+)(?:\.html)?$/.exec(window.location.pathname) || [])[1]) || "",
    exerciseFile = exerciseId + ".html",
    exerciseName = deslugify(exerciseId),

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
    problem,
    exercise,

    // The number of the current problem that we're on
    problemNum = 1,

    // Info for constructing the seed
    seedOffset = 0,
    jumpNum = 1,
    problemSeed = 0,
    seedsSkipped = 0,
    consecutiveSkips = 0,

    problemID,

    // The current validator function
    answerData,
    validator,
    getAnswer,

    hints,

    // The exercise elements
    exercises,

    // Where we are in the shuffled list of problem types
    problemBag,
    problemBagIndex = 0,

    // How many problems are we doing? (For the fair shuffle bag.)
    problemCount = 10,

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
    // (module.src) -- will be resolved when the module is loaded (on the live
    // site, immediately)
    modulePromises = {},

    // Promise that gets resolved when MathJax is loaded
    mathJaxLoaded,

    urlBase = localMode ? "../" : "/khan-exercises/",

    // In local mode, we use khan-exercises local copy of the /images
    // directory.  But in production (on www.khanacademy.org), we use
    // the canonical location of images, which is under '/'.
    imageBase = localMode ? urlBase + "images/" : "/images/",

    lastFocusedSolutionInput = null,

    gae_bingo = window.gae_bingo || {
        ab_test: function() {},
        bingo: function() {},
        tests: {}
    },

    // The ul#examples (keep in a global because we need to modify it even when it's out of the DOM)
    examples = null;

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
            addLink("local-only/katex/fonts/fonts.css");
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

        startLoadingExercise: startLoadingExercise,

        moduleDependencies: {
            "math": ["../third_party/raphael"],

            // Load Raphael locally because IE8 has a problem with the 1.5.2 minified release
            // http://groups.google.com/group/raphaeljs/browse_thread/thread/c34c75ad8d431544

            // The normal module dependencies.
            "calculus": ["math", "expressions", "polynomials"],
            "exponents": ["math", "math-format"],
            "kinematics": ["math"],
            "math-format": ["math", "expressions"],
            "polynomials": ["math", "expressions"],
            "stat": ["math"],
            "word-problems": ["math"],
            "derivative-intuition": ["../third_party/jquery.mobile.vmouse"],
            "unit-circle": ["../third_party/jquery.mobile.vmouse"],
            "interactive": ["graphie", "../third_party/jquery.mobile.vmouse"],
            "mean-and-median": ["stat"],
            "congruency": ["angles", "interactive"],
            "graphie-3d": ["graphie", "matrix"],
            "graphie-geometry": ["graphie", "matrix"],
            "graphie-helpers": ["math-format"],
            "matrix": ["expressions"],
            "matrix-input": ["../third_party/jquery.cursor-position"],
            "chemistry": ["math-format"]
        },

        warnTimeout: function() {
            $(Exercises).trigger("warning", [$._("Your internet might be too " +
                    "slow to see an exercise. Refresh the page or " +
                    "<a href='' id='warn-report'>report a problem</a>."),
                    false]);
            // TODO(alpert): This event binding is kind of gross
            $("#warn-report").click(function(e) {
                e.preventDefault();
                $("#report").click();
            });
        },

        warnFont: function() {
            var warning;
            if ($.browser.msie) {
                warning = $._("You should " +
                    "<a href='http://missmarcialee.com/2011/08/" +
                    "how-to-enable-font-download-in-internet-explorer-8/' " +
                    "target='_blank'>enable font download</a> " +
                    "to improve the appearance of math expressions."
                );
            } else {
                warning = $._("You should enable font download in your " +
                    "browser to improve the appearance of math expressions");
            }

            $(Exercises).trigger("warning", [warning, true]);
        },

        // TODO(alpert): This doesn't need to be in the Khan object.
        getBaseModules: function() {
            var mods = [];
            // Base modules required for every problem
            // MathJax is here because Perseus wants it loaded regardless of if
            // we load a khan-exercises problem that needs it. Previously it
            // was a dependency of 'math' so this isn't really any different.
            mods.push(
                "answer-types", "tmpl", "tex", "jquery.adhesion",
                "calculator",
                {
                    src: urlBase + "third_party/MathJax/2.1/MathJax.js?config=KAthJax-da9a7f53e588f3837b045a600e1dc439"
                });

            return mods;
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

            crc32: crc32,

            // Rounds num to X places, and uses the proper decimal point.
            // But does *not* insert thousands separators.
            localeToFixed: function(num, places) {
                var decimal = icu.getDecimalFormatSymbols().decimal_separator;
                return num.toFixed(places).replace(".", decimal);
            }
        },

        // Load in a collection of scripts, execute callback upon completion
        loadScript: function(url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var isMathJax = url.indexOf("/MathJax/") !== -1;

            if (!localMode && url.indexOf("/khan-exercises/") === 0 &&
                    (!isMathJax || window.MathJax)) {
                // Don't bother loading khan-exercises content in non-local
                // mode; this content is already packaged up and available
                // (*unless* it's MathJax, which is silly and still needs
                // to be loaded (if it's not preloaded))
                callback();
                return;
            }
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

                    if (isMathJax) {
                        // If we're loading MathJax, don't bump up the
                        // count of loaded scripts until MathJax is done
                        // loading all of its dependencies.
                        MathJax.Hub.Queue(mathJaxLoaded.resolve);
                        mathJaxLoaded.then(callback);
                    } else {
                        callback();
                    }
                }
            };

            head.appendChild(script);
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
                        $("#scratchpad").show();
                        $("#scratchpad-show").text($._("Hide scratchpad"));

                        // If pad has never been created or if it's empty
                        // because it was removed from the DOM, recreate a new
                        // scratchpad.
                        if (!pad || !$("#scratchpad div").children().length) {
                            pad = new DrawingScratchpad(
                                $("#scratchpad div")[0]);
                        }
                    };

                    loadModule("scratchpad").then(makeVisible);
                },

                hide: function() {
                    if (!actions.isVisible()) {
                        return;
                    }

                    $("#scratchpad").hide();
                    $("#scratchpad-show").text($._("Show scratchpad"));
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
                        userExercise.exerciseModel.sha1 : exerciseId,
                seed: problemSeed,
                problem_type: problemID
            };
        },

        getPreviewUrl: function() {
            return window.location.protocol + "//" + window.location.host +
                "/preview/content/e/" + exerciseId + "?seed=" +
                problemSeed + "&problem=" + problemID;
        },

        getIssueInfo: function() {
            var path = exerciseFile + "?seed=" + problemSeed + "&problem=" +
                        problemID,
                locale = icu.getLocale(),
                pathlink = "[" + path + (exercise.data("name") !== exerciseId ? " (" + exercise.data("name") + ")" : "") + "](http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug&lang=" + locale + ")",
                historyLink = "[Answer timeline](" + "http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug&lang=" + locale + "&activity=" + encodeURIComponent(JSON.stringify(Exercises.userActivityLog)).replace(/\)/g, "\\)") + ")",
                localeMsg = "Locale: " + locale,
                userHash = "User hash: " + crc32(user),

                parts = [pathlink, historyLink,
                        "    " + JSON.stringify(Exercises.guessLog), localeMsg, userHash],
                body = $.grep(parts, function(e) { return e != null; }).join("\n\n");

            return {
                pretitle: exerciseName,
                bodyInfo: body
            };
        },

        scoreInput: function() {
            return validator(getAnswer());
        },

        /**
         * Hijacks a specified link so that it opens up the issue form.
         * @param {string} selector The link selector - defaults to "#report"
         */
        initReportIssueLink: function(selector) {
            selector = selector || "#report";
            $(selector).click(function(e) {
                var issueIntro = $._("Remember to check the hints and " +
                        "double check your math. All provided information will " +
                        "be public. Thanks for your help!");

                e.preventDefault();

                var report = $("#issue").css("display") !== "none",
                    form = $("#issue .issue-form").css("display") !== "none";

                if (report && form) {
                    $("#issue").hide();
                } else if (!report || !form) {
                    $("#issue-status").removeClass("error").html(issueIntro);
                    $("#issue, #issue .issue-form").show();
                    $("html, body").animate({
                        scrollTop: $("#issue").offset().top
                    }, 500, function() {
                        $("#issue-title").focus();
                    });
                }
            });

            // Hide issue form.
            $("#issue-cancel").click(function(e) {
                e.preventDefault();

                $("#issue").hide(500);
                $("#issue-title, #issue-body").val("");
            });

            // Submit an issue.
            $("#issue .issue-form input:submit").click(function(e) {
                e.preventDefault();

                // don't do anything if the user clicked a second time quickly
                if ($("#issue .issue-form").css("display") === "none") {
                    return;
                }

                var framework = Exercises.getCurrentFramework(),
                    issueInfo = framework === "khan-exercises" ?
                            Khan.getIssueInfo() :
                            Exercises.PerseusBridge.getIssueInfo(),

                    type = $("input[name=issue-type]:checked").prop("id"),
                    title = $("#issue-title").val(),

                    agent = navigator.userAgent,
                    mathjaxInfo = "MathJax is " + (typeof MathJax === "undefined" ? "NOT loaded" :
                        ("loaded, " + (MathJax.isReady ? "" : "NOT ") + "ready, queue length: " + MathJax.Hub.queue.queue.length)),
                    sessionStorageInfo = (typeof sessionStorage === "undefined" || typeof sessionStorage.getItem === "undefined" ? "sessionStorage NOT enabled" : null),
                    warningInfo = $("#warning-bar-content").text(),

                    parts = [$("#issue-body").val() || null, issueInfo.bodyInfo, agent, sessionStorageInfo, mathjaxInfo, warningInfo],
                    body = $.grep(parts, function(e) { return e != null; }).join("\n\n"),

                    issueError = $._("Communication with GitHub isn't working. " +
                        "Please file the issue manually at " +
                        "<a href=\"http://github.com/Khan/khan-exercises/issues/new\">GitHub</a>. " +
                        "Please reference exercise: %(exerciseId)s.", {exerciseId: exerciseId}),
                    issueSuccess = function(url, title, suggestion) {
                        return $._("Thank you for your feedback! " +
                            "Your issue has been created and can be " +
                            "found at the following link:" +
                            "<p><a id=\"issue-link\" href=\"%(issueUrl)s\">%(issueTitle)s</a>" +
                            "<p>%(suggestion)s</p>",
                            {issueUrl: url, issueTitle: title, suggestion: suggestion}
                        );
                    };

                var mathjaxLoadFailures = $.map(MathJax.Ajax.loading, function(info, script) {
                    if (info.status === -1) {
                        return [script + ": error"];
                    } else {
                        return [];
                    }
                }).join("\n");
                if (mathjaxLoadFailures.length > 0) {
                    body += "\n\n" + mathjaxLoadFailures;
                }
                body += "\n\n" + debugLogLog.join("\n");

                // flagging of browsers/os for issue labels. very primitive, but
                // hopefully sufficient.
                var agent_contains = function(sub) {
                        return agent.indexOf(sub) !== -1;
                    },
                    flags = {
                        ie8: agent_contains("MSIE 8.0"),
                        ie9: agent_contains("Trident/5.0"),
                        chrome: agent_contains("Chrome/"),
                        safari: !agent_contains("Chrome/") && agent_contains("Safari/"),
                        firefox: agent_contains("Firefox/"),
                        win7: agent_contains("Windows NT 6.1"),
                        vista: agent_contains("Windows NT 6.0"),
                        xp: agent_contains("Windows NT 5.1"),
                        leopard: agent_contains("OS X 10_5") || agent_contains("OS X 10.5"),
                        snowleo: agent_contains("OS X 10_6") || agent_contains("OS X 10.6"),
                        lion: agent_contains("OS X 10_7") || agent_contains("OS X 10.7"),
                        scratchpad: (/scratch\s*pad/i).test(body),
                        ipad: agent_contains("iPad"),
                        undef: Exercises.guessLog == null
                    },
                    labels = [];
                $.each(flags, function(k, v) {
                    if (v) {
                        labels.push(k);
                    }
                });

                if (!type) {
                    $("#issue-status").addClass("error")
                        .html($._("Please specify the issue type.")).show();
                    return;
                } else {
                    labels.push(type.slice("issue-".length));

                    var hintOrVideoMsg = $._("Please click the hint button above " +
                        "to see our solution or watch a video for additional help.");
                    var refreshOrBrowserMsg = $._("Please try a hard refresh " +
                        "(press Ctrl + Shift + R) or use Khan Academy from a " +
                        "different browser (such as Chrome or Firefox).");
                    var suggestion = {
                        "issue-wrong-or-unclear": hintOrVideoMsg,
                        "issue-hard": hintOrVideoMsg,
                        "issue-not-showing": refreshOrBrowserMsg,
                        "issue-other": ""
                    }[type];
                }

                if (title === "") {
                    $("#issue-status").addClass("error")
                        .html($._("Please provide a valid title for the issue.")).show();
                    return;
                }

                var formElements = $("#issue input").add("#issue textarea");

                // disable the form elements while waiting for a server response
                formElements.attr("disabled", true);

                $("#issue-cancel").hide();
                $("#issue-throbber").show();

                var dataObj = {
                    title: issueInfo.pretitle + " - " + title,
                    body: body,
                    labels: labels
                };

                $.ajax({
                    url: "/githubpost",
                    type: "POST",
                    data: JSON.stringify(dataObj),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data) {
                        // hide the form
                        $("#issue .issue-form").hide();

                        // show status message
                        $("#issue-status").removeClass("error")
                            .html(issueSuccess(data.html_url, data.title, suggestion))
                            .show();

                        // reset the form elements
                        formElements.attr("disabled", false)
                            .not("input:submit").val("");

                        // replace throbber with the cancel button
                        $("#issue-cancel").show();
                        $("#issue-throbber").hide();
                    },
                    error: function() {
                        // show status message
                        $("#issue-status").addClass("error")
                            .html(issueError).show();

                        // enable the inputs
                        formElements.attr("disabled", false);

                        // replace throbber with the cancel button
                        $("#issue-cancel").show();
                        $("#issue-throbber").hide();
                    }
                });
            });
        },

        cleanupProblem: function() {
            $("#workarea, #hintsarea").runModules(problem, "Cleanup");
        }
    };
    // see line 183. this ends the main Khan module

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

    if (localMode) {
        var lang = Khan.query.lang || "en-US";

        // Load in jQuery and underscore, as well as the interface glue code
        // TODO(cbhl): Don't load history.js if we aren't in readOnly mode.
        var initScripts = [
                "../local-only/jquery.js",
                "../local-only/jquery-migrate-1.1.1.js",
                "../local-only/jquery.ui.core.js",
                "../local-only/jquery.ui.widget.js",
                "../local-only/jquery.ui.mouse.js",
                "../local-only/jquery.ui.position.js",
                "../local-only/jquery.ui.effect.js",
                "../local-only/jquery.ui.effect-shake.js",
                "../local-only/jquery.ui.button.js",
                "../local-only/jquery.ui.draggable.js",
                "../local-only/jquery.ui.resizable.js",
                "../local-only/jquery.ui.dialog.js",
                "../local-only/jquery.qtip.js",
                "../local-only/underscore.js",
                "../local-only/kas.js",
                "../local-only/jed.js",
                "../local-only/i18n.js",
                "../local-only/localeplanet/icu." + lang + ".js",
                "../local-only/i18n.js",
                "../local-only/katex/katex.js",
                "../exercises-stub.js",
                "../history.js",
                "../interface.js",
                "../related-videos.js"
            ];

        (function loadInitScripts() {
            if (initScripts.length) {
                var src = initScripts.shift();
                Khan.loadScript(src, loadInitScripts);
            } else {
                onjQueryLoaded();
            }
        })();
    } else {
        onjQueryLoaded();
    }

    function onjQueryLoaded() {
        initEvents();

        // Initialize to an empty jQuery set
        exercises = $();

        mathJaxLoaded = $.Deferred();
        Khan.mathJaxLoaded = mathJaxLoaded.promise();

        $(function() {
            var promises = [];

            // Load all base modules, and if this is local mode, any specified
            // in the data-require on <html>
            var mods = Khan.getBaseModules();
            if (localMode) {
                var modString = document.documentElement.getAttribute(
                        "data-require") || "";
                var exMods = modString.length ? modString.split(" ") : [];

                Khan.exerciseModulesMap[exerciseId] = exMods;
                mods.push.apply(mods, exMods);
            }

            $.each(mods, function(i, mod) {
                promises.push(loadModule(mod));
            });

            // Ensure that all local exercises that don't have a data-name
            // already get tagged with the current, original data-name.
            $("div.exercise").not("[data-name]").data("name", exerciseId);

            var remoteExercises = $("div.exercise[data-name]");

            remoteExercises.each(function() {
                promises.push(loadExercise(this));
            });

            // All remote exercises (if any) have now been loaded
            $.when.apply($, promises).then(function() {
                loadTestModeSite();
            });
        });

        $.fn.extend({
            // Pick a random element from a set of elements
            getRandom: function() {
                return this.eq(Math.floor(this.length * KhanUtil.random()));
            },

            // Run the methods provided by a module against some elements
            runModules: function(problem, type) {
                type = type || "";

                var info = {
                    localMode: localMode
                };

                this.each(function(i, elem) {
                    elem = $(elem);

                    // Run the main method of any modules
                    $.each(Khan.modules, function(mod) {
                        if ($.fn[mod + type]) {
                            debugLog("running " + mod + type);
                            elem[mod + type](problem, info);
                            debugLog("ran " + mod + type);
                        } else {
                            debugLog("(" + mod + type + " not a fn; src " + mod.src + ")");
                        }
                    });
                });
                return this;
            }
        });

        // See if an element is detached
        $.expr[":"].attached = function(elem) {
            return $.contains(elem.ownerDocument.documentElement, elem);
        };
    }

    // Add up how much total weight is in each exercise so we can adjust for
    // it later
    function weighExercises(problems) {
        if (exercises.length > 1) {
            $.map(problems, function(elem) {
                elem = $(elem);

                var exercise = elem.parents("div.exercise").eq(0);

                var exerciseTotal = exercise.data("weight-sum");
                exerciseTotal = exerciseTotal !== undefined ? exerciseTotal : 0;

                var weight = elem.data("weight");
                weight = weight !== undefined ? weight : 1;

                exercise.data("weight-sum", exerciseTotal + weight);
            });
        }
    }

    // Create a set of n problems fairly from the weights - not random; it
    // ensures that the proportions come out as fairly as possible with ints
    // (still usually a little bit random).
    // There has got to be a better way to do this.
    function makeProblemBag(problems, n) {
        var bag = [], totalWeight = 0;

        if (problems.length > 0) {
            // Collect the weights for the problems and find the total weight
            var weights = $.map(problems, function(elem, i) {
                elem = $(elem);

                var exercise = elem.parents("div.exercise").eq(0);
                var exerciseWeight = exercise.data("weight");
                exerciseWeight = exerciseWeight !== undefined ? exerciseWeight : 1;
                var exerciseTotal = exercise.data("weight-sum");

                var weight = elem.data("weight");
                weight = weight !== undefined ? weight : 1;

                if (exerciseTotal !== undefined) {
                    weight = weight * exerciseWeight / exerciseTotal;
                    elem.data("weight", weight);
                }

                // Also write down the index/id for each problem so we can do
                // links to problems (?problem=17)
                elem.data("id", elem.attr("id") || "" + i);

                totalWeight += weight;
                return weight;
            });

            while (n) {
                bag.push((function() {
                    // Figure out which item we're going to pick
                    var index = totalWeight * KhanUtil.random();

                    for (var i = 0; i < problems.length; i++) {
                        if (index < weights[i] || i === problems.length - 1) {
                            var w = Math.min(weights[i], totalWeight / (n--));
                            weights[i] -= w;
                            totalWeight -= w;
                            return problems.eq(i);
                        } else {
                            index -= weights[i];
                        }
                    }

                    // This will never happen
                    return Khan.error("makeProblemBag got confused w/ index " + index);
                })());
            }
        }

        return bag;
    }

    // TODO(alpert): Merge with loadExercise
    function startLoadingExercise(exerciseId, exerciseName, exerciseFile) {
        var promise = exerciseFilePromises[exerciseId];
        if (promise != null) {
            // Already started (or finished) loading this exercise
            return promise;
        }

        // TODO(alpert): Creating an HTML element here makes no sense to me
        var exerciseElem = $("<div>")
            .data("name", exerciseId)
            .data("displayName", exerciseName)
            .data("fileName", exerciseFile)
            .data("rootName", exerciseId);

        // Queue up an exercise load
        return loadExercise(exerciseElem);
    }

    function loadAndRenderExercise(nextUserExercise) {

        setUserExercise(nextUserExercise);

        var typeOverride = userExercise.problemType,
            seedOverride = userExercise.seed;

        exerciseId = userExercise.exerciseModel.name;
        exerciseName = userExercise.exerciseModel.displayName;
        exerciseFile = userExercise.exerciseModel.fileName;

        function finishRender() {
            // Get all problems of this exercise type...
            // TODO(alpert): What happens if multiple summatives in topic mode
            // have the same subexercises? (Or if the subexercises appear in
            // the topic individually.)
            var problems = exercises.filter(function() {
                return $.data(this, "rootName") === exerciseId;
            }).children(".problems").children();

            // ...and create a new problem bag with problems of our new exercise type.
            problemBag = makeProblemBag(problems, 10);

            // Make scratchpad persistent per-user
            if (user) {
                var lastScratchpad = window.localStorage["scratchpad:" + user];
                if (typeof lastScratchpad !== "undefined" && JSON.parse(lastScratchpad)) {
                    Khan.scratchpad.show();
                }
            }

            $(Exercises).trigger("clearExistingProblem");

            // Generate a new problem
            makeProblem(typeOverride, seedOverride);
        }

        // Use a separate variable here because if exerciseID changes, we still
        // want to log the old one.
        var exid = exerciseId;
        debugLog("loading and rendering " + exid);
        startLoadingExercise(exerciseId, exerciseName, exerciseFile).then(
            function() {
                debugLog("loaded " + exid + ", now rendering");
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

        var cacheKey = "prevProblems:" + user + ":" + exerciseName;
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

            LocalStore.set(cacheKey, {
                lastProblemNum: problemNum,
                history: pastHashes
            });
            return false;
        }
    }


    function checkIfAnswerEmpty(guess) {
        // If multiple-answer, join all responses and check if that's empty
        // Remove commas left by joining nested arrays in case multiple-answer is nested
        return $.trim(guess) === "" || (guess instanceof Array &&
                 $.trim(guess.join("").replace(/,/g, "")) === "");
    }

    function makeProblem(id, seed) {
        debugLog("start of makeProblem");

        // Enable scratchpad (unless the exercise explicitly disables it later)
        Khan.scratchpad.enable();

        // Allow passing in a random seed
        if (typeof seed !== "undefined") {
            problemSeed = seed;

        // If no user, just pick a random seed
        } else if (user == null) {
            problemSeed = Math.abs(randomSeed % bins);
        }

        // Set randomSeed to what problemSeed is (save problemSeed for recall later)
        randomSeed = problemSeed;

        // Check to see if we want to test a specific problem
        if (localMode) {
            id = typeof id !== "undefined" ? id : Khan.query.problem;
        }

        if (typeof id !== "undefined") {
            var problems = exercises.children(".problems").children();

            problem = /^\d+$/.test(id) ?
                // Access a problem by number
                problems.eq(parseFloat(id)) :

                // Or by its ID
                problems.filter("#" + id);

            if (!problem.length) {
                throw new Error("Unknown problem type " + id);
            }

        // Otherwise we grab a problem at random from the bag of problems
        // we made earlier to ensure that every problem gets shown the
        // appropriate number of times
        } else if (problemBag.length > 0) {
            problem = problemBag[problemBagIndex];
            id = problem.data("id");

        // No valid problem was found, bail out
        } else {
            return;
        }

        problemID = id;

        // Find which exercise this problem is from
        exercise = problem.parents("div.exercise").eq(0);

        debugLog("chose problem type and seed for " + exercise.data("name"));

        // Work with a clone to avoid modifying the original
        problem = problem.clone();

        debugLog("cloned problem");

        // problem has to be child of visible #workarea for MathJax metrics to all work right
        $("#workarea").append(problem);

        // If there's an original problem, add inherited elements
        var parentType = problem.data("type");

        while (parentType) {
            // Copy over the parent element to the child
            var original = exercise.find(".problems #" + parentType).clone();
            problem.prepend(original.children().data("inherited", true));

            // Keep copying over the parent elements (allowing for deep inheritance)
            parentType = original.data("type");
        }

        // prepend any motivational text for the growth mindset A/B test
        var growthHeader = (!localMode && !assessmentMode &&
                Exercises.currentCard.attributes.growthHeader);
        $("#workarea").prepend(growthHeader);

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

        // Get the filename of the currently shown exercise, then reset modules
        // to only those required by the current exercise
        var exerciseId = exercise.data("name");
        Khan.resetModules(exerciseId);

        // Run the main method of any modules
        problem.runModules(problem, "Load");
        debugLog("done with runModules Load");
        problem.runModules(problem);
        debugLog("done with runModules");

        if (typeof seed === "undefined" && shouldSkipProblem()) {
            // If this is a duplicate problem we should skip, just generate
            // another problem of the same problem type but w/ a different seed.
            debugLog("duplicate problem!");
            $(Exercises).trigger("clearExistingProblem");
            nextSeed(1);
            return makeProblem();
        }

        // Store the solution to the problem
        var solution = problem.find(".solution"),

            // Get the multiple choice problems
            choices = problem.find(".choices"),

            // Get the area into which solutions will be inserted,
            // Removing any previous answer
            solutionarea = $("#solutionarea").empty(),

            // See if we're looking for a specific style of answer
            answerType = solution.data("type");

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
            // Making the problem failed, let's try again
            debugLog("validator was falsey");
            problem.remove();
            makeProblem(id, randomSeed);
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

        // Show acceptable formats
        if (examples !== null && answerData.examples && answerData.examples.length > 0) {
            $("#examples-show").show();
            examples.empty();

            $.each(answerData.examples, function(i, example) {
                examples.append("<li>" + example + "</li>");
            });

            if ($("#examples-show").data("qtip")) {
                $("#examples-show").qtip("destroy", /* immediate */ true);
            }

            $("#examples-show").qtip({
                content: {
                    text: examples.remove(),
                    prerender: true
                },
                style: {classes: "qtip-light leaf-tooltip"},
                position: {
                    my: "center right",
                    at: "center left"
                },
                show: {
                    delay: 200,
                    effect: {
                        length: 0
                    }
                },
                hide: {delay: 0},
                events: {
                    render: function() {
                        // Only run the modules when the qtip is actually shown
                        examples.children().runModules();
                    }
                }
            });
        } else {
            $("#examples-show").hide();
        }
        // save a normal JS array of hints so we can shift() through them later
        hints = hints.tmpl().children().get();

        // Hook out for exercise test runner
        if (localMode && parent !== window && typeof parent.jQuery !== "undefined") {
            parent.jQuery(parent.document).trigger("problemLoaded", [makeProblem, answerData.solution]);
        }

        $("#hint").val($._("I'd like a hint"));

        $(Exercises).trigger("newProblem", {
            numHints: hints.length,
            userExercise: userExercise,
            answerData: answerData,
            answerType: answerType,
            solution: solution,
            hints: hints,
            problem: problem
        });

        hintsUsed = userExercise ? userExercise.lastCountHints : 0;

        // The server says the user has taken hints on this problem already
        // show all lastCountHints it says we have seen
        _(hintsUsed).times(showHint);

        // If the textbox is empty disable "Check Answer" button
        // Note: We don't do this for multiple choice, number line, etc.
        if (answerType === "text" || answerType === "number") {
            var checkAnswerButton = $("#check-answer-button");
            var skipQuestionButton = $("#skip-question-button");
            checkAnswerButton.attr("disabled", "disabled").attr(
                "title", $._("Type in an answer first."));
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
        $(hint).appendTo("#hintsarea").runModules(problem);

        if (hints.length === 0) {
            $(hint).addClass("last-hint");
        }

        // TODO(james): figure out a way to trigger hintUsed to ensure that the
        // cards are updated properly, but make sure the ajax calls to
        // submit the hints are not resubmited for the case where we are
        // calling this function because last_count_hints was not 0
    }

    function renderDebugInfo() {
        // triggered on newProblem

        if (userExercise == null || Khan.query.debug != null) {
            $("#problem-permalink").text("Permalink: " +
                                         problemID + " #" +
                                         problemSeed)
                .attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + "?debug&problem=" + problemID + "&seed=" + problemSeed);
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
                "?debug&problem=" + problemID;

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
                var historyURL = debugURL + "&seed=" + problemSeed + "&activity=";
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
                var probID = $(prob).attr("id") || n;
                links.append($("<div>")
                    .css({
                        "padding-left": "20px",
                        "outline":
                            (problemID === probID || problemID === "" + n) ?
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
            if (exercise.data("name") !== exerciseId) {
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
            makeProblem();
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
        // Grab example answer format container
        examples = $("#examples");

        assessmentMode = !localMode && Exercises.assessmentMode;

        function initializeCalculator() {
            var calculator = $(".calculator"),
                history = calculator.children(".history"),
                inputRow = history.children(".calc-row.input"),
                input = inputRow.children("input"),
                buttons = calculator.find("a"),
                lastInstr = "",
                ans;

            var evaluate = function() {
                var instr = input.val();
                var row, indiv, output, outstr, outdiv;
                if ($.trim(instr) !== "") {
                    lastInstr = instr;
                    row = $("<div>").addClass("calc-row");
                    indiv = $("<div>").addClass("input").text(instr.replace(/pi/g, "\u03c0")).appendTo(row);
                    try {
                        output = ans = Calculator.calculate(instr, ans);
                        if (typeof output === "number") {
                            outstr = Math.round(output * 1000000000) / 1000000000;
                        } else {
                            outstr = output;
                        }
                    } catch (e) {
                        if (e instanceof Calculator.CalculatorError) {
                            outstr = e.message;
                        } else {
                            throw e;
                        }
                    }
                    outdiv = $("<div>").addClass("output").text(outstr).appendTo(row);
                    inputRow.before(row);
                }

                input.val("");
                history.scrollTop(history[0].scrollHeight);
            };

            // The enter handler needs to bind to keypress to prevent the
            // surrounding form submit... (http://stackoverflow.com/a/587575)
            input.on("keypress", function(e) {
                if (e.which === 13 /* enter */) {
                    evaluate();
                    return false;
                }
            });

            // ...but the arrow-key handler needs to bind to keyup because
            // keypress isn't triggered.
            input.on("keyup", function(e) {
                if (e.which === 38 /* up */) {
                    if (lastInstr !== "") {
                        input.val(lastInstr);
                    }
                    return false;
                }
            });

            buttons.on("click", function() {
                var jel = $(this),
                    behavior = jel.data("behavior");

                if (behavior != null) {
                    if (behavior === "bs") {
                        var val = input.val();
                        input.val(val.slice(0, val.length - 1));
                    } else if (behavior === "clear") {
                        input.val("");
                        history.children().not(inputRow).remove();
                    } else if (behavior === "angle-mode") {
                        // TODO(emily): The DEG/RAD should be i18nized at some
                        // point here
                        Calculator.angleMode = Calculator.angleMode === "DEG" ?
                            "RAD" : "DEG";
                        jel.html((Calculator.angleMode === "DEG" ? "<br>" : "") +
                                 Calculator.angleMode);
                    } else if (behavior === "evaluate") {
                        evaluate();
                    }
                } else {
                    var text = jel.data("text") || jel.text();
                    input.val(input.val() + text);
                }

                input.focus();
                return false;
            });

            $(Exercises).on("gotoNextProblem", function() {
                input.val("");
                history.children().not(inputRow).remove();
            });
        }

        initializeCalculator();
        Khan.initReportIssueLink("#report, #extras .report-issue-link");

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
            .bind("warning", function(ev, data) {
                warn(data.text, data.showClose);
            })
            .bind("upcomingExercise", function(ev, data) {
                var userExercise = data.userExercise;
                startLoadingExercise(
                        userExercise.exercise,
                        userExercise.exerciseModel.displayName,
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
        problemSeed = (seedOffset + jumpNum * (problemNum - 1 + seedsSkipped)) % bins;
        problemBagIndex = (problemNum + problemCount - 1) % problemCount;
    }

    function getSeedsSkippedCacheKey() {
        return "seedsSkipped:" + user + ":" + exerciseName;
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
            exerciseId = data.exercise;
            exerciseName = data.exerciseModel.displayName;
            exerciseFile = data.exerciseModel.fileName;
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
     * @param {Element} exerciseElem HTML element with jQuery data
     * properties name, weight, rootName, and fileName
     */
    function loadExercise(exerciseElem) {
        exerciseElem = $(exerciseElem).detach();
        var id = exerciseElem.data("name");

        var promise = exerciseFilePromises[id];
        if (promise != null) {
            // Already started (or finished) loading this exercise
            return promise;
        } else {
            promise = exerciseFilePromises[id] = $.Deferred();
        }

        var weight = exerciseElem.data("weight");
        var rootName = exerciseElem.data("rootName");
        var fileName = exerciseElem.data("fileName");
        // TODO(eater): remove this once all of the exercises in the datastore
        // have filename properties
        if (fileName == null || fileName === "") {
            fileName = id + ".html";
        }

        // Promises for remote exercises contained within this one
        var subpromises = [];

        debugLog("loadExercise start " + fileName);
        // Packing occurs on the server but at the same "exercises/" URL
        $.get(urlBase + "exercises/" + fileName, function(data, status, xhr) {
            if (!(/success|notmodified/).test(status)) {
                // Maybe loading from a file:// URL?
                debugLog("loadExercise err " + xhr.status + " " + fileName);
                Khan.error("Error loading exercise from file " + fileName +
                        xhr.status + " " + xhr.statusText);
                return;
            }
            debugLog("loadExercise got " + fileName);

            // Get rid of any external scripts in data before we shove data
            // into a jQuery object. IE8 will attempt to fetch these external
            // scripts otherwise.
            // See https://github.com/Khan/khan-exercises/issues/10957
            data = data.replace(/<script(\s)+src=([^<])*<\/script>/, "");

            var newContents = $(data).filter(".exercise");

            // Name of the top-most ancestor exercise
            newContents.data("rootName", rootName);

            // First, remove ones that refer to other files...
            var remoteExercises = newContents.filter("[data-name]");
            newContents = newContents.not("[data-name]");

            // ...then save the exercise ID, fileName and weights for later
            // TODO(david): Make sure weights work for recursively-loaded
            // exercises.
            newContents.data({
                name: id,
                fileName: fileName,
                weight: weight
            });

            // Add the new exercise elements to the exercises DOM set
            exercises = exercises.add(newContents);

            // Maybe the exercise we just loaded loads some others
            remoteExercises.each(function() {
                debugLog("loadExercise sub " + $(this).data("name"));
                subpromises.push(loadExercise(this));
            });

            // Extract data-require
            var match = data.match(
                    /<html(?:[^>]+)data-require=(['"])((?:(?!\1).)*)\1/);
            var requires;
            if (match != null) {
                requires = match[2].length ? match[2].split(" ") : [];
            } else {
                requires = [];
            }

            $.each(requires.concat(Khan.getBaseModules()), function(i, mod) {
                debugLog("loadExercise submod " + (mod.src || mod));
                subpromises.push(loadModule(mod));
            });

            // Store the module requirements in exerciseModulesMap
            Khan.exerciseModulesMap[id] = requires;

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

            // Wait for any subexercises to load, then resolve the promise
            $.when.apply($, subpromises).then(function() {
                // Success; all subexercises loaded
                debugLog("loadExercise finish " + fileName);
                promise.resolve();
            }, function() {
                // Failure; some subexercises failed to load
                // TODO(alpert): Find a useful error message
                debugLog("loadExercise subfail " + fileName);
                promise.reject();
            });
        });

        return promise;
    }

    function loadModule(modNameOrObject) {
        var src, deps = [];

        if (typeof modNameOrObject === "string") {
            src = urlBase + "utils/" + modNameOrObject + ".js";
            deps = Khan.moduleDependencies[modNameOrObject] || [];
        } else {
            src = modNameOrObject.src;
        }

        // Return the promise if it exists already
        var selfPromise = modulePromises[src];
        if (selfPromise) {
            return selfPromise;
        } else {
            selfPromise = $.Deferred();
        }
        debugLog("loadModule mod " + src);

        var depsPromises = [];

        // Load the dependencies
        $.each(deps, function(i, dep) {
            depsPromises.push(loadModule(dep));
        });

        // Load the module once all of the dependencies have been loaded
        $.when.apply($, depsPromises).then(function() {
            Khan.loadScript(src, function() {
                selfPromise.resolve();
            });
        });

        modulePromises[src] = selfPromise;
        return selfPromise;
    }

    function loadTestModeSite() {
        // TODO(alpert): Is the DOM really not yet ready?
        $(function() {
            // Inject the site markup
            if (localMode) {
                $.get(urlBase + "exercises/khan-site.html", function(site) {
                    $.get(urlBase + "exercises/khan-exercise.html",
                        function(ex) {
                            injectTestModeSite(site, ex);
                        });
                });
            }
        });
    }

    function injectTestModeSite(html, htmlExercise) {
        $("body").prepend(html);
        $("#container .exercises-header h2").append(document.title);
        $("#container .exercises-body .current-card-contents").html(
                htmlExercise);

        if (Khan.query.layout === "lite") {
            $("html").addClass("lite");
        }

        $(Exercises).trigger("problemTemplateRendered");

        exercises = exercises.add($("div.exercise").detach());
        var problems = exercises.children(".problems").children();

        // Don't make the problem bag when a specific problem is specified
        // because it messes up problem permalinks (because makeProblemBag
        // calls KhanUtil.random() and changes the seed)
        if (Khan.query.problem == null) {
            weighExercises(problems);
            problemBag = makeProblemBag(problems, 10);
        }

        // Generate the initial problem when dependencies are done being loaded
        makeProblem();
    }

    return Khan;

})();

// Make this publicly accessible
var KhanUtil = Khan.Util;
