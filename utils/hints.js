$(Khan).bind("checkAnswer", function() {

    if (!$(".hint-box").data("free")) {

        $(".hint-box")
            .data("free", true)
            .css("position", "relative")
            .animate({top: -10}, 250)
            .find(".info-box-header")
                .slideUp(250)
                .end()
            .find("#hint")
                .switchClass("orange", "green", 1 /* duration */, function() {
                    $(this)
                        .data("buttonText", Khan.showSolutionButtonText)
                        .val(Khan.showSolutionButtonText);
                });

    }

});

$(Khan).bind("newProblem", function() {

    // Restore the hint button
    $("#hint")
        .removeClass("green")
        .addClass("orange")
        .val("I'd like a hint")
        .data("buttonText", false)
        .stop(true /* clear */, true /* jump */)
        .appendTo("#get-hint-button-container");

    $(".hint-box")
        .data("free", false)
        .css("top", "0")
        .find(".info-box-header")
            .show();

    var examples = $("#examples");
    if (examples.length && $.prototype.qtip != null) {

        // Tooltip-ify the example answer formats
        $("#examples-show").qtip({
            content: {
                text: examples.remove(),
                prerender: true
            },
            style: {
                classes: "qtip-light leaf-tooltip"
            },
            position: {
                my: "bottom center",
                at: "top center"
            },
            show: {
                delay: 200,
                effect: {
                    length: 0
                }
            },
            hide: {
                delay: 0
            }
        });

    }

});
