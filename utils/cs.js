(function() {
    var bindCSCleanup = function() {
        if (bindCSCleanup.bound) {
            return;
        }

        var cleanup = function() {
            $(".current-card")
                .removeClass("cs-exercise")
                .find(".restart-box")
                    .remove();

            $("#tutorial-page").removeClass("wide");
        };

        $(Khan).bind("cleanupProblem", cleanup);

        if (typeof Exercises !== "undefined") {
            $(Exercises).bind("endOfStack", cleanup);
        }

        bindCSCleanup.bound = true;
    };

    Khan.answerTypes = $.extend(Khan.answerTypes || {}, {
        cs: {
            setup: function(solutionarea, solution) {
                Khan.scratchpad.disable();

                // Make sure the tutorial page can fit the full exercise
                $("#tutorial-page").addClass("wide");

                // Remove exercise styling upon completion
                bindCSCleanup();

                $(solutionarea).append("<div class='instruction'>Write the code to complete the exercise.</div>");

                solution = typeof solution === "object" ?
                    $(solution).text() :
                    solution;

                var $curCard = $(".current-card").addClass("cs-exercise");

                if (!$curCard.find(".restart-box").length) {
                    $("<div class='info-box restart-box'>" +
                        "<input type='button' class='simple-button' " +
                        "value='Restart'/></div>")
                        .click(function() {
                            embed.restart();
                        })
                        .appendTo("#answerform");
                }

                var passing = false;
                var guess = "";
                var $problem = $(".problem");
                var origCode;
                var embed;

                if (!$problem.find("iframe").length) {
                    origCode = $problem.text();

                    embed = new ScratchpadEmbed({
                        origCode: origCode,
                        buttons: false,
                        author: false,
                        blank: true,
                        background: KhanUtil.BACKGROUND,
                        code: origCode,
                        validate: solution,
                        onrun: function(data) {
                            if (!data.results) {
                                return;
                            }

                            guess = data.results.code;

                            if (data.results.errors.length > 0) {
                                passing = false;

                            } else {
                                passing = true;

                                var tests = data.results.tests;
                                for (var i = 0, l = tests.length; i < l; i++) {
                                    if (tests[i].state !== "pass") {
                                        passing = false;
                                    }
                                }
                            }
                        }
                    });

                    var iframe = embed.getIframe();
                    $(iframe).data("embed", embed);
                    $problem.html(iframe);

                } else {
                    embed = $problem.find("iframe").data("embed");
                    origCode = embed.props.origCode;
                }

                return {
                    answer: function() {
                        return guess;
                    },
                    validator: function() {
                        return passing;
                    },
                    solution: solution,
                    examples: [],
                    showGuess: function(guess) {
                        if (guess === undefined) {
                            guess = origCode;
                        }

                        embed.setOptions({ code: guess });
                    }
                };
            }
        },

        // Shows a code editor (with no output)
        // If a solution is provided, passes if the content matches the solution
        // If no solution, passes if the code passes without errors
        csPass: {
            setup: function(solutionarea, solution) {
                Khan.scratchpad.disable();

                $(solutionarea).append("<div class='instruction'>Change the code in the editor until it is correct.</div>");

                solution = typeof solution === "object" ?
                    $(solution).text() :
                    solution;
                solution = solution.replace(/\s+/g, "");

                var passing = false;
                var guess = "";
                var $problem = $(".problem");
                var origCode;
                var embed;

                if (!$problem.find("iframe").length) {
                    origCode = $problem.text();

                    embed = new ScratchpadEmbed({
                        origCode: origCode,
                        buttons: false,
                        author: false,
                        output: false,
                        blank: true,
                        background: KhanUtil.BACKGROUND,
                        code: origCode,
                        onrun: function(data) {
                            if (!data.results) {
                                return;
                            }

                            guess = data.results.code;
                            passing = data.results.errors.length === 0;
                        }
                    });

                    var iframe = embed.getIframe();
                    $(iframe).data("embed", embed);
                    $problem.html(iframe);

                } else {
                    embed = $problem.find("iframe").data("embed");
                    origCode = embed.props.origCode;
                }

                return {
                    answer: function() {
                        return guess;
                    },
                    validator: function(guess) {
                        return !solution && passing ||
                            !!solution &&
                                guess.replace(/\s+/g, "") === solution;
                    },
                    solution: solution,
                    examples: [],
                    showGuess: function(guess) {
                        if (guess === undefined) {
                            guess = origCode;
                        }

                        embed.setOptions({ code: guess });
                    }
                };
            }
        },

        // Shows a code editor (with no output)
        // Uses a text area to get the user's answer
        csText: {
            setup: function(solutionarea, solution) {
                Khan.scratchpad.disable();

                var $problem = $(".problem");

                // Make sure problem isn't double-embedded in timeline
                if (!$problem.find("iframe").length) {
                    var embed = new ScratchpadEmbed({
                        buttons: false,
                        author: false,
                        output: false,
                        lines: true,
                        autoFocus: false,
                        blank: true,
                        background: KhanUtil.BACKGROUND,
                        code: $problem.text()
                    });
                    $problem.html(embed.getIframe());
                }

                return Khan.answerTypes.text.setup(solutionarea, solution);
            }
        },

        // Shows a code editor (with no output)
        // Uses a multiple choice to get the user's answer
        csRadio: {
            setup: function(solutionarea, solution) {
                Khan.scratchpad.disable();

                var $problem = $(".problem");

                // Make sure problem isn't double-embedded in timeline
                if (!$problem.find("iframe").length) {
                    var embed = new ScratchpadEmbed({
                        buttons: false,
                        author: false,
                        output: false,
                        lines: true,
                        autoFocus: false,
                        blank: true,
                        background: KhanUtil.BACKGROUND,
                        code: $problem.text()
                    });
                    $problem.html(embed.getIframe());
                }

                return Khan.answerTypes.radio.setup(solutionarea, solution);
             }
        }
    });

})();

(function() {
    var Embed = window.ScratchpadEmbed = function(props) {
        this.props = {};

        for (var prop in baseProps) {
            this.props[prop] = baseProps[prop];
        }

        for (var prop in props) {
            this.props[prop] = props[prop];
        }

        this.id = this.id || (new Date).getTime() + "-" + Math.random();
        this.callbacks = [];

        if (props.url) {
            this.url = props.url;
        }

        var self = this;

        this.onrun(function(data) {
            if (data.embedReady) {
                self.onready();
            }
        });

        if (this.props.onrun) {
            this.onrun(this.props.onrun);
        }
    };

    Embed.prototype = {
        // XXX(jeresig): Temporary solution, for testing. Should probably
        //               be changed to ka.org once the main code is live.
        url: (window.Exercise ? "" :
            "http://znd-cs-exercises-dot-khan-academy.appspot.com") +
            "/cs/new/embedded",

        setOptions: function(options) {
            for (var prop in options) {
                this.props[prop] = options[prop];
            }

            this.postFrame(options);
        },

        clear: function() {
            this.setOptions({ code: "" });
        },

        onrun: function(callback) {
            this.bindListener();
            this.callbacks.push(callback);
        },

        onready: function() {
            var props = this.props;

            if (props.code !== undefined) {
                this.setOptions({
                    code: props.code,
                    autoFocus: props.autoFocus,
                    lines: props.lines,
                    cursor: props.cursor,
                    validate: props.validate
                });
            }

            if (this.onload) {
                this.onload();
            }

            if (props.onload) {
                props.onload();
            }
        },

        restart: function(code) {
            this.postFrame({ restart: true });
        },

        bindListener: function() {
            if (this.bound) {
                return;
            }

            var self = this;

            window.addEventListener("message", function(e) {
                var data;

                try {
                    data = JSON.parse(event.data);

                } catch (e) {
                    // Malformed JSON, we don't care about it
                }

                // Make sure we only listen for reponses that have the right ID
                if (data && data.id === self.id) {
                    // Remember the source and origin so that we can reply later
                    self.frameSource = e.source;
                    self.frameOrigin = e.origin;

                    delete data.id;

                    // Call all the listening callbacks
                    for (var i = 0, l = self.callbacks.length; i < l; i++ ) {
                        self.callbacks[i](data);
                    }
                }
            }, false);

            this.bound = true;
        },

        getIframe: function() {
            if (this.iframe) {
                return this.iframe;
            }

            var props = this.props;

            // Figure out the correct height and width of the embed
            var height = 440;
            var width = 940;

            if (props.buttons === false && props.author === false &&
                    props.editor === false) {
                height = width = 400;

            } else {
                if (props.buttons === false && props.author === false) {
                    height = 402;
                }

                if (props.output === false) {
                    width = 520;
                }

                if (props.editor === false) {
                    width = 402;
                }

                if ((props.output === false || props.editor === false) &&
                        props.buttons !== false && props.author !== false) {
                    height = 478;
                }
            }

            var queryString = {
                id: this.id,
                origin: window.location.origin
            };

            for (var prop in props) {
                var val = rpropMap[ props[prop] ] || props[prop];

                if (typeof val !== "function") {
                    queryString[prop] = val;
                }
            }

            var iframe = this.iframe = document.createElement("iframe");
            iframe.src = this.url.replace(/\?.*$/, "") +
                "?" + $.param(queryString);
            iframe.style.border = "0px";
            iframe.style.width = width + "px";
            iframe.style.height = height + "px";
            iframe.frameBorder = 0;
            iframe.scrolling = "no";
            return iframe;
        },

        postFrame: function(data) {
            // Send the data to the frame using postMessage
            if (this.frameSource) {
                this.frameSource.postMessage(
                    JSON.stringify(data), this.frameOrigin);
            }
        }
    };

    var baseProps = {},
        propMap = { "no": false, "yes": true },
        rpropMap = { "false": "no", "true": "yes" };

    for (var prop in baseProps) {
        var val = propMap[ baseProps[prop] ];
        if (val !== undefined) {
            baseProps[prop] = val;
        }
    }

    if (baseProps.embed === true) {
        var scripts = document.getElementsByTagName("script"),
            lastScript = scripts[scripts.length - 1];

        lastScript.parentNode.insertBefore(
            (new Embed(baseProps)).getIframe(), lastScript);
    }
})();