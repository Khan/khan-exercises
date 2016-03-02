/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

$.extend(KhanUtil, {
    doParabolaInteraction: function(func, vertex, directrix) {
        var graph = KhanUtil.currentGraph;

        var vertexLine = KhanUtil.bogusShape;
        var directrixLine = KhanUtil.bogusShape;
        var lineEndcap = KhanUtil.bogusShape;
        var highlighted = false;

        // Attach an onMove handler that gets called whenever the mouse hovers over
        // the parabola
        func.onMove = function(coordX, coordY) {
            vertexLine.remove();
            directrixLine.remove();
            lineEndcap.remove();
            graph.style({ strokeWidth: 1.5, stroke: KhanUtil.GREEN, opacity: 0.0 });
            var vertexDistance = KhanUtil.getDistance([coordX, coordY], vertex.coord);

            // Draw a line from the vertex to the highlighted point on the parabola
            vertexLine = graph.line([coordX, coordY], vertex.coord);
            // Draw the horizontal line from the highlighted point on the parabola towards the directrix
            if (directrix.coordA[1] < coordY) {
                directrixLine = graph.line([coordX, coordY], [coordX, coordY - vertexDistance]);
                lineEndcap = graph.line([coordX - 0.05, coordY - vertexDistance], [coordX + 0.05, coordY - vertexDistance]);
            } else {
                directrixLine = graph.line([coordX, coordY], [coordX, coordY + vertexDistance]);
                lineEndcap = graph.line([coordX - 0.05, coordY + vertexDistance], [coordX + 0.05, coordY + vertexDistance]);
            }
            vertexLine.toBack();
            directrixLine.toBack();
            if (!highlighted) {
                vertexLine.animate({opacity: 1.0}, 100);
                directrixLine.animate({opacity: 1.0}, 100);
                lineEndcap.animate({opacity: 1.0}, 100);
            } else {
                vertexLine.attr({ opacity: 1.0 });
                directrixLine.attr({ opacity: 1.0 });
                lineEndcap.attr({ opacity: 1.0 });
            }
            highlighted = true;
        };

        // Attach an onLeave handler that gets called whenever the mouse moves away from the parabola
        func.onLeave = function(coordX, coordY) {
            vertexLine.animate({opacity: 0.0}, 100);
            directrixLine.animate({opacity: 0.0}, 100);
            lineEndcap.animate({ opacity: 0.0 }, 100);
            highlighted = false;
        };

    },

    doHyperbolaInteraction: function(func, focus1, focus2) {
        var graph = KhanUtil.currentGraph;
        var focusLine1 = KhanUtil.bogusShape;
        var focusLine2 = KhanUtil.bogusShape;
        var highlighted = false;

        func.onMove = function(coordX, coordY) {
            focusLine1.remove();
            focusLine2.remove();

            // Draw a line from each focus to the highlighted point on the hyperbola
            graph.style({ strokeWidth: 1.5, stroke: KhanUtil.GREEN, opacity: 0.0 });
            focusLine1 = graph.line([coordX, coordY], focus1.coord);
            graph.style({ stroke: KhanUtil.RED });
            focusLine2 = graph.line([coordX, coordY], focus2.coord);

            focusLine1.toBack();
            focusLine2.toBack();

            if (!highlighted) {
                focusLine1.animate({opacity: 1.0}, 100);
                focusLine2.animate({opacity: 1.0}, 100);
                $('#problemarea div.focus-instructions').hide();
                $('#problemarea div.focus-distances').show();
            } else {
                focusLine1.attr({ opacity: 1.0 });
                focusLine2.attr({ opacity: 1.0 });
            }

            highlighted = true;
            this.writeDistances(coordX, coordY);
        };

        func.onLeave = function(coordX, coordY) {
            focusLine1.animate({opacity: 0.0}, 100);
            focusLine2.animate({opacity: 0.0}, 100);
            $('#problemarea div.focus-instructions').show();
            $('#problemarea div.focus-distances').hide();
            highlighted = false;
        };
    },

    doEllipseInteraction: function(ellipse, focus1, focus2) {
        var graph = KhanUtil.currentGraph;
        var focusLine1 = KhanUtil.bogusShape;
        var focusLine2 = KhanUtil.bogusShape;
        var highlighted = false;

        ellipse.onMove = function(coordX, coordY) {
            focusLine1.remove();
            focusLine2.remove();

            // Draw a line from each focus to the highlighted point on the ellipse
            graph.style({ strokeWidth: 1.5, stroke: KhanUtil.GREEN, opacity: 0.0 });
            focusLine1 = graph.line([coordX, coordY], focus1.coord);
            graph.style({ stroke: KhanUtil.RED });
            focusLine2 = graph.line([coordX, coordY], focus2.coord);

            focusLine1.toBack();
            focusLine2.toBack();

            if (!highlighted) {
                focusLine1.animate({opacity: 1.0}, 100);
                focusLine2.animate({opacity: 1.0}, 100);
                $('#problemarea div.focus-instructions').hide();
                $('#problemarea div.focus-distances').show();
            } else {
                focusLine1.attr({ opacity: 1.0 });
                focusLine2.attr({ opacity: 1.0 });
            }

            highlighted = true;
            this.writeDistances(coordX, coordY);
        };

        ellipse.onLeave = function(coordX, coordY) {
            focusLine1.animate({opacity: 0.0}, 100);
            focusLine2.animate({opacity: 0.0}, 100);
            $('#problemarea div.focus-instructions').show();
            $('#problemarea div.focus-distances').hide();
            highlighted = false;
        };
    }

});

});
