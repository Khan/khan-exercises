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

	this.renderCell = function (el, color) {
		var x = el.leftOffset * cellSize[0];
		var y = height - (el.period * cellSize[1]);
		// Lanthanoids and actinoids go under the table.
		if (el.block == "f") {
			y -= 2;
		}
		
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
		var x = el.leftOffset * cellSize[0];
		var y = height - (el.period * cellSize[1]);
		// Lanthanoids and actinoids go under the table.
		if (el.block == "f") {
			y -= 2;
		}

		graph = KhanUtil.currentGraph;
		labels[el.protonNumber] = graph.label( [x, y], el.symbol, "center", false);
		labels[el.protonNumber].attr(el.name);
	}

	this.draw = function () {
		var graph = KhanUtil.currentGraph;

		var els = [];
		var _this = this;
		$.each(elements, function (i, el) {
			if (el === undefined) return;

			var color;

			switch (el.block) {
				case "s": color = "#CDF1FA"; break;
				case "p": color = "#8FD0E0"; break;
				case "d": color = "#569DBB"; break;
				case "f": color = "#e8e8e8"; break;
			}

			_this.renderCell(el, color);
			_this.renderLabel(el);
		});
	};
}

