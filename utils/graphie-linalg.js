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

		var drawMatrix = [];
		var drawRows = 0;
		var drawCols = 0;

		//digits and negative signs split and delimited
		//should be optimized better
		for ( i = 0; i < rows; i++ ) {
			var innerMatrix = [];
			var testCols = 0;
			for ( j = 0; j < cols; j++ ) {
				var testElement = String(self.matrix[i][j]);
				while (testElement.charAt(1)) {
					innerMatrix.push(testElement.charAt(0));
					testCols++;
					testElement = testElement.substr(1);
				}
				innerMatrix.push(testElement.charAt(0));
				innerMatrix.push(";");
				testCols++;
			}
			if (testCols > drawCols) {
				drawCols = testCols;
			}
			drawMatrix.push(innerMatrix);
			drawRows++;
		}

		//height estimation is not very accurate for bigger matrices
		var matrixHeight = .25 * drawRows;
		var matrixWidth = drawCols - .7;

		graph.init({
			range: [[ -1, drawCols ], [ -drawRows, drawRows ]],
			scale: [ 40, 32 ]
		});

		//draw numbers in matrix
		for ( i = 0; i < drawRows; i++ ) {
			var col = 0;
			for ( j = 0; j < drawCols; j++ ) {
				if (drawMatrix[i][col] === ";") {
					col++;
				}
				if (drawMatrix[i][col] === "-") {
					graph.label([ j + .4, -i + 2 ], "\\huge{-}")
				}
				else {
					drawDigits( KhanUtil.integerToDigits( parseInt(drawMatrix[i][col],10) ), j, -i + 2 );
				}
				col++;
			}
		}

		//draw the matrix
		graph.path([[ -.3, -matrixHeight ],[ -.5, -matrixHeight],[ -.5, 2.8 ], [ -.3, 2.8 ]]);
		graph.path([[ matrixWidth, -matrixHeight ],[ matrixWidth + .2, -matrixHeight ],[ matrixWidth + .2, 2.8 ], [ matrixWidth, 2.8 ]]);
		graph.path([[ matrixWidth - .8, -matrixHeight + .1 ],[ matrixWidth - .8, 2.6 ]]);
	};

	this.switchRows = function( row1, row2 ) {
		if (( Math.abs( row1 ) <= rows ) && ( Math.abs( row2 ) <= rows )) {
			var temp = self.matrix[ row1 - 1 ];
			self.matrix[ row1 - 1 ] = self.matrix[ row2 - 1 ];
			self.matrix[ row2 - 1 ] = temp;
			self.show();
		}
	};

	this.multiply = function( row, factor ) {
		if ( Math.abs( row ) <= rows ) {
			for (i in self.matrix[ row - 1 ]) {
				self.matrix[ row - 1 ][ i ] *= eval(factor);
			}
			self.show();
		}
	};

	this.add = function( row, addRow, factor ) {
		if (( Math.abs( row ) <= rows ) && ( Math.abs( addRow ) <= rows )) {
			for (i in self.matrix[ row - 1 ]) {
				self.matrix[ row - 1 ][ i ] += ( self.matrix[ addRow - 1 ][ i ] * eval(factor) );
			}
			self.show();
		}
	}
};
