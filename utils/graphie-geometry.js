function isPointOnLineSegment( l, p, precision ){
    var precision = precision || 0.1;
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
    return false
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

function Quadrilateral( center, angles, sideRatio, labels, scale ){

    this.sideRatio = sideRatio;
    this.labels = labels;
    this.graph = KhanUtil.currentGraph;
    this.angles = angles;
    this.scale = ( scale || 1 );
    this.rotation = 0;
    this.center = center;
    this.x = center[ 0 ];
    this.y = center[ 1 ];
    this.rotationCenter = [ center[ 0 ], center[ 1 ] ];
    this.set = KhanUtil.currentGraph.raphael.set();

    this.cosines = [  Math.cos( Math.PI * angles[ 0 ] / 180 ),  Math.cos( Math.PI * angles[ 1 ] / 180 ),  Math.cos( Math.PI * angles[ 2 ] / 180 ), Math.cos( Math.PI * angles[ 3 ] /  180 ) ];


    this.sines = [ Math.sin( Math.PI * angles[ 0 ] / 180 ),  Math.sin( Math.PI * angles[ 1 ] / 180 ),  Math.sin( Math.PI * angles[ 2 ] / 180 ),  Math.sin( Math.PI * angles[ 3 ] /  180 ) ];

    var len = Math.sqrt( 2 * scale * scale * sideRatio * sideRatio  - 2 * sideRatio * scale * scale * sideRatio * this.cosines[ 3 ] );

    var tX = [ 0,  scale * sideRatio * this.cosines[ 0 ] , len * Math.cos( ( this.angles[ 0 ] - ( 180 - this.angles[ 3 ] )/ 2 ) * Math.PI/180 ),  scale, scale + Math.cos( ( 180 - this.angles[ 1 ] ) * Math.PI / 180 ) ];

    var tY = [ 0,  scale * sideRatio * this.sines[ 0 ] , len * Math.sin( ( this.angles[ 0 ] - ( 180 - this.angles[ 3 ] )/ 2 ) *  Math.PI/180 ), 0,  Math.sin( ( 180 - this.angles[ 1 ] ) * Math.PI / 180 ) ];

    var denominator = ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 2 ] - tX[ 1 ] ) - (tX[ 4 ] - tX[ 3 ] ) * ( tY[ 2 ] - tY[ 1 ] );

    var ua = ( ( tX[ 4] - tX[ 3 ] ) * ( tY[ 1 ] - tY[ 3 ] ) - ( tY[ 4 ] - tY[ 3 ] ) * ( tX[ 1 ] - tX [ 3 ]) ) / denominator;
  this.points = [ [ this.x, this.y ], [ scale * sideRatio * this.cosines[ 0 ], scale * sideRatio * this.sines[ 0 ] ], [ tX[ 1 ] + ua * ( tX[ 2 ] - tX[ 1 ] ), tY[ 1 ] + ua * ( tY[ 2 ] - tY[ 1 ] ) ], [ scale, 0 ] ];


    this.draw = function(){
        this.set.push( this.graph.path( this.points.concat( [ this.points[ 0 ] ] ) ) );
        return this.set;
    }

}

function Triangle( center, angles, sides, scale, labels ){

    this.labels = labels;
    this.graph = KhanUtil.currentGraph;
    this.angles = angles;
    this.scale = ( scale || 3 );
    this.rotation = 0;
    this.center = center;
    this.x = center[ 0 ];
    this.y = center[ 1 ];
    this.rotationCenter = [ center[ 0 ], center[ 1 ] ];

    this.cosines = [  Math.cos( Math.PI * angles[ 0 ] / 180 ),  Math.cos( Math.PI * angles[ 1 ] / 180 ),  Math.cos( Math.PI * angles[ 2 ] / 180 ) ];
    this.sines = [  Math.sin( Math.PI * angles[ 0 ] / 180 ),  Math.sin( Math.PI * angles[ 1 ] / 180 ),  Math.sin( Math.PI * angles[ 2 ] / 180 )  ];

    var a = Math.sqrt( ( 2 * this.scale * this.sines[ 1 ] ) / (this.sines[ 0 ] * this.sines[ 2 ])  ) ;
    var b = a * this.sines[ 2 ] / this.sines[ 1 ];
    this.points = [ [ this.x, this.y ], [  b  + this.x, this.y ], [ this.cosines[ 0 ] * a + this.x, this.sines[ 0 ] * a  + this.y  ] ];
    if ( !sides || sides.length < 3 ){
        this.sides = [ 1 ];
    }
    else {
        this.sides = sides;
    }
    this.set = KhanUtil.currentGraph.raphael.set();
    this.angleScale = function ( ang ){
        if( ang > 90 ){
            return 0.5;
        }
        else if ( ang > 40 ){
            return 0.6;
        }
        else if ( ang < 25 ){
            return 1.3;
    }
        return 1;
    }

    this.draw = function(){
        this.set.push( this.graph.path( this.points.concat( [ this.points[ 0 ] ] ) ) );

        return this.set;
    }
    this.drawLabels = function(){
        if ( "name" in this.labels ){
            this.set.push( this.graph.label( this.rotatePoint( [ this.points[ 0 ][ 0 ] - 0.5, this.points[ 0 ][ 1 ] ], this.rotation ), labels.name ) );
        }
        if ( "c" in this.labels ){
            this.set.push( this.graph.label(  this.rotatePoint( [ ( this.points[ 0 ][ 0 ] + this.points[ 1 ][ 0 ] ) / 2,  ( this.points[ 0 ][ 1 ] + this.points[ 1 ][ 1 ] ) / 2 - 0.4 ], this.rotation ) , labels.c ) );
        }
        if ( "a" in this.labels ){
            this.set.push( this.graph.label(  this.rotatePoint( [ ( this.points[ 1 ][ 0 ] + this.points[ 2 ][ 0 ] ) / 2 + 0.4, ( this.points[ 1 ][ 1 ] + this.points[ 2 ][ 1 ] ) / 2  ], this.rotation ) , labels.a ) );
        }
        if ( "b" in this.labels ){
            this.set.push( this.graph.label(  this.rotatePoint( [ ( this.points[ 0 ][ 0 ] + this.points[ 2 ][ 0 ] ) / 2 - 0.4, ( this.points[ 0 ][ 1 ] + this.points[ 2 ][ 1 ] ) / 2 ], this.rotation ) , labels.b ) );
        }
        if ( "A" in this.labels ){
            this.set.push( this.graph.label(  this.rotatePoint( [ this.points[ 0 ][ 0 ] - 0.3, this.points[0][1] ], this.rotation ) , labels.A ) );
        }
        if ( "B" in this.labels ){
            this.set.push(  this.graph.label( this.rotatePoint( [ this.points[ 1 ][ 0 ] + 0.3 , this.points[ 1 ][ 1 ] + 0.2 ], this.rotation ) , labels.B ) );
        }
    if ( "C" in this.labels ){
            this.set.push(  this.graph.label( this.rotatePoint( [ this.points[ 2 ][ 0 ] + 0.2 , this.points[ 2 ][ 1 ] - 0.2 ], this.rotation ), labels.C ) );       }
        if ( "CAB" in this.labels ){
            this.set.push(  this.graph.label( this.rotatePoint( [ this.points[ 0 ][ 0 ] +  this.angleScale( this.angles[ 0 ]  ) * Math.cos( this.angles[ 0 ] / 2 * Math.PI / 180 ), this.points[ 0 ][ 1 ] +  this.angleScale( this.angles[ 0 ]  ) * Math.sin( this.angles[ 0 ] / 2 * Math.PI / 180 ) ], this.rotation ), labels.CAB ) );
        }
        if ( "ABC" in this.labels ){
            this.set.push(  this.graph.label( this.rotatePoint( [ this.points[ 1 ][ 0 ] + this.angleScale( this.angles[ 1 ] )  * Math.cos( ( 180 - this.angles[ 1 ] / 2 ) * Math.PI / 180 ), this.points[ 1 ][ 1 ] + this.angleScale( this.angles[ 1 ]  ) * Math.sin( ( 180 - this.angles[ 1 ] / 2 ) * Math.PI / 180 ) ], this.rotation ), labels.ABC ) );
        }
        if ( "BCA" in this.labels ){
            this.set.push(  this.graph.label( this.rotatePoint( [ this.points[ 2 ][ 0 ] +  this.angleScale( this.angles[ 2 ] )  * Math.cos( ( 180 + this.angles[ 0 ] + this.angles[ 2 ] / 2 ) * Math.PI / 180 ), this.points[ 2 ][ 1 ] +   this.angleScale( this.angles[ 2 ] ) * Math.sin( ( 180 + this.angles[ 0 ] + this.angles[ 2 ] / 2 ) * Math.PI / 180 ) ], this.rotation ), labels.BCA ) );
        }

        return this.set;
    }

    this.rotate = function( amount, x, y ){

        this.rotationCenter = [ x, y ];
        this.set.rotate( amount, this.graph.scalePoint( [ x, y ] )[0] , this.graph.scalePoint( [ x, y ] )[1] );
        this.rotation = amount * Math.PI / 180;

    }

    this.rotatePoint = function ( pos, theta ){
        return [ this.rotationCenter[ 0 ] + ( pos[ 0 ] - this.rotationCenter[ 0 ] ) * Math.cos( theta )  +  ( pos[ 1 ] -  this.rotationCenter[ 1 ] ) * Math.sin( theta ),  this.rotationCenter[ 1 ] + ( -1 ) *  ( ( pos[ 0 ] -  this.rotationCenter[ 0 ] ) * Math.sin( theta ) ) + ( ( pos[ 1 ] -  this.rotationCenter[ 1 ] ) * Math.cos( theta ) ) ];
    }
}
function newSquare(){
     return new Quadrilateral( [ 0, 0 ], [ 90, 90 , 90 , 90 ],  KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newRectangle(){
 return  new Quadrilateral( [ 0, 0 ], [ 90, 90 , 90 , 90 ],  KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newRhombus(){
        var angA =  KhanUtil.randRange( 30, 160 );
        var angB = 180 - angA;
    return new Quadrilateral( [ 0, 0 ], [ angA, angB , angA , angB ],1  , "", 3 );
}

function newParallelogram(){
        var angA =  KhanUtil.randRange( 30, 160 );
        var angB = 180 - angA;
        return  new Quadrilateral( [ 0, 0 ], [ angA, angB ,angA ,angB ], KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newTrapezoid(){
        var angA =  KhanUtil.randRange( 30, 160 );
        var angB = 180 - angA;
        var angC =  KhanUtil.randRange( 30, 160 );
        var angD = 180 - angC;
        return  new Quadrilateral( [ 0, 0 ], [ angA, angC , angD , angB ],  KhanUtil.randFromArray( [ 0.2, 0.5, 0.7, 1.5 ] ) , "", 3 );
}

function newKite(){
    var angA = KhanUtil.randRange( 90, 140 );
    var angB = KhanUtil.randRange( 30, ( 360 - ( 2 * angA ) ) - 30 );
    var angC = 360 - angB - 2 * angA;
    return  new Quadrilateral( [ 0, 0 ], [ angB, angA , angC , angA ], 1 , "", 2 );
}

