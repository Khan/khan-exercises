function PeriodicTable(height, cellSize) {
	var elements = [];
	var cells = [];
	var labels = [];

	$.each( KhanUtil.elements, function ( i, el ) {
		if ( i > 0 ) {
			elements[i] = new Element( i );
		}
	});

	this.highlightElement = function ( N, color ) {
		cells[N].remove();
		labels[N].remove();

		this.renderCell( elements[N], color );
		this.renderLabel( elements[N] );
	};

	this.getElementCoordinates = function ( el ) {
		var x = el.leftOffset * cellSize[0];
		var y = height - ( el.period * cellSize[1] );

		// Lanthanoids and actinoids go under the table.
		var isBelow = ( el.block === "f" );
		var ec = el.electronConfiguration;
		isBelow |= ( ec.length > 1 && ec[ec.length - 2].type === "f" && ec[ec.length - 1].count === 1 );

		if ( isBelow ) {
			y -= 2;
		}

		return [x, y];
	};

	function createBox( x, y ) {
		return KhanUtil.currentGraph.path( [ [x - cellSize[0] / 2, y - cellSize[1] / 2],
			[x + cellSize[0] / 2, y - cellSize[1] / 2],
			[x + cellSize[0] / 2, y + cellSize[1] / 2],
			[x - cellSize[0] / 2, y + cellSize[1] / 2],
			true ] );
	}

	this.renderCell = function ( el, color ) {
		var coords = this.getElementCoordinates( el ), x = coords[0], y = coords[1];
		
		graph = KhanUtil.currentGraph;
		graph.style( {
			strokeWidth: 1,
			fill: color
		} );

		cells[el.protonNumber] = createBox( x, y );
	}

	this.renderLabel = function ( el ) {
		var coords = this.getElementCoordinates( el ), x = coords[0], y = coords[1];

		graph = KhanUtil.currentGraph;
		labels[el.protonNumber] = graph.label( [x, y], el.symbol, "center", false );
		labels[el.protonNumber].attr( el.name );
	}

	// Renders the labels of omitted lanthanides and actinides
	this.renderLaAcLabels = function (el) {
		// Those are 1 position to the right of
		// Ba and Ra.
		var coords = this.getElementCoordinates( new Element("Ba") ),
			x = coords[0] + cellSize[0],
			y = coords[1];

		graph.style({
			fill: getElementColor( new Element("La") )
		});
		var laBox = createBox( x, y );
		var laLabel = graph.label( [x, y], "*", "center", false);

		y -= cellSize[1];
		graph.style({
			fill: getElementColor( new Element("Ac") )
		});
		var acBox = createBox( x, y );
		var acLabel = graph.label( [x, y], "**", "center", false);
	}

	function getElementColor(el) {
		// several shades of light green
		switch ( el.block ) {
			case "s": return "#E6FFCF";
			case "p": return "#C6F29F";
			case "d": return "#94E685";
			case "f": return "#5FD866";
		}
	}

	this.draw = function () {
		var graph = KhanUtil.currentGraph;

		var _this = this;
		$.each( elements, function ( i, el ) {
			if (el === undefined) return;

			_this.renderCell( el, getElementColor( el ) );
			_this.renderLabel( el );
		});
		this.renderLaAcLabels();
	};
}

