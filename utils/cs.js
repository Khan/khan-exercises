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
                // Make sure the tutorial page can fit the full exercise
                $("#tutorial-page").addClass("wide");

                // Remove exercise styling upon completion
                bindCSCleanup();

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
                var embed = new ScratchpadEmbed({
                    buttons: false,
                    author: false,
                    blank: true,
                    background: "#F8F8F8",
                    code: $problem.text(),
                    validate: solution,
                    onrun: function(data) {
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
                $problem.html(embed.getIframe());

                return {
                    answer: function() {
                        return guess;
                    },
                    validator: function() {
                        return passing;
                    },
                    solution: solution,
                    examples: [],
                    showGuess: function(guess) {}
                };
            }
        },

        // Shows a code editor (with no output)
        // If a solution is provided, passes if the content matches the solution
        // If no solution, passes if the code passes without errors
        csPass: {
            setup: function(solutionarea, solution) {
                solution = typeof solution === "object" ?
                    $(solution).text() :
                    solution;
                solution = solution.replace(/\s+/, "");

                var passing = false;
                var guess = "";
                var $problem = $(".problem");
                var embed = new ScratchpadEmbed({
                    buttons: false,
                    author: false,
                    output: false,
                    blank: true,
                    background: "#F8F8F8",
                    code: $problem.text(),
                    onrun: function(data) {
                        guess = data.results.code;
                        passing = data.results.errors.length === 0;
                    }
                });
                $problem.html(embed.getIframe());

                return {
                    answer: function() {
                        return guess;
                    },
                    validator: function() {
                        return !solution && passing ||
                            !!solution && guess.replace(/\s+/, "") === solution;
                    },
                    solution: solution,
                    examples: [],
                    showGuess: function(guess) {}
                };
            }
        },

        // Shows a code editor (with no output)
        // Uses a text area to get the user's answer
        csText: {
            setup: function(solutionarea, solution) {
                var $problem = $(".problem");
                var embed = new ScratchpadEmbed({
                    buttons: false,
                    author: false,
                    output: false,
                    lines: true,
                    autoFocus: false,
                    blank: true,
                    background: "#F8F8F8",
                    code: $problem.text()
                });
                $problem.html(embed.getIframe());

                return Khan.answerTypes.text.setup(solutionarea, solution);
            }
        },

        // Shows a code editor (with no output)
        // Uses a multiple choice to get the user's answer
        csRadio: {
            setup: function(solutionarea, solution) {
                var $problem = $(".problem");
                var embed = new ScratchpadEmbed({
                    buttons: false,
                    author: false,
                    output: false,
                    lines: true,
                    autoFocus: false,
                    blank: true,
                    background: "#F8F8F8",
                    code: $problem.text()
                });
                $problem.html(embed.getIframe());

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
    };

    Embed.prototype = {
        url: "/cs/new/embedded",

        setCode: function(code) {
            this.postFrame(code);
        },

        clear: function() {
            this.setCode({ code: "" });
        },

        onrun: function(callback) {
            this.bindListener();
            this.callbacks.push(callback);
            this.postFrame({ listen: true, id: this.id });
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
                    delete data.id;

                    // Call all the listening callbacks
                    for (var i = 0, l = self.callbacks.length; i < l; i++ ) {
                        self.callbacks[i](data);
                    }
                }
            }, false);
        },

        getIframe: function() {
            if (this.iframe) {
                return this.iframe;
            }

            var self = this,
                props = this.props;

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

            var queryString = {};

            for (var prop in props) {
                var val = rpropMap[ props[prop] ] || props[prop];

                if (typeof val !== "function") {
                    queryString[prop] = val;
                }
            }

            this.iframe = document.createElement("iframe");
            this.iframe.src = this.url.replace(/\?.*$/, "") +
                "?" + $.param(queryString);
            this.iframe.style.border = "0px";
            this.iframe.style.width = width + "px";
            this.iframe.style.height = height + "px";
            this.iframe.frameBorder = 0;
            this.iframe.scrolling = "no";
            this.iframe.onload = function() {
                if (self.props.code !== undefined) {
                    self.setCode({
                        code: self.props.code,
                        autoFocus: self.props.autoFocus,
                        lines: self.props.lines,
                        cursor: self.props.cursor,
                        validate: self.props.validate
                    });
                }

                if (self.props.onrun) {
                    self.onrun(self.props.onrun);
                }

                if (self.onload) {
                    self.onload();
                }

                if (self.props.onload) {
                    self.props.onload();
                }
            };
            return this.iframe;
        },

        // Extract the origin from the URL
        postFrameOrigin: function() {
            var match = /^.*:\/\/[^\/]*/.exec(this.url);

            return match ?
                match[0] :
                window.location.protocol + "//" + window.location.host;
        },

        postFrame: function(data) {
            // Send the data to the frame using postMessage
            this.getIframe().contentWindow.postMessage(
                JSON.stringify(data), this.postFrameOrigin());
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