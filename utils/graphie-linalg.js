function Matrix( matrix, element ) {
	var graph = KhanUtil.currentGraph;
	var rows = matrix.length;
	var cols = matrix[0].length;
	var self = this;
	this.matrix = matrix;
	this.element = element;

	this.show = function() {
		self.element.children('span').remove();

		graph.init({
			range: [[ -cols, cols ], [ -rows, rows ]],
			scale: [ 40, 30 ]
		});

		for ( i = 0; i < rows; i++ ) {
			for ( j = 0; j < cols; j++ ) {
				drawDigits( KhanUtil.integerToDigits( self.matrix[i][j] ), j, -i + 1 );
			}
		}

		graph.path([[ -.3, -.6 ],[ -.5, -.6 ],[ -.5, 1.8 ], [ -.3, 1.8 ]]);
		graph.path([[ cols - .7, -.6 ],[ cols - .5, -.6 ],[ cols - .5, 1.8 ], [ cols - .7, 1.8 ]]);
		graph.path([[ cols - 1.5, -.4 ],[ cols - 1.5, 1.6 ]]);
	};

	this.switchRows = function( row1, row2 ) {
		var temp = self.matrix[ row1 - 1 ];
		self.matrix[ row1 - 1 ] = self.matrix[ row2 - 1 ];
		self.matrix[ row2 - 1 ] = temp;
		self.show();
	};

	this.multiply = function( row, factor ) {
		for (i in self.matrix[ row - 1 ]) {
			self.matrix[ row - 1 ][ i ] *= factor;
		}
		self.show();
	};

	this.add = function( row, addRow, factor ) {
		for (i in self.matrix[ row - 1 ]) {
			self.matrix[ row - 1 ][ i ] += ( self.matrix[ addRow - 1 ][ i ] * factor );
		}
		self.show();
	}
};
