jQuery.extend( KhanUtil, {

	doParabolaInteraction: function( func, vertex, directrix ) {
		var graph = KhanUtil.currentGraph;

		var vertexLine = KhanUtil.bogusShape;
		var directrixLine = KhanUtil.bogusShape;
		var lineEndcap = KhanUtil.bogusShape;
		var highlighted = false;

		// Attach an onMove handler that gets called whenever the mouse hovers over
		// the parabola
		func.onMove = function( coordX, coordY ) {
			vertexLine.remove();
			directrixLine.remove();
			lineEndcap.remove();
			graph.style({ strokeWidth: 1.5, stroke: KhanUtil.GREEN, opacity: 0.0 });
			var vertexDistance = KhanUtil.getDistance( [ coordX, coordY ], vertex.coord );

			// Draw a line from the vertex to the highlighted point on the parabola
			vertexLine = graph.line( [coordX, coordY], vertex.coord );
			// Draw the horizontal line from the highlighted point on the parabola towards the directrix
			if (directrix.coord < coordY) {
				directrixLine = graph.line( [coordX, coordY], [ coordX, coordY - vertexDistance] );
				lineEndcap = graph.line( [coordX - 0.05, coordY - vertexDistance ], [coordX + 0.05, coordY - vertexDistance] );
			} else {
				directrixLine = graph.line( [coordX, coordY], [ coordX, coordY + vertexDistance] );
				lineEndcap = graph.line( [coordX - 0.05, coordY + vertexDistance ], [coordX + 0.05, coordY + vertexDistance] );
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

		// Attach an onLeave handler that gets called whenever the mouse moves away
		// from the parabola
		func.onLeave = function( coordX, coordY ) {
			vertexLine.animate( {opacity: 0.0}, 100 );
			directrixLine.animate( {opacity: 0.0}, 100 );
			lineEndcap.animate({ opacity: 0.0 }, 100);
			highlighted = false;
		};

	}

});
