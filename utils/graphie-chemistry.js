function PeriodicTable(height, cellSize) {
	var elements = [];
	var cells = [];
	var labels = [];

	$.each(KhanUtil.elements, function (i, el) {
		if (i > 0) {
			elements[i] = new Element(i);
		}
	});

	this.highlightElement = function (N, color) {
		cells[N].remove();
		labels[N].remove();

		this.renderCell(elements[N], color);
		this.renderLabel(elements[N]);
	};

	this.getElementCoordinates = function (el) {
		var x = el.leftOffset * cellSize[0];
		var y = height - (el.period * cellSize[1]);

		// Lanthanoids and actinoids go under the table.
		if (el.block == "f") {
			y -= 2;
		}

		return [x, y];
	};

	this.renderCell = function (el, color) {
		var coords = this.getElementCoordinates(el), x = coords[0], y = coords[1];
		
		graph = KhanUtil.currentGraph;
		graph.style( {
			strokeWidth: 1,
			fill: color
		} );

		cells[el.protonNumber] = graph.path( [ [x - cellSize[0] / 2, y - cellSize[1] / 2],
			[x + cellSize[0] / 2, y - cellSize[1] / 2],
			[x + cellSize[0] / 2, y + cellSize[1] / 2],
			[x - cellSize[0] / 2, y + cellSize[1] / 2],
			true ] );
	}

	this.renderLabel = function (el) {
		var coords = this.getElementCoordinates(el), x = coords[0], y = coords[1];

		graph = KhanUtil.currentGraph;
		labels[el.protonNumber] = graph.label( [x, y], el.symbol, "center", false);
		labels[el.protonNumber].attr(el.name);
	}

	this.draw = function () {
		var graph = KhanUtil.currentGraph;

		var _this = this;
		$.each(elements, function (i, el) {
			if (el === undefined) return;

			var color;

			switch (el.block) {
				// several shades of light green
				case "s": color = "#E6FFCF"; break;
				case "p": color = "#C6F29F"; break;
				case "d": color = "#94E685"; break;
				case "f": color = "#5FD866"; break;
			}

			_this.renderCell(el, color);
			_this.renderLabel(el);
		});
	};
}

