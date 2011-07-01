"use strict";

/* some helpful functional programming tools */
// jQuery.map is actually a mapReduce.
// i.e., if you return an array, it extends the result instead
// of pushing the new array onto the result.  Not good when
// you have to traverse a bunch of 2d arrays! 
var map = function (a, f) {
	var ret = [];
	for (var i = 0; i < a.length; i++) {
		ret.push( f(a[i]) );
	}
	return ret;
};
var zip = function (a,b) {
	var ret = [];
	var l = Math.min(a.length, b.length);
	for (var i = 0; i < l; i++) {
		ret.push([ a[i], b[i] ]);
	}
	return ret;
};
var range = function (n) {
	var ret = []
	for (var i = 0; i < n; i++) {
		ret.push(i);
	}
	return ret;
};
var sum = function (a) {
	var ret = 0;
	for (var i = 0; i < a.length; i++) {
		ret += a[i];
	}
	return ret;
};
var prod = function (a) {
	var ret = 1;
	for (var i = 0; i < a.length; i++) {
		ret *= a[i];
	}
	return ret;
};


/* a few useful array utilities */
//copy an arbitrarily nested array
//this should also copy expr arrays
var deepCopyArray = function (a){
	if (typeof a === 'object' && a.length >= 0 && a.constructor == Array) {
		return map(a, deepCopyArray);
	}
	return a;
};
//return a transposed version of a 2d array
var arrayTranspose = function (array) {
	var new_array = [];
	//loop through the columns of this.array
	for(var i = 0; i < array[0].length; i++){
		var return_ith_componant = function(x){ return x[i]; };
		//append the array consisting of the ith column of this.array
		new_array.push(map(array, return_ith_componant));
	}
	return new_array;
};


/* abstract baseclass for symbolic matrices.
 * this shouldn't be used directly */
var AbstractMatrx = function(){};
jQuery.extend(AbstractMatrx.prototype, {
		//initialize our array data
		init : function (m) {
			//if we have an array attr, we assume we're an array
			if (!m.array) {
				this.array = deepCopyArray(m);
			} else {
				this.array = deepCopyArray(m.array);
			}
			this.dims = [this.array.length, this.array[0].length];
		},
		
		//return a copy-and-pasteable 2d array
		toString : function () { 
			//if something is an array, return it with braces
			var giveBrackets = function (x) { return x.constructor == Array ? '('+x.toString()+')' : x; };
			var row_texts = [];
			for(var row = 0; row < this.array.length; row++){
				var curr_row = map(this.array[row], giveBrackets);
				row_texts.push("[" + curr_row.join(", ") + "]");
			}
			return "["+row_texts.join(", ")+"]";
		},

		//applied to each entry when toCode/formatMatrix is called
		format_entry : function (x) {
			return x;
		},


		//outputs the matrix as latex code 
		//braces can be '[', '(', '|', ''.  
		//defaults to '['.
		toCode : function (braces) {
			return KhanUtil.formatMatrix(this, braces);
		},

		//test whether this is element-wise equal to other
		//other can be an array or matrix
		equal : function (other) {
			//jQuery.map is actually a mapReduce that merges returned arrays into the list
			var flattened_self = jQuery.map( this.array, function(x){ return x; } );
			if ( typeof other.array !== 'undefined' ) {
				var flattened_other = jQuery.map( other.array, function(x){ return x; } );
			} else {
				var flattened_other = jQuery.map( other, function(x){ return x; } );
			}

			return prod(map(zip(flattened_self, flattened_other), function(x){ return x[0] == x[1]; })) === 1;
		},

		//sums a vector (1-d array)
		//pass in _this_ as the first arg.  For some reason
		//_this_ doesn't make it to this context (at least when we use a map)...
		_sum : function (self, vec) {
			var ret = vec[0];
			for (var i = 1; i < vec.length; i++) {
				ret = self._math.add(ret, vec[i]);
			}
			return ret;
		},
		
		//multiplies all entries in a vector (1-d array)
		_prod : function (self, vec) {
			var ret = vec[0];
			for (var i = 1; i < vec.length; i++) {
				ret = self._math.mul(ret, vec[i]);
			}
			return ret;
		},

		//compute the dot product of two 1-d arrays
		_vecDotProduct : function (a, b) {
			if(a.length != b.length){ throw "Size of dot products do not match!"; }
			var self = this;
			var componantwise_product = map(zip(a,b), function (x) { return self._prod(self, x); });
			return this._sum(self, componantwise_product);
		},
		
		//compute the dot product of two 1-d arrays
		_vecAdd : function (a, b) {
			if(a.length != b.length){ throw "Size of dot products do not match!"; }
			var self = this;
			return map(zip(a,b), function (x) { return self._sum(self, x); });
		},

		//return a new matrix with func applied to each element
		map : function (func) {
			var new_array = map(this.array, function(x){
				return map(x, func);
			});
			return new this.constructor(new_array);
		},

		//sums up all the entries in a matrix
		sum : function () {
			var flattened = jQuery.map( this.array, function(x){ return x; });
			return this._sum(this, flattened);
		},
		
		//returns a matrix with Math.abs applied to each element
		abs : function () {
			return this.map( Math.abs );
		},
		
		//other can be another matrix or a number
		//returns the result of addition
		add : function (other) {
			var self = this;
			//if we are another matrix
			if (other instanceof this.constructor) {
				if (this.dims[0] != other.dims[0] || this.dims[1] != other.dims[1]) {
					throw "Cannot add a matrix of size "+this.dims+" and "+other.dims+".";
				}
				var new_array =  map( zip(this.array, other.array), 
					function(a){ return self._vecAdd(a[0], a[1]) } );
				
				return new this.constructor(new_array);
			} else {
				var add_n = function (x) { return self._math.add(other, x); };
				return this.map(add_n);
			}
		},
		
		//other can be another matrix or a number
		//returns the result of multiplication
		mul : function (other) {
			var self = this;
			//if we are another matrix
			if (other instanceof this.constructor) {
				if(this.dims[1] != other.dims[0]){ throw "Cannot multiply matrices of size "+this.dims+" by "+other.dims+"."; }
				var new_array =  [];
				var rows = this.array, cols = other.transpose().array;
				for(var i = 0; i < rows.length; i++){
					var dot_with_ith_row = function(x){ return self._vecDotProduct(rows[i], x); };
					//append a new row vector consisting of each column of other dotted with the ith row of this
					new_array.push(map(cols, dot_with_ith_row));
				}
				return new this.constructor(new_array)
			} else {
				var mul_n = function (x) { return self._math.mul(other, x); };
				return this.map(mul_n);
			}
		},

		//returns the i,j element.  If i=':' or j=':',
		//it returns the whole row or column
		get : function (i,j) {
			if(i == ':' && j == ':'){ return new this.constructor(this.array); }
			if(j == ':'){
				//return a copy of the row
				return this.array[i].slice();
			}
			if(i == ':'){
				return map(this.array, function(row){ return row[j]; });
			}
			return this.array[i][j]
		},

		// return the diagonal entries 
		diag : function () {
			var max_entry = Math.min(this.dims[0], this.dims[1]);
			var ret = [];
			for(var i = 0; i < max_entry; i++){
				ret.push(this.array[i][i]);
			}
			return ret;
		},

		//returns the trace
		trace : function () {
			return this._sum(this, this.diag());
		},

		is_square : function(){
			return (this.dims[0] == this.dims[1]);
		},

		//return a transposed version of ourselves
		transpose : function(){
			return new this.constructor(arrayTranspose(this.array));
		},

		// elementary row operations 
		//multiplies row _row_ by _val_
		multiply_row_by_const : function (row, val) {
			if( row >= this.dims[0] ){ throw "Row "+row+" out of range for matrix of size "+this.dims+"."; }
			var self = this;
			var new_array = deepCopyArray(this.array);
			new_array[row] = map(new_array[row], function(x){ return self._math.mul(x,val); });
			return new this.constructor(new_array);
		},
		//adds alpha*row_n to row_m
		add_mul_of_one_row_to_another : function (alpha, n, m) {
			if( n >= this.dims[0] || m >= this.dims[0]){ throw "Rows "+[m,n]+" out of range for matrix of size "+this.dims+"."; }
			var self = this;
			var new_array = deepCopyArray(this.array);
			//make a copy of row_n scaled by alpha
			var scaled_row = map(new_array[n], function(x){ return self._math.mul(alpha, x); });
			//add it to row_m
			new_array[m] = map(zip(new_array[m],scaled_row), function(x){ return self._math.add(x[0], x[1]); });

			return new this.constructor(new_array);
		},
		swap_two_rows : function (row1, row2) {
			if( row1 >= this.dims[0] || row2 >= this.dims[0]){ throw "Rows "+[row1,row2]+" out of range for matrix of size "+this.dims+"."; }
			var ret = new this.constructor(this.array);
			ret.array[row1] = this.array[row2].slice()
			ret.array[row2] = this.array[row1].slice()

			return ret;
		}
});

// set up the matrix class
KhanUtil.Matrix = function(m){ 
	if ( !(this instanceof KhanUtil.Matrix) ) {
		return new KhanUtil.Matrix(m);
	}
	//make sure that when we are constructed, our inheritence is also carried over
	this.constructor = KhanUtil.Matrix; 
	//initialize
	this.init(m); 
};
KhanUtil.Matrix.prototype = jQuery.extend( new AbstractMatrx(), {
	//numbers smaller than ZERO_TOLERANCE in magnitude are treated as zero
	ZERO_TOLERANCE : Math.pow(2, -16),

	//math functions that are used when manipulating entries
	//these are abstraced so SymbolicMatrix and Matrix can use the same
	//matrix multiplication and matrix addition functions
	_math : {
		add : function (a,b) {
			return a+b;
		},
		mul : function (a,b) {
			return a*b;
		}
	},

	//test whether this is element-wise within ZERO_TOLERANCE of other
	equal : function (other) {
		var self = this;
		//jQuery.map is actually a mapReduce that merges returned arrays into the list
		var flattened_self = jQuery.map( this.array, function(x){ return x; } );
		if ( typeof other.array !== 'undefined' ) {
			var flattened_other = jQuery.map( other.array, function(x){ return x; } );
		} else {
			var flattened_other = jQuery.map( other, function(x){ return x; } );
		}

		return prod(map(zip(flattened_self, flattened_other), function(x){ 
			return Math.abs(x[0]-x[1]) < self.ZERO_TOLERANCE; 
		})) === 1;
	},

	asSymbolic : function () {
		return new KhanUtil.SymbolicMatrix(this.array);
	},

	//rounds to ZERO_TOLERANCE or the percision
	//specified by percision
	roundToPercision : function (percision) {
		if ( typeof percision === "undefined" || percision === 0 ) {
			percision = this.ZERO_TOLERANCE;
		}

		return this.map( function(x){ return Math.round(x/percision)*percision; } );
	},
	
	//return the determinant
	det : function () {
		if (!this.is_square()) {
			return 0;
		}
		//reduce the matrix to upper triangular while keeping track of row swaps
		var reduced = this._reduce_to_stage('ref');
		var diag = reduced['matrix'].diag();
		var det = Math.pow(-1, reduced['row_swaps'])*prod(diag);
		
		//if the matrix was an integer matrix, make sure
		//we return an integer
		var is_int = function(x){ return Math.round(x) == x; };
		//if any number isn't an int, this product will be zero
		var all_ints = prod(map(this.array, function(x){
			return prod(map(x, is_int));
		}));
		if (all_ints) {
			return Math.round(det);
		}
		return det;
	},

	//return the matrix in row-echelon form
	ref : function () {
		return this._reduce_to_stage('ref')['matrix'];
	},

	//return the matrix in reduced row-echelon form
	rref : function () {
		return this._reduce_to_stage('rref')['matrix'];
	},

	//invert the matrix
	inverse : function () {
		var aug_mat = KhanUtil.augmentMatrix( this, KhanUtil.identityMatrix( this.dims[0], this.dims[0] ) );
		aug_mat = aug_mat.rref();
		
		// return the this.dims[0] x this.dims[0] submatrix on the right side
		return KhanUtil.getSubmatrix( aug_mat, [0, this.dims[0]], [aug_mat.dims[0], aug_mat.dims[1]] );
	},

	// row-reduce a matrix to stage ref, pre-rref, or rref 
	// if track_steps is truthy, 'steps' in the return value will consist of
	// a list of steps used during 'downward_elimination', 'upward_elimination', and 'normalization'.
	// Possible steps are 
	//   * 'swap': 		'row1' <-> 'row2'
	//   * 'add_mul': 	'row1' -> 'row1' - 'coeff' * 'row2'
	//   * 'mul': 		'row' -> 'coeff' * 'row'
	_reduce_to_stage : function (stage, track_steps) {
		var self = this;
		
		track_steps = track_steps ? true : false;
		//keep track of all the steps at each stage for hints
		var row_reduction_steps = {'downward_elimination':[], 'upward_elimination':[], 'normalization':[]};
		var curr_stage = row_reduction_steps['downward_elimination'];

		// component-wise subtraction of v1-m*v2 of two row vectors
		var substractMultipleOfVecs = function (v1, v2, m) {
			var ret = v1.slice(); 	//make a copy of v1
			var i;
			for (i in v2) {
				ret[i] -= m*v2[i];
			}
			return ret;
		};

		// pass in a 2d array and it returns the first
		// non-zero entry in column col in a 
		// row >= min_row.  If there are none, it returns
		// null.
		var findNonzeroEntry = function (array, col, min_row) {
			for (var i = min_row; i < array.length; i++) {
				if (Math.abs(array[i][col]) > self.ZERO_TOLERANCE) {
					return i;
				}
			}
			return null;
		};

		// uses the pivot in position row,col to zero all entries below 
		var zeroBelow = function (array, row, col) {
			for (var i = row + 1; i < array.length; i++) {
				if ( array[i][col] !== 0 ) {
					var coeff = array[i][col]/array[row][col];
					array[i] = substractMultipleOfVecs(array[i], array[row], coeff);
					if ( track_steps ) { curr_stage.push({'operation': 'add_mul', 'row1': row, 'row2': i, 'coeff': -coeff, 'matrix': new KhanUtil.Matrix(array)}); }
				}
			}
		};

		var zeroAbove = function (array, row, col) {
			for (var i = row - 1; i >= 0; i--) {
				if ( array[i][col] !== 0 ) {
					var coeff = array[i][col]/array[row][col];
					array[i] = substractMultipleOfVecs(array[i], array[row], coeff);
					if ( track_steps ) { curr_stage.push({'operation': 'add_mul', 'row1': row, 'row2': i, 'coeff': -coeff, 'matrix': new KhanUtil.Matrix(array)}); }
				}
			}
		};

		var swapRows = function (array, row1, row2) {
			var tmp = array[row1];
			array[row1] = array[row2];
			array[row2] = tmp;
		}

		// do the actual row reduction 
		var curr_stage = row_reduction_steps['downward_elimination'];
		
		var new_array = deepCopyArray(this.array);
		var pivot_row = 0, pivot_pos = [], num_row_swaps = 0;
		for (var pivot_col = 0; pivot_col < new_array[0].length; pivot_col++) {
			var non_zero_row = findNonzeroEntry(new_array, pivot_col, pivot_row);
			if ( non_zero_row != null ) {
				//move a row with non-zero leading entry into the pivot position
				if ( pivot_row != non_zero_row ) {
					swapRows(new_array, pivot_row, non_zero_row);
					num_row_swaps += 1;
					if ( track_steps ) { curr_stage.push({'operation': 'swap', 'row1': pivot_row, 'row2': non_zero_row, 'matrix': new KhanUtil.Matrix(new_array)}); }
				}
				zeroBelow(new_array, pivot_row, pivot_col);
				pivot_pos.push({'row':pivot_row, 'col':pivot_col});  //if we used this as a pivot, add it to the list
				pivot_row += 1;
			}
		}
		//if we only want row-echelon form, we've already got it!
		if ( stage == 'ref' ) {
			return {'matrix': new KhanUtil.Matrix(new_array), 'row_swaps': num_row_swaps, 'pivot_col': pivot_pos, 'steps': row_reduction_steps};
		}

		// continue reducing until we get to pre-rref 
		//since we already know exactly where our pivots are, this is really easy
		
		curr_stage = row_reduction_steps['upward_elimination'];
		
		map(pivot_pos, function(pos){ zeroAbove(new_array, pos['row'], pos['col']); });
		if ( stage == 'pre-ref') {
			return {'matrix': new KhanUtil.Matrix(new_array), 'row_swaps': num_row_swaps, 'pivot_col': pivot_pos, 'steps': row_reduction_steps};
		}

		// continue to full rref 
		//once again, we know what our pivot rows are, so this is really easy
		
		curr_stage = row_reduction_steps['normalization'];
		
		map(pivot_pos, function (pos) { 
			var pivot_val = new_array[pos['row']][pos['col']];
			new_array[pos['row']] = map(new_array[pos['row']], function(x){ return x/pivot_val; });
			if ( track_steps ) { curr_stage.push({'operation': 'mul', 'row': pos['row'], 'coeff': 1/pivot_val, 'matrix': new KhanUtil.Matrix(new_array)}); }
		});
		return {'matrix': new KhanUtil.Matrix(new_array), 'row_swaps': num_row_swaps, 'pivot_col': pivot_pos, 'steps': row_reduction_steps};
	}
});

// set up the SymbolicMatrix class
// A SymbolicMatrix keeps all entries as strings
// and applies operations symbolically.  e.g.,
// [[1]]+[[2]] = [['1+2']] */
KhanUtil.SymbolicMatrix = function(m){ 
	if ( !(this instanceof KhanUtil.SymbolicMatrix) ) {
		return new KhanUtil.SymbolicMatrix(m);
	}
	//make sure that when we are constructed, our inheritence is also carried over
	this.constructor = KhanUtil.SymbolicMatrix; 
	//initialize
	this.init(m); 
};
KhanUtil.SymbolicMatrix.prototype = jQuery.extend( new AbstractMatrx(), {
	//math functions that are used when manipulating entries
	//these are abstraced so SymbolicMatrix and Matrix can use the same
	//matrix multiplication and matrix addition functions
	_math : {
		add : function (a,b) {
			return ['+', a, b];
		},
		mul : function (a,b) {
			return ['*', a, b];
		}
	},

	//applied to each enry when formatMatrix is called
	format_entry : function (x) {
		if (!KhanUtil.expr) {
			throw "expressions package not loaded."
		}
		return KhanUtil.expr(x);
	}
});

jQuery.extend(KhanUtil, {
	/* Returns a SymbolicMatrix version of mat with latex color
	 * formatting applied.  row,col use slicing notation.
	 * i.e., row=':' will color that entire row and col=':'
	 * will color the entire column.  if row,col=':',':'
	 * the whole matrix will be colored */
	colorizeMatrix : function(mat, color, row, col){
		var SymbolicMatrix = KhanUtil.SymbolicMatrix;
		/* set row, col to the defualt values if they're undefined */
		if(typeof row === 'undefined'){ row = ':'; }
		if(typeof col === 'undefined'){ col = ':'; }

		/* wraps whatever value we pass in in a color tag */
		var apply_color = function(x){
			return ['color', color, x];
		}

		var new_array = deepCopyArray(mat.array);
		if(row == ':' && col == ':'){
			new_array = map(new_array, function(x){
				return map(x, apply_color);
			});
		}else if(row == ':' && col != ':'){
			var apply_color_to_col = function(x){ 
				x[col] = apply_color(x[col]);
				return x;
			};
			new_array = map(new_array, apply_color_to_col);
		}else if(row != ':' && col == ':'){
			new_array[row] = map(new_array[row], apply_color);
		}else{ //no slicing, just change the single entry
			new_array[row][col] = apply_color(new_array[row][col]);
		}
		
		return new SymbolicMatrix(new_array);
	},
	
	//return a matrix where row i is colored colors[i]
	//excess any extra colors in colors is ignored.
	colorizeMatrixRows : function (mat, colors) {
		var ret = KhanUtil.colorizeMatrix( mat, colors[0], 0, ':' );
		//do this in a super lazy way, by just repeatedly calling colorizeMatrix
		for (var i = 1; i < Math.min(mat.dims[0], colors.length); i++) {
			ret = KhanUtil.colorizeMatrix(ret, colors[i], i, ':');
		}
		return ret;
	},
	
	//return a matrix where column i is colored colors[i]
	//excess any extra colors in colors is ignored.
	colorizeMatrixCols : function (mat, colors) {
		var ret = KhanUtil.colorizeMatrix( mat, colors[0], ':', 0 );
		//do this in a super lazy way, by just repeatedly calling colorizeMatrix
		for (var i = 1; i < Math.min(mat.dims[1], colors.length); i++) {
			ret = KhanUtil.colorizeMatrix(ret, colors[i], ':', i);
		}
		return ret;
	},

	//return a matrix where each entry in _entries_ is colored _color_
	//entries should be a list of elements of the form [row,col]
	colorizeMatrixEntries : function (mat, color, entries) {
		var ret = mat;
		//do this in a super lazy way, by just repeatedly calling colorizeMatrix
		for (var i = 0; i < entries.length; i++) {
			ret = KhanUtil.colorizeMatrix(ret, color, entries[i][0], entries[i][1]);
		}
		return ret;
	},

	/* color a matrix's entries a specific color one by one.
	 * i.e., mat[0][0] is colored color_list[0],
	 * mat[0][1] is colored color_list[1], etc.
	 */
	colorizeMatrixAs : function(mat, color_list){
		var SymbolicMatrix = KhanUtil.SymbolicMatrix;

		var new_array = deepCopyArray(mat.array);
		var num_rows = mat.dims[0], num_cols = mat.dims[1];
		for(var i = 0; i < color_list.length && i < num_rows*num_cols; i++){
			var col = i % num_cols;
			var row = (i - col) / num_cols;
			new_array[row][col] = [ 'color', color_list[i], new_array[row][col] ];
		}
		
		return new SymbolicMatrix(new_array);
	},

	//returns a matrix where the cofactor specified
	//by pos=[row,col] is colored _color_
	colorizeCofactor : function (mat, pos, color) {
		//create a 2d array of coordinates
		var coord_array = [];
		for (var i = 0; i < mat.dims[0]; i++) {
			for (var j = 0; j < mat.dims[1]; j++) {
				if (i != pos[0] && j != pos[1]) {
					coord_array.push([i,j]);
				}
			}
		}
		coord_array.push(pos);
		return KhanUtil.colorizeMatrixEntries(mat, color, coord_array);
	},

	/* matrix to latex conversion. 
	 * braces is in ['[', '(', '|', ''].  Defaults to '['
	 */
	formatMatrix : function(mat, braces){
		var array = mat.array;
		var latex_brace = 'bmatrix';
		if(braces == '('){ latex_brace = 'pmatrix'; }
		if(braces == '|'){ latex_brace = 'vmatrix'; }
		if(braces == ''){ latex_brace = 'matrix'; }

		var transformed_rows = map(array, function(x){ return map(x, mat.format_entry).join(' & '); });
		return '\\begin{'+latex_brace+'}'+transformed_rows.join('\\\\')+'\\end{'+latex_brace+'}'

	},

	/* returns a rows x cols matrix with random values between range_low and range_hight */
	randRangeMatrix : function (rows, cols, range_low, range_high) {
		var new_array = [];
		for(var i = 0; i < rows; i++){
			var new_row = [];
			for(var j = 0; j < cols; j++){
				new_row.push(KhanUtil.randRange(range_low, range_high));
			}
			new_array.push(new_row);
		}
		return new KhanUtil.Matrix(new_array);

	},
	
	//returns a matrix of all zeros
	//type can be Matrix or SymbolicMatrix
	//defaults to Matrix
	zeroMatrix : function (rows, cols, type) {
		var Mat = KhanUtil.Matrix;
		if (type && type.constructor) {
			Mat = type.constructor;
		}
		
		//get a list of rows # of lists of zeros
		var new_array = map(range(rows), function(){
			//return a list of cols # of zeros
			return map(range(cols), function(){ return 0; });
		});
		return new Mat(new_array);
	},
	
	//returns a matrix with ones along the diagonal
	//if rows==cols, then the matrix will be an identity matrix
	//type can be Matrix or SymbolicMatrix
	//defaults to Matrix
	identityMatrix : function (rows, cols, type) {
		var Mat = KhanUtil.Matrix;
		if (type && type.constructor) {
			Mat = type.constructor;
		}
		
		//get a list of rows # of lists of zeros
		var new_array = map(range(rows), function(i){
			//return a list of cols # of zeros
			return map(range(cols), function(j){ return i==j ? 1 : 0; });
		});
		return new Mat(new_array);
	},

	//returns a matrix whose entries are a_ij where 'a'
	//is the letter specified by letter
	genericMatrix : function (rows, cols, letter) {
		if ( typeof letter === "undefined" ) {
			letter = 'a';
		}
		
		var new_array = map(range(rows), function(i){
			//return letter_{row col}. Matrix entries are 1-indexed, so add 1 to i,j.
			return map(range(cols), function(j){ return letter + "_{"+(i+1)+(j+1)+"}"; });
		});

		return new KhanUtil.SymbolicMatrix(new_array);

	},
	
	/* returns a sparse matrix with num_entries number of random non-zero terms */
	randSparseMatrix : function (rows, cols, num_entries, range_low, range_high) {
		var low = range_low, high = range_high;
		if (!range_low || !range_high) {
			low = -4;
			high = 4;
		}
		var mat = KhanUtil.zeroMatrix(rows, cols);

		//populate the matrix with random entries
		//TODO this method won't ensure num_entries number of entries 'cause there could be a collision.  Do a better way.
		//whatever fix there is, make sure it won't hang if num_entries > rows*cols
		for (var i = 0; i < num_entries; i++) {
			var pos = [KhanUtil.randRange(0,rows-1), KhanUtil.randRange(0,cols-1)];
			mat.array[pos[0]][pos[1]] = KhanUtil.randRange(low, high);
		}
		return mat;

	},

	//a,b should be points [row,col]
	//retuns the submatrix consisting of elements x
	//where a <= x < b
	getSubmatrix : function (mat, a, b) {
		var new_array = [];
		for (var i = a[0]; i < b[0]; i++) {
			var new_row = [];
			for (var j = a[1]; j < b[1]; j++) {
				new_row.push(mat.array[i][j]);
			}
			new_array.push(new_row);
		}

		return new mat.constructor(new_array);
	},

	//returns a list of {cofactor: A, coeff: x, sign: s}
	//where A is the cofactor matrix, x is the entry
	//used to make the cofactor, and s is the sign of that
	//position in the matrix
	getCofactors : function(mat){
		//by default, expand along the first row, so pop them off
		var xs = mat.array[0];
		var ret = [];
		for (var i = 0; i < xs.length; i++) {
			ret.push( KhanUtil.getCofactor(mat, [0,i]) );
		}
		return ret;
	},
	
	//returns {cofactor: A, coeff: x, sign: s}
	//where A is the cofactor matrix, x is the entry
	//used to make the cofactor, and s is the sign of that
	//position in the matrix
	getCofactor : function(mat, pos){
		//create a 2d array of coordinates
		var cofac_matrix = [];
		for (var i = 0; i < mat.dims[0]; i++) {
			var cofac_row = [];
			for (var j = 0; j < mat.dims[1]; j++) {
				//exclude the column we don't want
				if (j != pos[1]) {
					cofac_row.push(mat.array[i][j]);
				}
			}
			//exclude the row we don't want
			if (i != pos[0]) {
				cofac_matrix.push(cofac_row);
			}
		}

		return {
			cofactor: new mat.constructor(cofac_matrix),
			coeff: mat.array[pos[0]][pos[1]],
			sign: ((pos[0]+pos[1])%2 == 0 ? '+' : '-')
		};
	},

	//returns an augmented matrix [mat|aug_mat]
	//if aug_mat is a column vector and augments
	//vertically if aug_mat is a row vector
	augmentMatrix : function (mat, aug_mat) {
		var aug_array = aug_mat;
		if (aug_mat.array) {
			aug_array = aug_mat.array;
		}

		var new_array = deepCopyArray(mat.array);
		//if we are a row vector, append ourselves to the bottom
		if (aug_array.length == 1) {
			new_array.push(deepCopyArray(aug_array[0]));
		} else {
			if (new_array.length !== aug_array.length) { throw "Cannot augment matrix of size " + new_array.length + "x" + new_array[0].length + " with a matrix of size " + aug_array.length + "x" + aug_array[0].length + "."; }
			new_array = map(zip(new_array, aug_array), function(x){ return x[0].concat(deepCopyArray(x[1])); });
		}

		return new mat.constructor(new_array);
	},

	formatRowOperation : function (row_op) {
		var row1 = 'R_{' + (typeof row_op['row1'] === 'undefined' ? row_op['row'] + 1 : row_op['row1'] + 1) + '}';
		var row2 = 'R_{' + (row_op['row2'] + 1) + '}';

		var row_op_text = row1;

		switch ( row_op['operation'] ) {
			case 'mul':
				row_op_text += ' \\mapsto ' + 
						KhanUtil.expr(['*', 
								KhanUtil.decimalToFraction(row_op['coeff']),
								row1
							      ]);
			break;

			case 'add_mul':
				row_op_text += ' \\mapsto ' + 
						KhanUtil.expr(['+', 
								row1, 
								['*', KhanUtil.decimalToFraction(row_op['coeff']), row2]
							      ]);
			break;

			case 'swap':
				row_op_text += ' \\leftrightarrow ' + row2;
			break;

			default:
			throw "Unknown row operation " + row_o['operation'] + ".";
		}

		return row_op_text;
	},

	// shouldn't be here, but atm, doesn't seem to exist anywhere else 

	// if you pass in a negative number, it will be returned with parentheses 
	// needed because expressions doesn't recognize matrices, so it might put a \cdot when trying to multiply
	negParens : function (expr) {
		var num = KhanUtil.exprStripColor(expr);
		if (num.toString().charAt(0) == '-') {
			return '('+expr+')';
		}
		return expr;
	}

});
