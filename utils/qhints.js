$.fn["qhintsLoad"] = function() {

    var checkAnswer = function(parent, source) {
        var feedback = parent.find(".qhint-feedback");

        // if answer already revealed in the feedback, don't do anything
        if (feedback.length) {
            return;
        }

        // make a new feedback element
        feedback = $("<p>", { "class": "qhint-feedback" });
        var answer = $(parent.find(".qhint-answer")).text();
        var input = parent.find(".qhint-input");
        var userInput = "";

        if (source) {
            var type = source.attr("type");
            if (type === "text" || type === "submit") {
                userInput = $(parent.find("input:text")).val();
            } else if (type === "button") {
                userInput = $(source).val();
            }
        }

        // hide input element and instead show the feedback element
        input.hide();

        if (!source) {
            feedback.text(answer);
        } else if (userInput === answer) {
            feedback.text("Correct! The answer is " + answer + ".")
                    .addClass("correct");
        } else {
            feedback.text("Incorrect. The answer is " + answer + ".")
                        .addClass("incorrect");
        }

        parent.append(feedback);
    };

    var handleCheck = function(e) {
        var parent = $(e.currentTarget).parents(".qhint");
        checkAnswer(parent, $(e.currentTarget));
    };

    var selectors = ".qhint input:submit, .qhint input:button";
    $("body").on("click", selectors, handleCheck);

    // check hint when user presses enter
    $("body").on("keydown", ".qhint input:text", function(e) {
        // enter is pressed
        if (e.keyCode === 13) {
            handleCheck(e);
        }
    });

    $(Khan).on("hintUsed", function() {
        var lastQhElem = $(".qhint").last();
        if (lastQhElem.length) {
            checkAnswer(lastQhElem, null);
        }
    });
};
