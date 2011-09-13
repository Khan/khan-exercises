function lineLength( line ){
	var a = line[ 0 ];
	var b = line[ 1 ];
	return Math.sqrt( ( a[ 0 ] - b[ 0 ] ) * ( a[ 0 ] - b[ 0 ] )  + ( a[ 1 ] - b[ 1 ] ) * ( a[ 1 ] - b[ 1 ] ) );
}

function isPointOnLineSegment( l, p, precision ){
    var precision = precision || 0.1;
	//If line is vertical
    if( Math.abs( l[ 1 ][ 0 ] - l[ 0 ][ 0 ] ) < precision ){
        return ( Math.abs( p[ 0 ] - l[ 0 ][ 0 ] ) < precision ) && ( p[1] <= ( Math.max( l[ 1 ][ 1 ], l[ 0 ][ 1 ] ) + precision ) ) && ( p[1] >= ( Math.min( l[ 1 ][ 1 ], l[ 0 ][ 1 ] ) - precision ) );
    }
    var m = ( l[ 1 ][ 1 ] - l[ 0 ][ 1 ] ) / ( l[ 1 ][ 0 ] - l[ 0 ][ 0 ] );
    var k = l[ 0 ][ 1 ] - m * l[ 0 ][ 0 ];
    return ( Math.abs( m * p[ 0 ] + k - p[ 1 ] ) < precision ) ;
}

function findPointsOnLine( l, ps ){
    var points = [];
    var ps = ps || [];
    var i = 0;
    for ( i = 0; i < ps.length; i ++ ){
        if ( isPointOnLineSegment( l, ps[ i ] ) ){
                points.push( ps[ i ] );
        }
    }
    return points;
}

//Does not currently work with 2 points on one side
function splitPath( p, points ){
    var i = 0;
    var paths = [];
    var tempPath =  [];
    for( i = 0; i < p.graphiePath.length - 1; i++ ){
        if ( findPointsOnLine( [ p.graphiePath[ i ], p.graphiePath[ i + 1 ] ], points ).length == 0 ){
            tempPath.push( p.graphiePath[ i ] ) ;
        }
        else{
            var point = findPointsOnLine( [ p.graphiePath[ i ], p.graphiePath[ i + 1 ] ], points )[ 0 ];
            tempPath.push( p.graphiePath[ i ] ) ;
            tempPath.push( point );
            paths.push( tempPath );
            tempPath = [ point ];
            points.splice( points.indexOf( point ), 1 );
        }
    }
    tempPath.push( p.graphiePath[ i ] )
    paths.push( tempPath );
    return paths;
}

function findIntersection( a, b ){

    var tY = [ 0, a[ 0 ][ 1 ], a[ 1 ][ 1 ], b[ 0 ][ 1 ], b[ 1 ][ 1 ] ];
    var tX = [ 0, a[ 0 ][ 0 ], a[ 1 ][ 0 ], b[ 0 ][ 0 ], b[ 1 ][ 0 ] ];

    var denominator = ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 2 ] - tX[ 1 ] ) - (tX[ 4 ] - tX[ 3 ] ) * ( tY[ 2 ] - tY[ 1 ] );
    var ua = ( ( tX[ 4] - tX[ 3 ] ) * ( tY[ 1 ] - tY[ 3 ] ) - ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 1 ] - tX [ 3 ]) ) / denominator;
    var ub = ( ( tX[ 2 ] - tX[ 1 ] ) * ( tY[ 1 ] - tY[ 3 ] ) - ( tY[ 2 ] - tY[ 1 ] ) * ( tX[ 1 ] - tX[ 3 ] ) ) / denominator;
    var isContained = ( ua >= -0.01 )  && ( ua <= 1.01 ) && ( ub >= -0.01 ) && ( ub <= 1.01 );
    return [ tX[ 1 ] + ua * ( tX[ 2 ] - tX[ 1 ] ), tY[ 1 ] + ua * ( tY[ 2 ] - tY[ 1 ] ), isContained ];

}


function checkDuplicate( arr, el ){
    var i = 0;
    for ( i = 0; i < arr.length; i ++ ){
        if ( Math.sqrt( ( arr[ i ][ 0 ]  - el[ 0 ] ) * ( arr[ i ][ 0 ]  - el[ 0 ] ) + ( arr[ i ][ 1 ]  - el[ 1 ] ) * ( arr[ i ][ 1 ]  - el[ 1 ] ) ) < 0.1 ){
            return true;
        }
    }
    return false;
}


function pointLineDistance( p, l ){
    var y = [ l[ 0 ][ 1 ], l[ 1 ][ 1 ] ];
    var x = [ l[ 0 ][ 0 ], l[ 1 ][ 0 ] ];
    var num = ( y[ 0 ] - y[ 1 ]) * p[ 0 ] + ( x[ 1 ] - x[ 0 ] )* p[ 1 ] + ( x[ 0 ]* y[ 1 ] - x[ 1 ] * y[ 0 ] );
    var den = Math.sqrt( ( x[ 1 ]- x[ 0 ] ) * ( x[ 1 ]- x[ 0 ] ) + ( y[ 1] - y[ 0 ] ) * ( y [ 1 ] - y[ 0 ] ) );
    return num/den;
}

function reflectPoint( l, p ){
    var m = ( l[ 1 ][ 1 ] - l[ 0 ][ 1 ] ) / ( l[ 1 ][ 0 ] - l[ 0 ][ 0 ] );
    var k = l[ 0 ][ 1 ] - m * l[ 0 ][ 0 ];
    var d = ( p[0] + ( p[1] - k ) * m )/( 1 + m*m);
    return ( [ 2 * d - p[ 0 ],  2 * d * m - p[1] + 2 * k ] );
}


function linePathIntersection( l, p ){
    var points = [];
    var ps = p.graphiePath;
    var l = l.graphiePath;
    var i = 0;
    for( i = 0; i < ps.length-1; i++ ){
        var x = findIntersection( [ ps[ i ], ps[ i + 1 ] ], l );
        if ( x[ 2 ] === true  && ! checkDuplicate( points, [ x[ 0 ], x[ 1 ] ] ) ){
            points.push( [  x[ 0 ],  x[ 1 ] ] );
            }
    }
    return points;

}

function degToRad( deg ){
	return deg * Math.PI/180;
}

//Returns [ m, k ] of y = mx + k
function lineEquation( line ){
	var x = [ line[ 0 ][ 0 ], line[ 1 ][ 0 ] ];
	var y = [ line[ 0 ][ 1 ], line[ 1 ][ 1 ] ];

    var m = ( line[ 1 ][ 1 ] - line[ 0 ][ 1 ] ) / ( line[ 1 ][ 0 ] - line[ 0 ][ 0 ] );
    var k = line[ 0 ][ 1 ] - m * line[ 0 ][ 0 ];
	
    return  [ m, k ];

}

function lineSegmentFromLine( start, line, amount ){

	var eq = lineEquation( line );	
	var m = eq[ 0 ];
	var angle = Math.atan( m );	
	return [ start, [ start[ 0 ] +  Math.cos( angle ) * amount, start[ 1 ] + Math.sin( angle ) * amount ] ]; 

}

function parallelLine( line, point ){

	var dif = [ point[ 0 ] - line[ 0 ][ 0 ], point[ 1 ] - line[ 0 ][ 1 ] ];

	return [ point, [ line[ 1 ][ 0 ] + dif[ 0 ],  line[ 1 ][ 1 ] + dif[ 1 ] ] ]; 

}

function angleBisect( line1, line2, scale ){

	var intPoint = findIntersection( line1, line2 );
	var l1 = [];
	var l2 = [];

	if( ( line1[ 1 ][ 0 ] - line1[ 0 ][ 0 ] ) >= 0  ){
		l1 = lineSegmentFromLine( intPoint, line1, scale );	
	}
	else{
		l1 = lineSegmentFromLine( intPoint, line1, -scale );	
	}
	if( ( line2[ 1 ][ 0 ] - line2[ 0 ][ 0 ] ) >= 0  ){
		l2 = lineSegmentFromLine( intPoint, line2, scale );
	}
	else{
		l2 = lineSegmentFromLine( intPoint, line2, -scale );	
	}
	return [ intPoint, parallelLine( l1, l2[ 1 ] )[ 1 ] ];

}

function lineMidpoint( line ){
	return  [ ( line[ 0 ][ 0 ] + line[ 1 ][ 0 ] ) / 2, ( line[ 0 ][ 1 ] + line[ 1 ][ 1 ] ) / 2 ] 
}

function vectorProduct( line1, line2 ){
	var x1 = line1[ 1 ][ 0 ] - line1[ 0 ][ 0 ];
	var x2 = line2[ 1 ][ 0 ] - line2[ 0 ][ 0 ];
	var y1 = line1[ 1 ][ 1 ] - line1[ 0 ][ 1 ];
	var y2 = line2[ 1 ][ 1 ] - line2[ 0 ][ 1 ];
	return  x1 * y2  - x2 * y1;
}

function Quadrilateral( center, angles, sideRatio, labels, size ){

    this.sideRatio = sideRatio;

    this.graph = KhanUtil.currentGraph;
    this.angles = angles;
	this.radAngles = $.map( angles, degToRad );
    this.scale = 1;
    this.rotation = 0;
    this.center = center;
    this.x = center[ 0 ];
    this.y = center[ 1 ];
    this.rotationCenter = [ center[ 0 ], center[ 1 ] ];
    this.set = KhanUtil.currentGraph.raphael.set();
	this.size = 10;
    this.cosines = $.map( this.radAngles, Math.cos );
    this.sines = $.map( this.radAngles, Math.sin );
    this.labels = labels || {};
	this.sides = [];

	this.generatePoints = function(){
		var once = false;
		while( ( ! once ) || this.isCrossed()  ){
			var len = Math.sqrt( 2 * this.scale * this.scale * this.sideRatio * this.sideRatio  - 2 * this.sideRatio * this.scale * this.scale * this.sideRatio * this.cosines[ 3 ] );
			once = true;
			var tX = [ 0,  this.scale * this.sideRatio * this.cosines[ 0 ] , len * Math.cos( ( this.angles[ 0 ] - ( 180 - this.angles[ 3 ] )/ 2 ) * Math.PI/180 ),  this.scale, this.scale + Math.cos( ( 180 - this.angles[ 1 ] ) * Math.PI / 180 ) ];

			var tY = [ 0,  this.scale * this.sideRatio * this.sines[ 0 ] , len * Math.sin( ( this.angles[ 0 ] - ( 180 - this.angles[ 3 ] )/ 2 ) *  Math.PI/180 ), 0,  Math.sin( ( 180 - this.angles[ 1 ] ) * Math.PI / 180 ) ];

			var denominator = ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 2 ] - tX[ 1 ] ) - (tX[ 4 ] - tX[ 3 ] ) * ( tY[ 2 ] - tY[ 1 ] );

			var ua = ( ( tX[ 4] - tX[ 3 ] ) * ( tY[ 1 ] - tY[ 3 ] ) - ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 1 ] - tX [ 3 ]) ) / denominator;

			this.points = [ [ this.x, this.y ], [ this.x + this.scale * this.sideRatio * this.cosines[ 0 ], this.y + this.scale * this.sideRatio * this.sines[ 0 ] ], [ this.x + tX[ 1 ] + ua * ( tX[ 2 ] - tX[ 1 ] ), this.y + tY[ 1 ] + ua * ( tY[ 2 ] - tY[ 1 ] ) ], [ this.x +  this.scale, this.y ] ];

			this.sides = [ [ this.points[ 0 ], this.points[ 3 ] ], [ this.points[ 3 ], this.points[ 2 ] ], [ this.points[ 2 ], this.points[ 1 ] ], [ this.points[ 1 ], this.points[ 0 ] ] ];

			if(  vectorProduct( [ this.points[ 0 ], this.points[ 1 ] ], [ this.points[ 0 ], this.points[ 2 ] ] ) > 0 ){
				this.sideRatio -= 0.3 ;
			}
			if(  vectorProduct( [ this.points[ 0 ], this.points[ 3 ] ], [ this.points[ 0 ], this.points[ 2 ] ] ) < 0 ){
				this.sideRatio += 0.3 ;
			}
	}

	}
	
	this.isCrossed = function(){
		return ( vectorProduct( [ this.points[ 0 ], this.points[ 1 ] ], [ this.points[ 0 ], this.points[ 2 ] ] ) > 0 ) || ( vectorProduct( [ this.points[ 0 ], this.points[ 3 ] ], [ this.points[ 0 ], this.points[ 2 ] ] ) < 0 );
	}

	this.generatePoints();

	var area = 0.5 *  vectorProduct( [ this.points[ 0 ], this.points[ 2 ] ], [ this.points[ 3 ], this.points[ 1 ] ] );
	this.scale = this.scale *  Math.sqrt( this.size/area );
	this.generatePoints();
	
	area = 0.5 *  vectorProduct( [ this.points[ 0 ], this.points[ 2 ] ], [ this.points[ 3 ], this.points[ 1 ] ] );
    this.draw = function(){
        this.set.push( this.graph.path( this.points.concat( [ this.points[ 0 ] ] ) ) );
        return this.set;
    }
	
	this.drawLabels = function(){
		var i = 0;
		if ( "angles" in this.labels ){	
			this.createLabel( angleBisect( [ this.points[ 0 ], this.points[ 3 ] ], [ this.points[ 0 ], this.points[ 1 ] ] , 1 )[ 1 ], this.labels.angles[ 0 ] );
			this.createLabel( angleBisect( [ this.points[ 1 ], this.points[ 2 ] ], [ this.points[ 1 ], this.points[ 0 ] ] , 1 )[ 1 ], this.labels.angles[ 3 ] );
			this.createLabel( angleBisect( [ this.points[ 2 ], this.points[ 1 ] ], [ this.points[ 2 ], this.points[ 3 ] ] , 1 )[ 1 ], this.labels.angles[ 2 ] );
			this.createLabel( angleBisect( [ this.points[ 3 ], this.points[ 0 ] ], [ this.points[ 3 ], this.points[ 2 ] ] , 1 )[ 1 ], this.labels.angles[ 1 ] );
		}
		if ( "sides" in this.labels ){
			for( i = 0; i < 4; i++){
				//http://www.mathworks.com/matlabcentral/newsreader/view_thread/142201
				var midPoint = lineMidpoint( this.sides[ i ] );
				var t =lineLength( [ this.sides[ i ][ 1 ],  midPoint ] );
				var d = 0.5;
				var x3 = midPoint[ 0 ] + ( this.sides[ i ][ 1 ][ 1 ] - midPoint[ 1 ] )/ t * d ;
				var y3 = midPoint[ 1 ] - ( this.sides[ i ][ 1 ][ 0 ]- midPoint[ 0 ]) / t * d ;	
				this.createLabel( [ x3, y3 ], this.labels.sides[ i ] );
			}
		}
	}

	this.angleScale = function ( ang ){
		if( ang > 90 ){
			return 0.5;
		}
		else if ( ang > 40 ){
			return 0.6;
		}
		else if ( ang < 25 ){
			return 1.4;
		}
		return 1;
	}

	this.createLabel = function( p, v ){
			this.set.push( this.graph.label( p , v ) );
	}
}

function Triangle( center, angles, sides, scale, labels ){

    this.labels = labels;
    this.graph = KhanUtil.currentGraph;
    this.angles = angles;
	this.radAngles = $.map( angles, degToRad );
    this.scale = ( scale || 3 );
    this.rotation = 0;
    this.x = center[ 0 ];
    this.y = center[ 1 ];
    this.cosines = $.map( this.radAngles, Math.cos );
    this.sines = $.map( this.radAngles, Math.sin );
    var a = Math.sqrt( ( 2 * this.scale * this.sines[ 1 ] ) / (this.sines[ 0 ] * this.sines[ 2 ])  ) ;
    var b = a * this.sines[ 2 ] / this.sines[ 1 ];

    this.points = [ [ this.x, this.y ], [  b  + this.x, this.y ], [ this.cosines[ 0 ] * a + this.x, this.sines[ 0 ] * a  + this.y  ] ];
    
    this.set = KhanUtil.currentGraph.raphael.set();
    
	this.angleScale = function ( ang ){
		if( ang > 90 ){
			return 0.5;
		}
		else if ( ang > 40 ){
			return 0.6;
		}
		else if ( ang < 25 ){
			return 1.4;
		}
		return 1;
	}

    this.draw = function(){
        this.set.push( this.graph.path( this.points.concat( [ this.points[ 0 ] ] ) ) );
        return this.set;
	}

	this.createLabel = function( p, v ){
			this.set.push( this.graph.label( this.rotatePoint( p ) , v ) );
	}

    this.drawLabels = function(){
        if ( "name" in this.labels ){
            this.createLabel( [ this.points[ 0 ][ 0 ] - 0.5, this.points[ 0 ][ 1 ] ] , labels.name );
        }
        if ( "c" in this.labels ){
            this.createLabel( [ ( this.points[ 0 ][ 0 ] + this.points[ 1 ][ 0 ] ) / 2,  ( this.points[ 0 ][ 1 ] + this.points[ 1 ][ 1 ] ) / 2 - 0.4 ]  , labels.c );
        }
        if ( "a" in this.labels ){
            this.createLabel( [ ( this.points[ 1 ][ 0 ] + this.points[ 2 ][ 0 ] ) / 2 + 0.4, ( this.points[ 1 ][ 1 ] + this.points[ 2 ][ 1 ] ) / 2  ] , labels.a );
        }
        if ( "b" in this.labels ){
            this.createLabel( [ ( this.points[ 0 ][ 0 ] + this.points[ 2 ][ 0 ] ) / 2 - 0.4, ( this.points[ 0 ][ 1 ] + this.points[ 2 ][ 1 ] ) / 2 ] , labels.b );
        }
        if ( "A" in this.labels ){
            this.createLabel( [ this.points[ 0 ][ 0 ] - 0.3, this.points[0][1] ] , labels.A );
        }
        if ( "B" in this.labels ){
            this.createLabel( [ this.points[ 1 ][ 0 ] + 0.3 , this.points[ 1 ][ 1 ] + 0.2 ], labels.B );
        }
		if ( "C" in this.labels ){
            this.createLabel( [ this.points[ 2 ][ 0 ] + 0.2 , this.points[ 2 ][ 1 ] - 0.2 ], labels.C );
		}
        if ( "CAB" in this.labels ){
            this.createLabel( [ this.points[ 0 ][ 0 ] +  this.angleScale( this.angles[ 0 ]  ) * Math.cos( this.angles[ 0 ] / 2 * Math.PI / 180 ), this.points[ 0 ][ 1 ] +  this.angleScale( this.angles[ 0 ]  ) * Math.sin( this.angles[ 0 ] / 2 * Math.PI / 180 ) ], labels.CAB );
        }
        if ( "ABC" in this.labels ){
            this.createLabel( [ this.points[ 1 ][ 0 ] + this.angleScale( this.angles[ 1 ] )  * Math.cos( ( 180 - this.angles[ 1 ] / 2 ) * Math.PI / 180 ), this.points[ 1 ][ 1 ] + this.angleScale( this.angles[ 1 ]  ) * Math.sin( ( 180 - this.angles[ 1 ] / 2 ) * Math.PI / 180 ) ] , labels.ABC );
        }
        if ( "BCA" in this.labels ){
            this.createLabel( [ this.points[ 2 ][ 0 ] +  this.angleScale( this.angles[ 2 ] )  * Math.cos( ( 180 + this.angles[ 0 ] + this.angles[ 2 ] / 2 ) * Math.PI / 180 ), this.points[ 2 ][ 1 ] +   this.angleScale( this.angles[ 2 ] ) * Math.sin( ( 180 + this.angles[ 0 ] + this.angles[ 2 ] / 2 ) * Math.PI / 180 ) ], labels.BCA );
        }

        return this.set;
    }

	this.sides = [ lineLength( [ this.points[ 1 ], this.points[ 2 ] ]), lineLength( [ this.points[ 0 ], this.points[ 2 ] ] ), lineLength( [ this.points[ 0 ], this.points[ 1 ] ] ) ]

	this.findCenterPoints = function(){
		var Ax = this.points[ 0 ][ 0 ];
		var Ay = this.points[ 0 ][ 1 ];
		var Bx = this.points[ 1 ][ 0 ];
		var By = this.points[ 1 ][ 1 ];
		var Cx = this.points[ 2 ][ 0 ];
		var Cy = this.points[ 2 ][ 1 ];
		var D = 2 * ( Ax * ( By - Cy ) + Bx * ( Cy - Ay ) + Cx * ( Ay - By ));
		var a = this.sides[ 0 ];
		var b = this.sides[ 1 ];
		var c = this.sides[ 2 ];
		var P = a + b + c;
		var x1 = ( a * Ax + b * Bx + c * Cx ) / P;
		var y1 = ( a * Ay + b * By + c * Cy ) / P;	
		var x = (( Ay * Ay + Ax * Ax ) * ( By - Cy ) + ( By * By + Bx * Bx ) * ( Cy - Ay ) + ( Cy * Cy  + Cx * Cx) * ( Ay - By )) / D; 
		var y = (( Ay * Ay + Ax * Ax ) * ( Cx - Bx ) + ( By * By + Bx * Bx ) * ( Ax- Cx ) + ( Cy * Cy + Cx * Cx ) * ( Bx - Ax ))/D;
		this.circumCenter = [ x, y ];  
		this.centroid =  [ 1/3 * ( Ax + Bx + Cx ), 1/3 * ( Ay + By + Cy ) ];
		this.inCenter = [ x1, y1 ];
	}

	this.findCenterPoints();

    this.rotationCenter = this.centroid;
	
    this.rotate = function( amount ){
        this.set.rotate( amount, this.graph.scalePoint( this.rotationCenter )[0] , this.graph.scalePoint( this.rotationCenter )[1] );
        this.rotation = amount * Math.PI / 180;
    }

    this.rotatePoint = function ( pos, theta ){
		var theta = theta || this.rotation; 
        return [ this.rotationCenter[ 0 ] + ( pos[ 0 ] - this.rotationCenter[ 0 ] ) * Math.cos( theta )  +  ( pos[ 1 ] -  this.rotationCenter[ 1 ] ) * Math.sin( theta ),  this.rotationCenter[ 1 ] + ( -1 ) *  ( ( pos[ 0 ] -  this.rotationCenter[ 0 ] ) * Math.sin( theta ) ) + ( ( pos[ 1 ] -  this.rotationCenter[ 1 ] ) * Math.cos( theta ) ) ];
    }

}


var randomQuadAngles = {
		square: function(){
			return [ 90, 90, 90, 90 ];
		},
		
		rectangle: function(){
			return [ 90, 90, 90, 90 ];
		},
		rhombus: function(){
			var angA =  KhanUtil.randRange( 30, 160 );
			var angB = 180 - angA;
			return [ angA, angB , angA , angB ];
		},
		parallelogram: function(){
			var angA =  KhanUtil.randRange( 30, 160 );
			var angB = 180 - angA;
			return  [ angA, angB ,angA ,angB ];
		},
		trapezoid: function(){
			var angA =  KhanUtil.randRange( 30, 160 );
			var angB = 180 - angA;
			var angC =  KhanUtil.randRange( 30, 160 );
			var angD = 180 - angC;
			return  [ angA, angC , angD , angB ];
		},
		isoscelesTrapezoid: function(){
			var angC =  KhanUtil.randRange( 30, 160 );
			var angD = 180 - angC;
			return  [ angC, angC , angD , angD ];
		},

		kite: function(){
			var angA = KhanUtil.randRange( 90, 140 );
			var angB = KhanUtil.randRange( 30, ( 360 - ( 2 * angA ) ) - 30 );
			var angC = 360 - angB - 2 * angA;
			return [ angB, angA , angC , angA ];
		}
}

function newSquare( center ){
	var center = center || [ 0, 0 ];
	return new Quadrilateral( center, randomQuadAngles.square(),  1 , "", 3 );
}

function newRectangle( center ){
	var center = center || [ 0, 0 ];
	return  new Quadrilateral( center, randomQuadAngles.rectangle() ,  KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newRhombus( center ){
	var center = center || [ 0, 0 ];
	return new Quadrilateral( center, randomQuadAngles.rhombus(),1  , "", 3 );
}

function newParallelogram( center ){
	var center = center || [ 0, 0 ];
	return  new Quadrilateral( center, randomQuadAngles.parallelogram(), KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newTrapezoid( center ){
	var center = center || [ 0, 0 ];
	return  new Quadrilateral( center, randomQuadAngles.trapezoid(),  KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newKite( center ) {
	var center = center || [ 0, 0 ];
	var angA = KhanUtil.randRange( 90, 140 );
	var angB = KhanUtil.randRange( 30, ( 360 - ( 2 * angA ) ) - 30 );
	var angC = 360 - angB - 2 * angA;
	return  new Quadrilateral( center, randomQuadAngles.kite(), 1 , "", 2 );
}

