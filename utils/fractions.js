/**
 * Offers some useful functions for drawing mixed numbers as circles and bars.
 *
 * @author Phillip Cohen (phillco)
 */
jQuery.extend(KhanUtil, {

    /** Returns some useful mixed-number information given the fraction */
    getMixedNumberData:function (numerator, denominator) {
        return {
            numerator:numerator,
            denominator:denominator,
            wholeUnits:Math.floor(numerator / denominator),
            totalUnits:Math.ceil(numerator / denominator),
            remainingPieces:numerator % denominator
        };
    },

    /**
     * Draws the given as a series of circles (or pie charts).
     *
     * @param fillWholeUnits controls whether the whole units should be completely solid.
     */
    drawFractionAsCircles:function (numerator, denominator, color, fillWholeUnits) {

        var data = KhanUtil.getMixedNumberData(numerator, denominator);

        KhanUtil.currentGraph.style({ stroke:color, fill:color });
        for (var i = 0; i < data.wholeUnits; i++) {

            // Draw a solid circle for the whole units, if requested, or a split pie chart.
            if (fillWholeUnits)
                KhanUtil.currentGraph.circle([ i * 5, 0 ], 2);
            else
                piechart([denominator - 1, 1], [color, color], 2, i * 5, 0); // [PC] Hack because piechart() does not support a chart showing 100% in one division. So color both sides.
        }

        if (data.totalUnits > data.wholeUnits)
            piechart([data.remainingPieces, denominator - data.remainingPieces], [color, "#999"], 2, data.wholeUnits * 5, 0);
    },

    /**
     * Draws the given as a series of rectangles.
     *
     * @param fillWholeUnits controls whether the whole units should be completely solid.
     */
    drawFractionAsRectangles:function (numerator, denominator, color, fillWholeUnits) {

        var data = KhanUtil.getMixedNumberData(numerator, denominator);

        KhanUtil.currentGraph.style({ stroke:color, fill:color });
        for (var i = 0; i < data.wholeUnits; i++) {

            // Draw a solid rectangle for the whole units, if requested, or a split pie chart.
            // Implementation note: we start at y = MAX and draw down to y = 0. This achieves the top-down ordering of bars.
            if (fillWholeUnits)
                rectangle(0, 2 * ( data.totalUnits - i - 1), denominator, 1);
            else
                rectchart([data.denominator], [color], 2 * ( data.totalUnits - i - 1));
        }

        if (data.totalUnits > data.wholeUnits)
            rectchart([data.remainingPieces, denominator - data.remainingPieces], [color, "#999"], 0);
    }
});
