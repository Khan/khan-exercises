function Matrix( matrix, element ) {
	var graph = KhanUtil.currentGraph;
	var rows = matrix.length;
	var cols = matrix[0].length;
	var self = this;
	//matrix should be an array of arrays, each inner array being a row
	this.matrix = matrix;
	this.element = element;

	this.show = function() {
		self.element.children('span').remove();
		graph.raphael.clear();

		//height estimation is not very accurate for bigger matrices
		var matrixHeight = .5 * rows - 1;
		var matrixWidth = cols - .7;

		graph.init({
			range: [[ -cols, cols ], [ -rows, rows ]],
			scale: [ 40, 30 ]
		});

		//draw numbers in matrix
		for ( i = 0; i < rows; i++ ) {
			for ( j = 0; j < cols; j++ ) {
				graph.label([ j, -i + 2 ], Math.round( self.matrix[i][j] * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 ));
			}
		}

		//draw the matrix and labels
		for ( i = 0; i < rows; i++ ) {
			graph.label([ -1.6, -i + 2 ], "Row " + ( i + 1 ));
		}
		graph.path([[ -.3, -matrixHeight ],[ -.5, -matrixHeight],[ -.5, 2.8 ], [ -.3, 2.8 ]]);
		graph.path([[ matrixWidth, -matrixHeight ],[ matrixWidth + .2, -matrixHeight ],[ matrixWidth + .2, 2.8 ], [ matrixWidth, 2.8 ]]);
		graph.path([[ matrixWidth - .8, -matrixHeight + .1 ],[ matrixWidth - .8, 2.6 ]]);
	};

	this.validateEntry = function( row ) {
		for (i in arguments) {
			if ((arguments[i] > rows) || !( /^\d+$/.test(arguments[i]) )) {
				return false;
			}
		}
		return true;
	}

	this.switchRows = function( row1, row2 ) {
		if ( self.validateEntry( row1, row2 ) ) {
			var temp = self.matrix[ row1 - 1 ];
			self.matrix[ row1 - 1 ] = self.matrix[ row2 - 1 ];
			self.matrix[ row2 - 1 ] = temp;
			self.show();
		}
	};

	this.multiply = function( row, factor ) {
		if ( self.validateEntry( row ) ) {
			for (i in self.matrix[ row - 1 ]) {
				self.matrix[ row - 1 ][ i ] *= eval(factor);
			}
			self.show();
		}
	};

	this.add = function( row, addRow, factor ) {
		if ( self.validateEntry( row, addRow ) ) {
			for (i in self.matrix[ row - 1 ]) {
				self.matrix[ row - 1 ][ i ] += ( self.matrix[ addRow - 1 ][ i ] * eval(factor) );
			}
			self.show();
		}
	}
};
