module("matrices");

test( "Matrix Operations", function() {
	//this is the amount of error that is acceptable in numerical computations
	var ERROR_TOLERANCE = 0.0000001;

	var a = new KhanUtil.Matrix([[1,2],[3,4]]);
	var b = new KhanUtil.Matrix([[1,1],[-4,-4]]);
	var c = new KhanUtil.Matrix([[-4,1,9,-4],[1,1,2,3],[16,-5,4,0],[12,-17,1,2]]);
	var d = new KhanUtil.Matrix([[-4,1,9,-4],[1,1,2,3],[16,-5,4,0],[12, -4, 13, -4]]);
	var d_rref = new KhanUtil.Matrix([[1, 0, 0, 0.9354838709677418], [0, 1, 0, 2.7281105990783407], [0, 0, 1, -0.3317972350230415], [0, 0, 0, 0]]);

	//equality
	equals( a.equal(a), true, "Matrix-Matrix equals comparison" );
	equals( a.equal([[1,2],[3,4]]), true, "Matrix-Array equals comparison" );
	
	//arithmetic
	deepEqual( a.transpose().array, [[1,3],[2,4]], "Transpose" );
	deepEqual( a.add(b).array, [[2,3],[-1,0]], "Matrix plus matrix" );
	deepEqual( a.mul(b).array, [[-7,-7],[-13,-13]], "Matrix times matrix" );
	deepEqual( a.mul(3).array, [[3,6],[9,12]], "Matrix times scalar" );
	deepEqual( b.abs().array, [[1,1],[4,4]], "Matrix times scalar" );

	//operations
	equals( c.det(), -8134, "Negative Determinant" );
	equals( b.det(), 0, "Zero Determinant" );
	equals( c.trace(), 3, "Trace" );
	deepEqual( c.rref().array, [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]], true, "rref non-singular" );
	//subtract d.rref() from the precomputed result and make sure that the sum-total of the error is within acceptable levels
	equals( d.rref().add(d_rref.mul(-1)).abs().sum() < ERROR_TOLERANCE , true, "rref singular" );
	deepEqual( a.inverse().array, [[-2,1],[1.5,-0.5]], "Matrix inverse" );

	//elementary row operations
	deepEqual( a.multiply_row_by_const(0, 2).array, [[2,4],[3,4]], "Elementary Op: Multiply first row by two" )
	deepEqual( a.swap_two_rows(0, 1).array, [[3,4],[1,2]], "Elementary Op: Swap row 1 and row 2" )
	deepEqual( a.add_mul_of_one_row_to_another(2, 1, 0).array, [[7,10],[3,4]], "Elementary Op: Swap row 1 and row 2" )

	//retrieval 
	deepEqual( c.diag(), [-4,1,4,2], "Get diagonal" );
	equals( c.get(2,2), 4, "Get element" );
	deepEqual( c.get(":",2), [9,2,4,1], "Get column" );
	deepEqual( c.get(2,":"), [16,-5,4,0], "Get row" );
});

test( "Matrix Formating", function() {
	var a = new KhanUtil.Matrix([[1,2],[3,4]]);

	//equality
	equals( a.toCode('['), "\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}", "Matrix Latex formatting with [" );
	equals( a.toCode('('), "\\begin{pmatrix}1 & 2\\\\3 & 4\\end{pmatrix}", "Matrix Latex formatting with (" );
	equals( a.toCode('|'), "\\begin{vmatrix}1 & 2\\\\3 & 4\\end{vmatrix}", "Matrix Latex formatting with |" );
	equals( a.toCode(''), "\\begin{matrix}1 & 2\\\\3 & 4\\end{matrix}", "Matrix Latex formatting with no braces" );
	
	//color
	equals( KhanUtil.colorizeMatrix(a, 'blue').toCode('['), "\\begin{bmatrix}\\color{blue}{1} & \\color{blue}{2}\\\\\\color{blue}{3} & \\color{blue}{4}\\end{bmatrix}", "Matrix colorize entries blue" );
});

test( "Matrix Utilities", function() {
	var a = new KhanUtil.Matrix([[1,2],[3,4]]);
	var c = new KhanUtil.Matrix([[-4,1,9,-4],[1,1,2,3],[16,-5,4,0],[12,-17,1,2]]);

	//matrix creation
	deepEqual( KhanUtil.zeroMatrix(2,3).array, [[0,0,0],[0,0,0]], "2x3 zero matrix" );
	deepEqual( KhanUtil.identityMatrix(3,3).array, [[1,0,0],[0,1,0],[0,0,1]], "3x3 identity matrix" );
	deepEqual( KhanUtil.getSubmatrix(c, [1,1], [4,4]).array, [[1,2,3],[-5,4,0],[-17,1,2]], "Extract sub matrix" );
	deepEqual( KhanUtil.augmentMatrix(a,a).array, [[1,2,1,2],[3,4,3,4]], "Augment matrix" );

	equals( Math.abs(KhanUtil.randMatrixWithDet(4,3).det()), 4, "Random 3x3 matrix with determinant = +-4" );
	equals( Math.abs(KhanUtil.randMatrixWithDet(12,4).det()), 12, "Random 4x4 matrix with determinant = +-12" );
});
