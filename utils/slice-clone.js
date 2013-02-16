// Helper for fractions_cut_and_copy_1 and fractions_cut_and_copy_2
$.extend(KhanUtil, {
    initSliceClone: function(goalBlocks) {
        KhanUtil.pieces = 1;
        KhanUtil.times = {};
        for (var i = 0; i < goalBlocks.length; i++) {
            KhanUtil.times[goalBlocks[i]] = 1;
        }
    },

    // Change the number of pieces the starting block
    // is sliced into.
    changePieces: function(increase) {
        if (KhanUtil.pieces === 1 && !increase) {
            return;
        }

        KhanUtil.pieces += (increase) ? 1 : -1;

        $("#pieces").text(KhanUtil.plural(KhanUtil.pieces, "piece"));

        KhanUtil.currentGraph = $("#problemarea").find("#parent_block").data("graphie");
        rectchart([1, KhanUtil.pieces - 1], ["#e00", "#999"]);

        KhanUtil.updateGraphAndAnswer();
    },

    // Change the number of times the slice is copied.
    changeTimes: function(increase, id) {
        if (KhanUtil.times[id] === 1 && !increase) {
            return;
        }

        KhanUtil.times[id] += (increase) ? 1 : -1;

        $("#" + id + "_times").text(KhanUtil.plural(KhanUtil.times[id], "time"));

        KhanUtil.updateGraphAndAnswer();
    },

    updateGraphAndAnswer: function() {
        var pieces = KhanUtil.pieces;
        var times;
        for (var id in KhanUtil.times) {
            times = KhanUtil.times[id];
            KhanUtil.currentGraph = $("#problemarea").find("#" + id).data("graphie");
            KhanUtil.currentGraph.raphael.clear();
            KhanUtil.currentGraph.init({ range: [[0, 1], [0, 1]], scale: [500 / pieces * times, 25] });
            rectchart([times, 0], ["#e00", "#999"]);
            $("#" + id + "_answer input").val(KhanUtil.roundTo(3, times / pieces));
        }
    }
});
