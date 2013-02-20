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
    probably want it to go in prepareSite. (which also registers
    server-initiated behavior via api.js) as well. By the time prepareSite is
    called, jQuery and any core plugins are already available.

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
      usually means supplying the correct answer

    * attemptSaved -- when an attempt has been recorded successfully via the
      API

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
    function warn(message, showClose) {
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
        if (crc == window.undefined) {
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

    userExercise = undefined,

    // Check to see if we're in test mode
    testMode = typeof Exercises === "undefined",

    // The main server we're connecting to for saving data
    server = typeof apiServer !== "undefined" ? apiServer :
        testMode ? "http://localhost:8080" : "",

    // The ID, filename, and name of the exercise -- these will only be set here in testMode
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

    // For saving problems to the server
    hintsUsed,
    lastAction,
    attempts,

    // Bug-hunting "undefined" attempt content
    debugLogLog = ["start of log"],
    debugLog = function(l) {
        debugLogLog.push(l);
    },

    guessLog,
    userActivityLog,

    // A map of jQuery queues for serially sending and receiving AJAX requests.
    requestQueue = {},

    // Debug data dump
    dataDump = {
        "exercise": exerciseId,
        "problems": [],
        "issues": 0
    },

    // Dictionary of loading and loaded exercises; keys are exercise IDs,
    // values are promises that are resolved when the exercise is loaded
    exerciseFilePromises = {},

    // A promise for each loaded or loading module, keyed by module filename
    // (module.src) -- will be resolved when the module is loaded (on the live
    // site, immediately)
    modulePromises = {},

    urlBase = typeof urlBaseOverride !== "undefined" ? urlBaseOverride :
        testMode ? "../" : "/khan-exercises/",

    // In test mode, we use khan-exercises local copy of the /images
    // directory.  But in production (on www.khanacademy.org), we use
    // the canonical location of images, which is under '/'.
    imageBase = ((typeof urlBaseOverride !== "undefined" || testMode)
                 ? (urlBase + "images/") : ("/images/"));


    lastFocusedSolutionInput = null,

    issueError = function() {
        return $._("Communication with GitHub isn't working. Please file " +
            "the issue manually at <a href=\"" +
            "http://github.com/Khan/khan-exercises/issues/new\">GitHub</a>. " +
            "Please reference exercise: %s.", exerciseId);
    },
    issueSuccess = function(url, title, suggestion) {
        return $._("Thank you for your feedback! Your issue has been created " +
            "and can be found at the following link: " +
            "<p><a id=\"issue-link\" href=\"%s\">%s</a><p>%s</p>",
            url, title, suggestion);
    },
    issueIntro = function() {
        return $._("Remember to check the hints and double check your " + 
            "math. All provided information will be public. Thanks for " +
            "your help!"),
    },

    gae_bingo = window.gae_bingo || { bingo: function() {} },

    // The ul#examples (keep in a global because we need to modify it even when it's out of the DOM)
    examples = null;

    // Add in the site stylesheets
    if (testMode) {
        (function() {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = urlBase + "css/khan-site.css";
            document.getElementsByTagName("head")[0].appendChild(link);

            link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = urlBase + "css/khan-exercise.css";
            document.getElementsByTagName("head")[0].appendChild(link);
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

        moduleDependencies: {
            "math": [{
                src: urlBase + "utils/MathJax/1.1a/MathJax.js?config=KAthJax-8a6b08f6f5c97d7c3c310cc909a7a140"
            }, "raphael"],

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
            "derivative-intuition": ["jquery.mobile.vmouse"],
            "unit-circle": ["jquery.mobile.vmouse"],
            "interactive": ["jquery.mobile.vmouse"],
            "mean-and-median": ["stat"],
            "math-model": ["ast"],
            "simplify": ["math-model", "ast", "expr-helpers", "expr-normal-form", "steps-helpers"],
            "congruency": ["angles", "interactive"],
            "graphie-3d": ["graphie", "matrix"],
            "graphie-geometry": ["graphie", "matrix"],
            "matrix-input": ["jquery.cursor-position"],
            "chemistry": ["jquery-ui"]
        },

        warnTimeout: function() {
            warn($._("Your internet might be too slow to see an exercise. " + 
                "Refresh the page or <a href='' id='warn-report'>report " +
                "a problem</a>."), false);
            $("#warn-report").click(function(e) {
                e.preventDefault();
                $("#report").click();
            });
        },

        warnFont: function() {
            var enableFontDownload =
                $._("enable font download in your browser");
            if ($.browser.msie) {
                enableFontDownload = $._('<a href="http://missmarcialee.com/2011/08/how-to-enable-font-download-in-internet-explorer-8/" target="_blank">enable font download</a>');
            }

            warn($._("You should %s to improve the appearance of math expressions.", enableFontDownload), true);
        },

        // TODO(alpert): This doesn't need to be in the Khan object.
        getBaseModules: function() {
            var mods = [];
            if (testMode) {
                mods.push("jquery-ui", "../jquery.qtip");
            }

            // Base modules required for every problem
            mods.push(
                    "answer-types", "tmpl", "underscore", "jquery.adhesion",
                    "hints", "calculator", "i18n"
                );

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

            crc32: crc32
        },

        // Load in a collection of scripts, execute callback upon completion
        loadScript: function(url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var isMathJax = url.indexOf("/MathJax/") !== -1;

            if (!testMode && url.indexOf("/khan-exercises/") === 0 &&
                    !isMathJax) {
                // Don't bother loading khan-exercises content in non-local
                // mode; this content is already packaged up and available
                // (*unless* it's MathJax, which is silly and still needs
                // to be loaded)
                callback();
                return;
            }

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
                        MathJax.Hub.Queue(callback);
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
                        $("#scratchpad-show").text("Hide scratchpad");

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
                    $("#scratchpad-show").text("Show scratchpad");
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

        relatedVideos: {
            exercise: null,
            cache: {},

            getVideos: function() {
                return this.cache[this.exercise.name] || [];
            },

            setVideos: function(exercise) {

                if (exercise.relatedVideos) {
                    this.cache[exercise.name] = exercise.relatedVideos;
                }

                this.exercise = exercise;
                this.render();
            },

            showThumbnail: function(index) {
                $("#related-video-list .related-video-list li").each(function(i, el) {
                    if (i === index) {
                        $(el)
                            .find("a.related-video-inline").hide().end()
                            .find(".thumbnail").show();
                    }
                    else {
                        $(el)
                            .find("a.related-video-inline").show().end()
                            .find(".thumbnail").hide();
                    }
                });
            },

            // make a link to a related video, appending exercise ID.
            makeHref: function(video) {
                return video.relativeUrl + "?exid=" + this.exercise.name;
            },

            anchorElement: function(video, needComma) {
                var template = Templates.get("video.related-video-link");
                return $(template({
                    href: this.makeHref(video),
                    video: video,
                    separator: needComma
                })).data("video", video);
            },

            renderInSidebar: function() {
                var container = $(".related-video-box");
                var jel = container.find(".related-video-list");
                jel.empty();

                var template = Templates.get("video.thumbnail");
                _.each(this.getVideos(), function(video, i) {
                    var thumbnailDiv = $(template({
                        href: this.makeHref(video),
                        video: video
                    })).find("a.related-video").data("video", video).end();

                    var inlineLink = this.anchorElement(video)
                        .addClass("related-video-inline");

                    var sideBarLi = $("<li>")
                        .append(inlineLink)
                        .append(thumbnailDiv);

                    if (i > 0) {
                        thumbnailDiv.hide();
                    } else {
                        inlineLink.hide();
                    }
                    jel.append(sideBarLi);
                }, this);

                container.toggle(this.getVideos().length > 0);
            },

            hookup: function() {
                // make caption slide up over the thumbnail on hover
                var captionHeight = 45;
                var marginTop = 23;
                // queue:false to make sure these run simultaneously
                var options = {duration: 150, queue: false};
                $(".related-video-box")
                    .delegate(".thumbnail", "mouseenter mouseleave", function(e) {
                        var el = $(e.currentTarget);
                        if (e.type == "mouseenter") {
                            el.find(".thumbnail_label").animate(
                                    {marginTop: marginTop},
                                    options)
                                .end()
                                .find(".thumbnail_teaser").animate(
                                    {height: captionHeight},
                                    options)
                                .end();
                        } else {
                            el.find(".thumbnail_label").animate(
                                    {marginTop: marginTop + captionHeight},
                                    options)
                                .end()
                                .find(".thumbnail_teaser").animate(
                                    {height: 0},
                                    options)
                                .end();
                        }
                    });
            },

            render: function() {
                // don't try to render if templates aren't present (dev mode)
                if (!window.Templates) return;

                this.renderInSidebar();
            }
        },

        showSolutionButtonText: function() {
            return hintsUsed ?
                $.ngettext("Show next step (%s left)",
                    "Show next step (%s left)", hints.length) :
                $._("Show Solution");
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
    randomSeed = testMode && parseFloat(Khan.query.seed) || userCRC32 ||
            (new Date().getTime() & 0xffffffff);

    // Load in jQuery
    if (window.jQuery) {
        onjQueryLoaded();
    } else {
        Khan.loadScript("../jquery.js", onjQueryLoaded);
    }
        
    function onjQueryLoaded() {
        // If there are any requests left in the queue when the window unloads
        // then we will have permanently lost their answers and will need to
        // clear the session cache, to make sure we don't override what is
        // passed down from the servers
        $(window).unload(function() {
            if(requestQueue["attempt_hint_queue"] &&
                    requestQueue["attempt_hint_queue"].queue().length) {
                $(Khan).trigger("attemptError");
            }
        });

        // Initialize to an empty jQuery set
        exercises = $();

        $(function() {
            var promises = [];

            // Load all base modules, and if this is test mode, any specified
            // in the data-require on <html>
            var mods = Khan.getBaseModules();
            if (testMode) {
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
                    testMode: testMode
                };

                return this.each(function(i, elem) {
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

        if (testMode && Khan.query.test != null) {
            // Just do each problem 10 times
            $.each(problems, function(i, elem) {
                elem = $(elem);
                elem.data("id", elem.attr("id") || "" + i);

                for (var j = 0; j < 10; j++) {
                    bag.push(problems.eq(i));
                }
            });

            problemCount = bag.length;

        } else if (problems.length > 0) {
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

    function enableCheckAnswer() {
        $("#check-answer-button")
            .removeAttr("disabled")
            .removeClass("buttonDisabled")
            .val($._("Check Answer"));
    }

    function disableCheckAnswer() {
        $("#check-answer-button")
            .attr("disabled", "disabled")
            .addClass("buttonDisabled")
            .val($._("Please wait..."));
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

        // TODO(eater): remove this once all of the exercises in the datastore have filename properties
        if (exerciseFile == null || exerciseFile == "") {
            exerciseFile = exerciseId + ".html";
        }

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

            // Update related videos
            Khan.relatedVideos.setVideos(userExercise.exerciseModel);

            // Make scratchpad persistent per-user
            if (user) {
                var lastScratchpad = window.localStorage["scratchpad:" + user];
                if (typeof lastScratchpad !== "undefined" && JSON.parse(lastScratchpad)) {
                    Khan.scratchpad.show();
                }
            }

            // Generate a new problem
            makeProblem(typeOverride, seedOverride);

        }

        startLoadingExercise(exerciseId, exerciseName, exerciseFile).then(
            function() {
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
        return $.trim(guess) === "" ||
                 (guess instanceof Array && $.trim(guess.join("").replace(/,/g, "")) === "");
    }

    function makeProblem(id, seed) {
        debugLog("start of makeProblem");

        // Enable scratchpad (unless the exercise explicitly disables it later)
        Khan.scratchpad.enable();

        // Allow passing in a random seed
        if (typeof seed !== "undefined") {
            problemSeed = seed;

        // In either of these testing situations,
        } else if ((testMode && Khan.query.test != null) || user == null) {
            problemSeed = Math.abs(randomSeed % bins);
        }

        // Set randomSeed to what problemSeed is (save problemSeed for recall later)
        randomSeed = problemSeed;

        // Check to see if we want to test a specific problem
        if (testMode) {
            id = typeof id !== "undefined" ? id : Khan.query.problem;
        }

        if (typeof id !== "undefined") {
            var problems = exercises.children(".problems").children();

            problem = /^\d+$/.test(id) ?
                // Access a problem by number
                problems.eq(parseFloat(id)) :

                // Or by its ID
                problems.filter("#" + id);

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

        debugLog("chose problem type and seed");

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

        // Remove the hint box if there are no hints in the problem
        if (hints.length === 0) {
            $(".hint-box").remove();
        }

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
            var exerciseStyleElem = $("head #exercise-inline-style");

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
            clearExistingProblem();
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
        guessLog = [];
        userActivityLog = [];
        debugLog("decided on answer type " + answerType);
        answerData = Khan.answerTypes[answerType].setup(solutionarea, solution);

        validator = answerData.validator;
        getAnswer = answerData.answer;
        debugLog("validator created");

        // A working solution was generated
        if (validator) {
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
        solution.remove();
        choices.remove();

        // Add the problem into the page
        Khan.scratchpad.resize();

        // Enable the all answer input elements except the check answer button.
        $("#answercontent input").not("#check-answer-button")
            .removeAttr("disabled");

        if (examples !== null && answerData.examples && answerData.examples.length > 0) {
            $("#examples-show").show();
            examples.empty();

            $.each(answerData.examples, function(i, example) {
                examples.append("<li>" + example + "</li>");
            });

            examples.children().tmpl();
        } else {
            $("#examples-show").hide();
        }
        // save a normal JS array of hints so we can shift() through them later
        hints = hints.tmpl().children().get();

        if (hints.length === 0) {
            // Disable the get hint button
            $("#hint").attr("disabled", true);
        }

        // Hook out for exercise test runner
        if (testMode && parent !== window && typeof parent.jQuery !== "undefined") {
            parent.jQuery(parent.document).trigger("problemLoaded", [makeProblem, answerData.solution]);
        }

        // Save problem info in dump data for testers
        if (testMode && Khan.query.test != null) {
            var testerInfo = $("#tester-info");

            // Deep clone the elements to avoid some straaaange bugs
            var lastProblem = $.extend(true, {}, {
                seed: problemSeed,
                type: problemID,
                VARS: $.tmpl.VARS,
                solution: answerData.solution
            });

            dataDump.problems.push(lastProblem);

            $(testerInfo).find(".problem-no")
                .text(dataDump.problems.length + dataDump.issues + " of " + problemCount);

            var answer = $(testerInfo).find(".answer").empty();

            var displayedSolution = answerData.solution;
            if (!$.isArray(displayedSolution)) {
                displayedSolution = [displayedSolution];
            }

            $.each(displayedSolution, function(i, el) {
                if ($.isArray(el)) {
                    // group nested arrays of answers, for sets of multiples or multiples of sets.
                    // no reason answers can't be nested arbitrarily deep, but here we assume no
                    // more than one sub-level.
                    var subAnswer = $("<span>").addClass("group-box").appendTo(answer);
                    $.each(el, function(i, el) {
                        $("<span>").text(el).addClass("box").appendTo(subAnswer);
                    });
                } else {
                    $("<span>").text(el).addClass("box").appendTo(answer);
                }
            });
        }

        if (typeof userExercise !== "undefined" && userExercise.readOnly) {
            if (!userExercise.current) {
                warn($._("This exercise may have changed since it was " +
                    "completed"), true);
            }

            var timelineEvents, timeline;

            var timelinecontainer = $("<div id='timelinecontainer'>")
                .append("<div>\n" +
                        "<div id='previous-problem' class='simple-button'>" + 
                            $._("Previous Problem") + "</div>\n" +
                        "<div id='previous-step' class='simple-button'><span>" + 
                            $._("Previous Step") + "</span></div>\n" +
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
                            position: "absolute",
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
                            $._("Next Problem") + "</div>\n" +
                        "<div id='next-step' class='simple-button'><span>" + 
                            $._("Next Step") + "</span></div>\n" +
                        "</div>");

            $("<div class='user-activity correct-activity'>Started</div>")
                .data("hint", false)
                .appendTo(timelineEvents);

            var hintNumber = 0,
                answerNumber = 1;

            /* value[0]: css class
             * value[1]: guess
             * value[2]: time taken since last guess
             */
            $.each(userExercise.userActivity, function(index, value) {
                var guess = value[1] === "Activity Unavailable" ? value[1] : JSON.parse(value[1]),
                    thissolutionarea;

                timelineEvents
                    .append("<div class='timeline-time'>" +
                        $.ngettext("%ss", "%ss", value[2]) + "</div>");

                thissolutionarea = $("<div>")
                    .addClass("user-activity " + value[0])
                    .appendTo(timelineEvents);

                if (value[0] === "hint-activity") {
                    thissolutionarea.attr("title", $._("Hint used"));
                    thissolutionarea
                        .data("hint", hintNumber)
                        .prepend($.ngettext("Hint #%s", "Hint #%s", hintNumber + 1));
                    hintNumber += 1;
                } else { // This panel is a solution (or the first panel)
                    thissolutionarea.data("hint", false);
                    if (guess === "Activity Unavailable") {
                        thissolutionarea.text($._("Activity Unavailable"));
                    } else {
                        // radio and custom are the only answer types that
                        // can't display its own guesses in the activity bar
                        if (answerType === "radio") {
                            thissolutionarea.append(
                                // Add the guess to the activity bar
                                $("<p class='solution'>" + guess + 
                                    "</p>").tmpl()
                            );

                            if (index === userExercise.userActivity.length - 1) {
                                thissolutionarea
                                    .removeClass("incorrect-activity")
                                    .addClass("correct-activity");

                                thissolutionarea.attr("title",
                                    $._("Correct Answer"));
                            } else {
                                thissolutionarea.attr("title",
                                    $._("Incorrect Answer"));
                            }
                        } else if (answerType === "custom") {
                            if (index === userExercise.userActivity.length - 1) {
                                thissolutionarea
                                    .removeClass("incorrect-activity")
                                    .addClass("correct-activity");

                                thissolutionarea.attr("title",
                                    $._("Correct Answer"));
                                thissolutionarea.append(
                                    $("<p class='solution'>" +
                                        $._("Answer correct") + "</p>")
                                );
                            } else {
                                thissolutionarea.attr("title",
                                    $._("Incorrect Answer"));
                                thissolutionarea.append(
                                    $("<p class='solution'>" +
                                        $._("Answer incorrect") + "</p>")
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

                                thissolutionarea.attr("title",
                                    $._("Correct Answer"));
                            } else {
                                thissolutionarea
                                    .removeClass("correct-activity")
                                    .addClass("incorrect-activity");
                                thissolutionarea.attr("title",
                                    $._("Incorrect Answer"));
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
                firstHintIndex = timeline.find(".hint-activity:first")
                    .index(".user-activity"),
                lastHintIndex = timeline.find(".hint-activity:last")
                    .index(".user-activity"),
                totalHints = timeline.find(".hint-activity:last")
                    .index(".hint-activity"),
                hintButton = $("#hint"),
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
                        $(this).text($._('Answer'));
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

                    if (thisSlide.data("guess") !== undefined && $.isFunction(answerData.showCustomGuess)) {
                        KhanUtil.currentGraph = $(realWorkArea).find(".graphie").data("graphie");
                        answerData.showCustomGuess(thisSlide.data("guess"));
                        MathJax.Hub.Queue(recordState);
                    } else {
                        recordState();
                    }

                });
            };

            var activate = function(slideNum) {
                var hint, thisState,
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
            $(states).click(function(event) {
                var index = $(this).index("#timeline .user-activity");

                currentSlide = index;
                activate(currentSlide);

                return false;
            });

            $("#previous-step").click(function(event) {
                if (currentSlide > 0) {
                    currentSlide -= 1;
                    activate(currentSlide);
                }

                return false;
            });

            $("#next-step").click(function(event) {
                if (currentSlide < numSlides - 1) {
                    currentSlide += 1;
                    activate(currentSlide);
                }

                return false;
            });

            $("#next-problem").click(function(event) {
                window.location.href = userExercise.nextProblemUrl;
            });

            $("#previous-problem").click(function(event) {
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
        }


        if (userExercise == null || Khan.query.debug != null) {
            $("#problem-permalink")
                .text($._("Permalink: %s #%s", problemID, problemSeed))
                .attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + "?debug&problem=" + problemID + "&seed=" + problemSeed);
        }

        // Show the debug info
        if (testMode && Khan.query.debug != null) {
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
                $("<a>" + $._("Problem history") + "</a>").attr("href", "javascript:").click(function(event) {
                    window.location.href = historyURL + encodeURIComponent(JSON.stringify(userActivityLog));
                }).appendTo(links);
            } else {
                $("<a>" + $._("Random problem") + "</a>")
                    .attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + "?debug")
                    .appendTo(links);
            }

            links.append("<br><b>" + $._("Problem types:") + "</b><br>");

            exercises.children(".problems").children().each(function(n, prob) {
                var probID = $(prob).attr("id") || n;
                links.append($("<div>")
                    .css({
                        "padding-left": "20px",
                        "outline":
                            (problemID === probID || problemID === '' + n) ?
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
                links.append($._("Original exercise: %s", 
                    exercise.data("name")));
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

        hintsUsed = 0;
        attempts = 0;
        lastAction = (new Date).getTime();

        $("#hint").val("I'd like a hint");

        $(Khan).trigger("newProblem");

        // If the textbox is empty disable "Check Answer" button
        // Note: We don't do this for multiple choice, number line, etc.
        if (answerType === "text" || answerType === "number") {
            var checkAnswerButton = $("#check-answer-button");
            checkAnswerButton.attr("disabled", "disabled").attr(
                "title", $._("Type in an answer first."));
            // Enables the check answer button - added so that people who type
            // in a number and hit enter quickly do not have to wait for the
            // button to be enabled by the key up
            $("#solutionarea")
                .on("keypress.emptyAnswer", function(e) {
                    if (e.keyCode !== 13) {
                        checkAnswerButton
                            .removeAttr("disabled").removeAttr("title");
                    }
                })
                .on("keyup.emptyAnswer", function() {
                    var guess = getAnswer();
                    if (checkIfAnswerEmpty(guess)) {
                        checkAnswerButton.attr("disabled", "disabled");
                    } else {
                        checkAnswerButton.removeAttr("disabled");
                    }
                });
        }

        return answerType;
    }

    function clearExistingProblem() {
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
        $("#workarea, #hintsarea").runModules(problem, "Cleanup").empty();
        $("#hint").attr("disabled", false);

        // Take off the event handlers for disabling check answer; we'll rebind
        // if we actually want them
        $("#solutionarea").off(".emptyAnswer");

        Khan.scratchpad.clear();
    }

    function renderNextProblem(nextUserExercise) {
        clearExistingProblem();

        if (testMode && Khan.query.test != null && dataDump.problems.length + dataDump.issues >= problemCount) {
            // Show the dump data
            $("#problemarea").append(
                $._("<p>Thanks! You're all done testing this exercise.</p>" +
                    "<p>Please copy the text below and send it to us.</p>")
            );

            $("<textarea>")
                .val("Khan.testExercise(" + JSON.stringify(dataDump) + ");")
                .css({width: "60%", height: "200px"})
                .prop("readonly", true)
                .click(function() {
                    this.focus();
                    this.select();
                })
                .appendTo("#problemarea");

            $("#sidebar").hide();

        } else {

            if (testMode) {
                // Just generate a new problem from existing exercise
                makeProblem();
            } else {
                loadAndRenderExercise(nextUserExercise);
            }

        }
    }

    function prepareSite() {
        // TODO(david): Don't add homepage elements with "exercise" class
        exercises = exercises.add($("div.exercise").detach());

        // Setup appropriate img URLs
        $("#issue-throbber")
            .attr("src", urlBase + "css/images/throbber.gif");

        // Change form target to the current page so errors do not kick us
        // to the dashboard
        $("#answerform").attr("action", window.location.href);

        // Watch for a solution submission
        $("#check-answer-button").click(handleSubmit);
        $("#answerform").submit(handleSubmit);

        // Grab example answer format container
        examples = $("#examples");

        // Build the data to pass to the server
        function buildAttemptData(pass, attemptNum, attemptContent, curTime) {
            var timeTaken = Math.round((curTime - lastAction) / 1000);

            if (attemptContent !== "hint") {
                userActivityLog.push([pass ? "correct-activity" : "incorrect-activity", attemptContent, timeTaken]);
            } else {
                userActivityLog.push(["hint-activity", "0", timeTaken]);
            }

            return {
                // The user answered correctly
                complete: pass === true ? 1 : 0,

                // The user used a hint
                count_hints: hintsUsed,

                // How long it took them to complete the problem
                time_taken: timeTaken,

                // How many times the problem was attempted
                attempt_number: attemptNum,

                // The answer the user gave
                // TODO: Get the real provided answer
                attempt_content: attemptContent,

                // A hash representing the exercise
                // TODO: Populate this from somewhere
                sha1: typeof userExercise !== "undefined" ? userExercise.exerciseModel.sha1 : exerciseId,

                // The seed that was used for generating the problem
                seed: problemSeed,

                // The seed that was used for generating the problem
                problem_type: problemID,

                // Whether we're currently in review mode
                review_mode: (!testMode && Exercises.reviewMode) ? 1 : 0,

                // Whether we are currently working on a topic, as opposed to an exercise
                topic_mode: (!testMode && !Exercises.reviewMode && !Exercises.practiceMode) ? 1 : 0,

                // Request camelCasing in returned response
                casing: "camel",

                // The current card data
                card: !testMode && JSON.stringify(Exercises.currentCard),

                // Unique ID of the cached stack
                stack_uid: !testMode && Exercises.completeStack.getUid(),

                // The current topic, if any
                topic_id: !testMode && Exercises.topic && Exercises.topic.id,

                // How many cards the user has already done
                cards_done: !testMode && Exercises.completeStack.length,

                // How many cards the user has left to do
                cards_left: !testMode && (Exercises.incompleteStack.length - 1),

                //Get Custom Stack Id if it exists
                custom_stack_id: !testMode && Exercises.completeStack.getCustomStackID()
            };
        }

        function handleSubmit() {
            var guess = getAnswer();
            var pass = validator(guess);

            // Stop if the user didn't enter a response
            // If multiple-answer, join all responses and check if that's empty
            // Remove commas left by joining nested arrays in case multiple-answer is nested

            if (checkIfAnswerEmpty(guess) || checkIfAnswerEmpty(pass)) {
                return false;
            } else {
                guessLog.push(guess);
            }

            // Stop if the form is already disabled and we're waiting for a response.
            if ($("#answercontent input").not("#hint,#next-question-button").is(":disabled")) {
                return false;
            }

            $("#answercontent input").not("#check-answer-button, #hint")
                .attr("disabled", "disabled");
            $("#check-answer-results p").hide();

            var checkAnswerButton = $("#check-answer-button");

            // If incorrect, warn the user and help them in any way we can
            if (pass !== true) {
                checkAnswerButton
                    .effect("shake", {times: 3, distance: 5}, 80)
                    .val("Try Again");

                // Is this a message to be shown?
                if (typeof pass === "string") {
                    $("#check-answer-results .check-answer-message").html(pass).tmpl().show();
                }

                // Refocus text field so user can type a new answer
                if (lastFocusedSolutionInput != null) {
                    setTimeout(function() {
                        var focusInput = $(lastFocusedSolutionInput);

                        if (!focusInput.is(":disabled")) {
                            // focus should always work; hopefully select will work for text fields
                            focusInput.focus();
                            if (focusInput.is("input:text")) {
                                focusInput.select();
                            }
                        }
                    }, 1);
                }
            }

            if (pass === true) {
                // Problem has been completed but pending data request being
                // sent to server.
                $(Khan).trigger("problemDone");
            }

            // Save the problem results to the server
            var curTime = new Date().getTime();
            var data = buildAttemptData(pass, ++attempts, JSON.stringify(guess), curTime);
            debugLog("attempt " + JSON.stringify(data));

            request("problems/" + problemNum + "/attempt", data, function() {

                // TODO: Save locally if offline
                $(Khan).trigger("attemptSaved");

            }, function(xhr) {
                // Alert any listeners of the error before reload
                $(Khan).trigger("attemptError");

                if (xhr && xhr.readyState == 0) {
                    // This path gets called when there is a broken pipe during
                    // page unload- browser navigating away during ajax request
                    // See http://stackoverflow.com/questions/1370322/jquery-ajax-fires-error-callback-on-window-unload
                    return;
                }

                // Error during submit. Disable the page and ask users to
                // reload in an attempt to get updated data.

                // Hide the page so users don't continue
                $("#problem-and-answer").css("visibility", "hidden");

                // Warn user about problem, encourage to reload page
                warn(
                    $._("This page is out of date. You need to " +
                        "<a href='%s'>refresh</a>, but don't worry, you " + 
                        "haven't lost progress. If you think this is a " + 
                        "mistake, <a href='%s'>tell us</a>.", 
                            window.location.href,
                            "http://www.khanacademy.org/reportissue" + 
                                "?type=Defect&issue_labels=")
                );

            }, "attempt_hint_queue");

            if (pass === true) {
                // Correct answer, so show the next question button.
                $("#check-answer-button").hide();
                if (!testMode || Khan.query.test == null) {
                    $("#next-question-button")
                        .removeAttr("disabled")
                        .removeClass("buttonDisabled")
                        .show()
                        .focus();
                    $("#positive-reinforcement").show();
                }
            } else {
                // Wrong answer. Enable all the input elements
                $("#answercontent input").not("#hint")
                    .removeAttr("disabled");
            }

            // Remember when the last action was
            lastAction = curTime;

            $(Khan).trigger("checkAnswer", {
                pass: pass,
                // Determine if this attempt qualifies as fast completion
                fast: (typeof userExercise !== "undefined" && userExercise.secondsPerFastProblem >= data.time_taken)
            });

            return false;
        }

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
                    indiv = $("<div>").addClass("input").text(instr).appendTo(row);
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
                input[0].scrollIntoView(false);
            };

            input.on("keyup", function(e) {
                if (e.which === 13) {
                    evaluate();
                    return false;
                } else if (e.which === 38) {
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
                        Calculator.angleMode = Calculator.angleMode === "DEG" ?
                            "RAD" : "DEG";
                        // TODO(jeresig): i18n This renders DEG/RAD, should this
                        // be translated? and how?
                        jel.html((Calculator.angleMode === "DEG" ? "<br>" : "")
                            + Calculator.angleMode);
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

            $(Khan).on("gotoNextProblem", function(event) {
                input.val("");
                history.children().not(inputRow).remove();
            });
        };

        initializeCalculator();

        // Watch for when the next button is clicked
        $("#next-question-button").click(function(ev) {
            nextProblem(1);
            $(Khan).trigger("gotoNextProblem");

            // Disable next question button until next time
            $(this)
                .attr("disabled", true)
                .addClass("buttonDisabled");
        });

        // If happy face is clicked, pass click on through.
        $("#positive-reinforcement").click(function() {
            $("#next-question-button").click();
        });

        // Watch for when the "Get a Hint" button is clicked
        $("#hint").click(function() {

            var hint = hints.shift();

            if (hint) {
                $(Khan).trigger("hintUsed");

                hintsUsed += 1;

                var stepsLeft = $.ngettext("%s step left", "%s steps left", 
                    hints.length);
                $(this).val($(this).data("buttonText") ||
                    $.ngettext("I'd like another hint (%s)",
                        "I'd like another hint (%s)", stepsLeft));

                var problem = $(hint).parent();

                // Append first so MathJax can sense the surrounding CSS context properly
                $(hint).appendTo("#hintsarea").runModules(problem);

                // Grow the scratchpad to cover the new hint
                Khan.scratchpad.resize();

                // Disable the get hint button & add final_answer class
                if (hints.length === 0) {
                    $(hint).addClass("final_answer");

                    $(Khan).trigger("allHintsUsed");

                    $(this).attr("disabled", true);
                }
            }

            var fProdReadOnly = !testMode && userExercise.readOnly;
            var fAnsweredCorrectly = $("#next-question-button").is(":visible");
            if (!fProdReadOnly && !fAnsweredCorrectly) {
                // Resets the streak and logs history for exercise viewer
                request(
                    "problems/" + problemNum + "/hint",
                    buildAttemptData(false, attempts, "hint", new Date().getTime()),
                    // Don't do anything on success or failure, silently failing is ok here
                    function() {},
                    function() {},
                    "attempt_hint_queue"
                );
            }

        });

        // On an exercise page, replace the "Report a Problem" link with a button
        // to be more clear that it won't replace the current page.
        $("<a>" + $._("Report a Problem") + "</a>")
            .attr("id", "report").addClass("simple-button green")
            .replaceAll($(".footer-links #report"));

        $("#report").click(function(e) {

            e.preventDefault();

            var report = $("#issue").css("display") !== "none",
                form = $("#issue form").css("display") !== "none";

            if (report && form) {
                $("#issue").hide();
            } else if (!report || !form) {
                $("#issue-status").removeClass("error").html(issueIntro());
                $("#issue, #issue form").show();
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
        $("#issue form input:submit").click(function(e) {

            e.preventDefault();

            // don't do anything if the user clicked a second time quickly
            if ($("#issue form").css("display") === "none") return;

            var pretitle = exerciseName,
                type = $("input[name=issue-type]:checked").prop("id"),
                title = $("#issue-title").val(),
                path = exerciseFile + "?seed=" +
                    problemSeed + "&problem=" + problemID,
                pathlink = "[" + path + (exercise.data("name") !== exerciseId ? " (" + exercise.data("name") + ")" : "") + "](http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug)",
                historyLink = "[Answer timeline](" + "http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug&activity=" + encodeURIComponent(JSON.stringify(userActivityLog)).replace(/\)/g, "\\)") + ")",
                agent = navigator.userAgent,
                mathjaxInfo = "MathJax is " + (typeof MathJax === "undefined" ? "NOT loaded" :
                    ("loaded, " + (MathJax.isReady ? "" : "NOT ") + "ready, queue length: " + MathJax.Hub.queue.queue.length)),
                userHash = "User hash: " + crc32(user),
                sessionStorageInfo = (typeof sessionStorage === "undefined" || typeof sessionStorage.getItem === "undefined" ? "sessionStorage NOT enabled" : null),
                warningInfo = $("#warning-bar-content").text(),
                parts = [$("#issue-body").val() || null, pathlink, historyLink, "    " + JSON.stringify(guessLog), agent, sessionStorageInfo, mathjaxInfo, userHash, warningInfo, debugLogLog.join("\n")],
                body = $.grep(parts, function(e) { return e != null; }).join("\n\n");

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
                    ipad: agent_contains("iPad")
                },
                labels = [];
            $.each(flags, function(k, v) {
                if (v) labels.push(k);
            });

            if (!type) {
                $("#issue-status").addClass("error")
                    .html($._("Please specify the issue type.")).show();
                return;
            } else {
                labels.push(type.slice("issue-".length));

                var hintOrVideoMsg = $._("Please click the hint button above " + 
                    "to see our solution, or watch a video for " +
                    "additional help.");
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
                    .html($._("Please provide a valid title " +
                    "for the issue.")).show();
                return;
            }

            var formElements = $("#issue input").add("#issue textarea");

            // disable the form elements while waiting for a server response
            formElements.attr("disabled", true);

            $("#issue-cancel").hide();
            $("#issue-throbber").show();

            var dataObj = {
                title: pretitle + " - " + title,
                body: body,
                labels: labels
            };

            // we try to post ot github without a cross-domain request, but if we're
            // just running the exercises locally, then we can't help it and need
            // to fall back to jsonp.
            $.ajax({

                url: (testMode ? "http://www.khanacademy.org/" : "/") + "githubpost",
                type: testMode ? "GET" : "POST",
                data: testMode ? {json: JSON.stringify(dataObj)} :
                    JSON.stringify(dataObj),
                contentType: testMode ? "application/x-www-form-urlencoded" : "application/json",
                dataType: testMode ? "jsonp" : "json",
                success: function(json) {

                    var data = json.data || json;

                    // hide the form
                    $("#issue form").hide();

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
                // note this won't actually work in local jsonp-mode
                error: function(json) {

                    // show status message
                    $("#issue-status").addClass("error")
                        .html(issueError()).show();

                    // enable the inputs
                    formElements.attr("disabled", false);

                    // replace throbber with the cancel button
                    $("#issue-cancel").show();
                    $("#issue-throbber").hide();

                }
            });
        });

        $("#warning-bar-close a").click(function(e) {
            e.preventDefault();
            $("#warning-bar").fadeOut("slow");
        });

        $("#scratchpad-show")
            .click(function(e) {
                e.preventDefault();
                Khan.scratchpad.toggle();

                if (user) {
                    window.localStorage["scratchpad:" + user] = Khan.scratchpad.isVisible();
                }
            });

        $("#answer_area").delegate("input.button, select", "keydown", function(e) {
            // Don't want to go back to exercise dashboard; just do nothing on backspace
            if (e.keyCode === 8) {
                return false;
            }
        });

        // Prepare for the tester info if requested
        if (testMode && Khan.query.test != null) {
            $("#answer_area").prepend(
                '<div id="tester-info" class="info-box">' +
                    '<span class="info-box-header">' + $._('Testing Mode') + 
                    '</span><p><strong>' + $._('Problem No.') +
                    '</strong> <span class="problem-no"></span></p>' +
                    '<p><strong>' + $._('Answer:') +
                    '</strong> <span class="answer"></span></p><p>' +
                        '<input type="button" class="pass simple-button green" value="' +
                        $._('This problem was generated correctly.') + '">' +
                        '<input type="button" class="fail simple-button orange" value="' +
                        $._('There is an error in this problem.') + '">' +
                    "</p>" +
                "</div>"
            );

            $("#tester-info .pass").click(function() {
                dataDump.problems[dataDump.problems.length - 1].pass = true;
                nextProblem(1);
                $("#next-question-button").trigger("click");
            });

            $("#tester-info .fail").click(function() {
                var description = prompt(
                    $._("Please provide a short description of the error"));

                // Don't do anything on clicking Cancel
                if (description == null) return;

                // we discard the info recorded and record an issue on github instead
                // of testing against the faulty problem's data dump.
                var dump = dataDump.problems.pop(),
                    prettyDump = "```js\n" + JSON.stringify(dump) + "\n```",
                    fileName = window.location.pathname.replace(/^.+\//, ""),
                    path = fileName + "?problem=" + problemID +
                        "&seed=" + problemSeed;

                var title = encodeURIComponent("Issue Found in Testing - " + $("title").html()),
                    body = encodeURIComponent([description, path, prettyDump, navigator.userAgent].join("\n\n")),
                    label = encodeURIComponent("tester bugs");

                var err = function(problems, dump, desc) {
                    problems.push(dump);
                    problems[problems.length - 1].pass = desc;
                };

                var comment = function(id) {
                    // If communication fails with the Sinatra app or Github and a
                    // comment isn't created, then we create a test that will always
                    // fail.
                    $.ajax({
                        url: "http://66.220.0.98:2563/file_exercise_tester_bug_comment?id=" + id + "&body=" + body,
                        dataType: "jsonp",
                        success: function(json) {
                            if (json.meta.status !== 201) {
                                err(dataDump.problems, dump, description);
                            } else {
                                dataDump.issues += 1;
                            }
                        },
                        error: function(json) {
                            err(dataDump.problems, dump, description);
                        }
                    });
                };

                var newIssue = function() {
                    // if communication fails with the Sinatra app or Github and an
                    // issue isn't created, then we create a test that will always
                    // fail.
                    $.ajax({
                        url: "http://66.220.0.98:2563/file_exercise_tester_bug?title=" + title + "&body=" + body + "&label=" + label,
                        dataType: "jsonp",
                        success: function(json) {
                            if (json.meta.status !== 201) {
                                err(dataDump.problems, dump, description);
                            } else {
                                dataDump.issues += 1;
                            }
                        },
                        error: function(json) {
                            err(dataDump.problems, dump, description);
                        }
                    });
                };

                $.ajax({
                    url: "https://api.github.com/repos/Khan/khan-exercises/issues?labels=tester%20bugs",
                    dataType: "jsonp",
                    error: function(json) {
                        err(dataDump.problems, dump, description);
                    },
                    success: function(json) {
                        var copy = false;

                        // see if an automatically generated issue for this file
                        // already exists
                        $.each(json.data, function(i, issue) {
                            if (encodeURIComponent(issue.title) === title) {
                                copy = issue.number;
                            }
                        });

                        if (copy) {
                            comment(copy);
                        } else {
                            newIssue();
                        }
                    }
                });

                $("#next-question-button").trigger("click");
            });

            $(document).keyup(function(e) {
                if (e.keyCode === "H".charCodeAt(0)) {
                    $("#hint").click();
                }
                if (e.keyCode === "Y".charCodeAt(0)) {
                    $("#tester-info .pass").click();
                }
                if (e.keyCode === "N".charCodeAt(0)) {
                    $("#tester-info .fail").click();
                }
            });
        }

        // Prepare for the debug info if requested
        if (testMode && Khan.query.debug != null) {
            $('<div id="debug"></div>').appendTo("#answer_area");
        }

        // Register API ajax callbacks for updating UI
        if (typeof APIActionResults !== "undefined") {
            // Display Messages like "You're Proficient" or "You Seem To Be Struggling"
            // TODO: this functionality is currently hidden from power-mode. Restore it.
            // https://trello.com/card/restore-you-re-ready-to-move-on-and-struggling-in-action-messages/4f3f43cd45533a1b3a065a1d/34
            APIActionResults.register("exercise_state",
                function(userState) {
                    var jel = $("#exercise-message-container");
                    if (userState.template !== null) {
                        jel.empty().append(userState.template);
                        setTimeout(function() {jel.slideDown();}, 50);
                    }
                    else {
                        jel.slideUp();
                    }
                }
            );
        }

        $(Khan)
            .bind("updateUserExercise", function(ev, data) {
                // Any time we update userExercise, check if we're setting/switching usernames
                if (data) {
                    user = data.user || user;
                    userCRC32 = user != null ? crc32(user) : null;
                    randomSeed = userCRC32 || randomSeed;
                }
            });

        // Register testMode-specific event handlers
        if (testMode) {

            // testMode automatically advances to the next problem --
            // integrated mode just listens and waits for renderNextProblem
            $(Khan).bind("gotoNextProblem", function() {
                renderNextProblem();
            });

        }

        Khan.relatedVideos.hookup();

        if (window.ModalVideo) {
            ModalVideo.hookup();
        }
    }

    if (!testMode) {
        // In local mode, everything is set up in loadTestModeSite after
        // loading jQuery. The real mode already has jQuery, so we just listen
        // for the signal to prepare.
        $(Exercises)
            .bind("problemTemplateRendered", prepareSite)
            .bind("readyForNextProblem", function(ev, data) {
                renderNextProblem(data.userExercise);
            })
            .bind("warning", function(ev, data) {
                warn(data.text, data.showClose);
            })
            .bind("upcomingExercise", function(ev, data) {
                startLoadingExercise(data.exerciseId, data.exerciseName, data.exerciseFile);
            });
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

    function prevProblem(num) {
        nextProblem(-num);
    }

    function setUserExercise(data) {

        userExercise = data;

        if (data && data.exercise) {
            exerciseId = data.exercise;
        }

        $(Khan).trigger("updateUserExercise", userExercise);

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

    function request(method, data, fn, fnError, queue) {
        if (testMode) {
            // Pretend we have success
            if ($.isFunction(fn)) {
                fn();
            }

            return;
        }

        var xhrFields = {};
        if (typeof XMLHTTPRequest !== "undefined") {
            // If we have native XMLHTTPRequest support,
            // make sure cookies are passed along.
            xhrFields["withCredentials"] = true;
        }

        var request = {
            // Do a request to the server API
            url: server + "/api/v1/user/exercises/" + exerciseId + "/" + method,
            type: "POST",
            data: data,
            dataType: "json",
            xhrFields: xhrFields,

            // Backup the response locally, for later use
            success: function(data) {

                // Tell any listeners that khan-exercises has new
                // userExercise data
                $(Khan).trigger("updateUserExercise", data);

                if ($.isFunction(fn)) {
                    fn(data);
                }
            },

            complete: function() {
                $(Khan).trigger("apiRequestEnded");
            },

            // Handle error edge case
            error: function(xhr) {
                // Execute passed error function first in case it wants
                // different behavior depending upon the length of the request
                // queue
                if ($.isFunction(fnError)) {
                    fnError(xhr);
                }

                // Clear the queue so we don't spit out a bunch of
                // queued up requests after the error
                if (queue && requestQueue[queue]) {
                    requestQueue[queue].clearQueue();
                }
            }
        };

        // Send request and return a jqXHR (which implements the Promise interface)
        function sendRequest() {
            // Do request using OAuth, if available
            if (typeof oauth !== "undefined" && $.oauth) {
                return $.oauth($.extend({}, oauth, request));
            }

            return $.ajax(request);
        }

        // We may want to queue up the requests so that they're sent serially.
        //
        // We currently do this for problem attempts and hints to avoid a race
        // condition:
        // 1) request A fetches UserExercise X
        // 2) request B also fetches X
        // 3) A finishes updating X and saves as A(X)
        // 4) now B finishes updating X and overwrites A(X) with B(X)
        // ...when what we actually wanted saved is B(A(X)). We should really fix it
        // on the server by running the hint and attempt requests in transactions.
        if (queue != null) {
            // Create an empty jQuery object to use as a queue holder, if needed.
            requestQueue[queue] = requestQueue[queue] || jQuery({});

            // Queue up sending the request to run when old requests have completed.
            requestQueue[queue].queue(function(next) {
                sendRequest().always(next);
            });
        } else {
            sendRequest();
        }

        // Trigger an apiRequestStarted event here, and not in the inner sendRequest()
        // function, because listeners should know an API request is waiting as
        // soon as it gets queued up.
        $(Khan).trigger("apiRequestStarted");
    }

    /**
     * Load an exercise and return a promise that is resolved when an exercise
     * is loaded
     *
     * @param exerciseElem HTML element with jQuery data properties name,
     * weight, rootName, and fileName
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
        if (fileName == null || fileName == "") {
            fileName = id + ".html";
        }

        // Promises for remote exercises contained within this one
        var subpromises = [];

        // Packing occurs on the server but at the same "exercises/" URL
        $.get(urlBase + "exercises/" + fileName, function(data, status, xhr) {
            if (!(/success|notmodified/).test(status)) {
                // Maybe loading from a file:// URL?
                Khan.error("Error loading exercise from file " + fileName +
                        xhr.status + " " + xhr.statusText);
                return;
            }

            // Get rid of any external scripts in data before we shove data
            // into a jQuery object. IE8 will attempt to fetch these external
            // scripts otherwise.
            // See https://github.com/Khan/khan-exercises/issues/10957
            data = data.replace(/<script(\s)+src=([^<])*<\/script>/, "");

            var newContents = $(data);

            // Name of the top-most ancestor exercise
            newContents.data("rootName", rootName);

            // Throw out divs that just load other exercises
            newContents = newContents.not("[data-name]");

            // Save the exercise ID, fileName and weights for later
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
            newContents.filter("[data-name]").each(function() {
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

            $.each(requires, function(i, mod) {
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
                promise.resolve();
            }, function() {
                // Failure; some subexercises failed to load
                // TODO(alpert): Find a useful error message
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

        var promises = [];

        // Load module dependencies
        promises.push(selfPromise);
        Khan.loadScript(src, function() {
            selfPromise.resolve();
        });

        $.each(deps, function(i, dep) {
            promises.push(loadModule(dep));
        });

        // Return a multi-promise thing
        var allLoaded = $.when.apply($, promises);
        modulePromises[src] = allLoaded;
        return allLoaded;
    }

    function loadTestModeSite() {
        // TODO(alpert): Is the DOM really not yet ready?
        $(function() {
            // Inject the site markup
            if (testMode) {
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

        prepareSite();

        var problems = exercises.children(".problems").children();

        // Don't make the problem bag when a specific problem is specified
        // because it messes up problem permalinks (because makeProblemBag
        // calls KhanUtil.random() and changes the seed)
        if (Khan.query.problem == null) {
            weighExercises(problems);
            problemBag = makeProblemBag(problems, 10);
        }

        $("#positive-reinforcement").hide();
        // Generate the initial problem when dependencies are done being loaded
        var answerType = makeProblem();
    }

    return Khan;

})();

// Make this publicly accessible
var KhanUtil = Khan.Util;
