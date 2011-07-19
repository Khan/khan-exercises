jQuery.extend( KhanUtil, {
	commonAngles: [
		{deg: 15, rad: "\\frac{\\pi}{12}"},
		{deg: 30, rad: "\\frac{\\pi}{6}"},
		{deg: 45, rad: "\\frac{\\pi}{4}"},
		{deg: 60, rad: "\\frac{\\pi}{3}"},
		{deg: 90, rad: "\\frac{\\pi}{2}"},
		{deg: 120, rad: "\\frac{2\\pi}{3}"},
		{deg: 135, rad: "\\frac{3\\pi}{4}"},
		{deg: 150, rad: "\\frac{5\\pi}{6}"},
		{deg: 180, rad: "\\pi"},
		{deg: 210, rad: "\\frac{7\\pi}{6}"},
		{deg: 225, rad: "\\frac{5\\pi}{4}"},
		{deg: 240, rad: "\\frac{4\\pi}{3}"},
		{deg: 270, rad: "\\frac{3\\pi}{2}"},
		{deg: 300, rad: "\\frac{5\\pi}{3}"},
		{deg: 315, rad: "\\frac{7\\pi}{4}"},
		{deg: 330, rad: "\\frac{11\\pi}{6}"},
		{deg: 360, rad: "2\\pi"}
	],
	trigFunc: {
		csc: {name: "csc", print: function( angle ){
						return KhanUtil.trigFunc.sec.print( 90-angle);
						},
				convertsTo:["sin"],
				convertTo: function( type, angle ){
					if( type.name == "sin" ){
						        cscv =  KhanUtil.trigFunc.csc.print( angle );
                                                        sinv =  KhanUtil.trigFunc.sin.print( angle );
                                                        toReturn = new Array();
                                                        toReturn.push( "\\csc x = 1/(sin x)" );
                                                        toReturn.push( "\\csc x = " + cscv );
                                                        toReturn.push( '1/(\\sin x) = ' + cscv );
                                                        toReturn.push( '\\sin x = ' + sinv );
							return toReturn;
					}
					
				}
		},	
		sec: {name: "sec", print: function( angle ){
					  		 if( angle == 0 ){
                                                                return 1;
                                                        }
                                                        else if( angle == 30 ){
                                                                return "2/\\sqrt 3";
                                                        }
                                                        else if( angle == 45 ){
                                                                return '\\sqrt 2';
                                                        }
                                                        else if( angle == 60 ){
                                                                return '2';
                                                        }
                                                        else if( angle == 90 ){
                                                                return 'undef';
                                                        }
                                                        return 'undef';
						},
				convertsTo: ["cos","tan"],
				convertTo: function( type, angle){
						if( type.name ==  "cos" ){ 

							cosv =  KhanUtil.trigFunc.cos.print( angle );
							secv =  KhanUtil.trigFunc.sec.print( angle );
							toReturn = new Array();
							toReturn.push( "\\sec x = 1/(\\cos x)" );
							toReturn.push( "\\sec x = " + secv );
							toReturn.push( '1/(\\cos x) = ' + secv );
							toReturn.push( "\\cos x = " + cosv);
						}
						else if( type.name == "tan"){
							cosv =  KhanUtil.trigFunc.cos.print( angle );
							secv =  KhanUtil.trigFunc.sec.print( angle );
							toReturn = new Array();
							toReturn.push( "\\sin^2 x + \\cos^2 x = 1" );
							toReturn.push( "(\\sin^2 x) / (\\cos^2 x) + (\\cos^2 x) / (\\cos^2 x) = 1 / (\\cos^2 x)" );
							toReturn.push( "\\tan^2 x + 1 = \\sec^2 x" );
							toReturn.push( "\\tan^2 x + 1 = (" + secv + ")^2" );
							toReturn.push( "\\tan^2 x = (' + secv + ')^2 - 1" );
							toReturn.push( "\\tan x = sqrt((" + secv + ")^2 - 1 )");
							toReturn.push( "\\tan x = " + tanv );
							return toReturn;	
						}
					}
			},	
		tan: {name: "tan", print: function( angle ){
      						        if( angle == 0 ){
                                                                return 0;
                                                        }
                                                        else if( angle == 30 ){
                                                                return "1/\\sqrt 3";
                                                        }
                                                        else if( angle == 45 ){
                                                                return '1';
                                                        }
                                                        else if( angle == 60 ){
                                                                return '\\sqrt 3';
                                                        }
                                                        else if( angle == 90 ){
                                                                return 'undef';
                                                        }
                                                        return 'undef';
	
						},
					convertsTo: ["sec"],
					convertTo: function( type, angle){
						if( type.name ==  "tan" ){ 

							tanv =  KhanUtil.trigFunc.tan.print( angle );
							secv =  KhanUtil.trigFunc.sec.print( angle );
							toReturn = new Array();
							toReturn.push( "\\sin^2 x + \\cos^2 x = 1" );
							toReturn.push( "(\\sin^2 x) / (\\cos^2 x) + (\\cos^2 x) / (\\cos^2 x) = 1 / (\\cos^2 x)" );
							toReturn.push( "\\tan^2 x + 1 = \\sec^2 x" );
							toReturn.push( "(" + tanv + ")^2 + 1 = \\sec^2 x" );
							toReturn.push( "\sqrt((" + tanv + ")^2 + 1) = \\sec x" );
							toReturn.push( secv + ' = \\sec x');
							return toReturn;	
						}
					}
			},
		cos :{name: "cos", print: function( angle ){ 
							return KhanUtil.trigFunc.sin.print( 90-angle );
							},
				convertsTo: ["sin","sec"],
				convertTo: function( type, angle){
						if( type.name == "sin" ){
							cosv =  KhanUtil.trigFunc.cos.print( angle );
							sinv =  KhanUtil.trigFunc.sin.print( angle );
							toReturn = new Array();
							toReturn.push("\\sin^2 x + \\cos^2 x = 1");
							toReturn.push("\\sin^2 x + (" + cosv + ")^2 = 1");
							toReturn.push("(" + cosv + ")^2 = 1 - \\sin^2 x");
							toReturn.push('(' + cosv + ')^2 - 1 = - \\sin^2 x');
							toReturn.push('-(' + cosv + ')^2 + 1 = \\sin^2 x');
							toReturn.push(sinv + ' = \\sin x');
							return toReturn;
						}
						else if( type.name == "sec" ){
                                                        cosv =  KhanUtil.trigFunc.cos.print( angle );
                                                        secv =  KhanUtil.trigFunc.sec.print( angle );
							toReturn = new Array();
							toReturn.push( cosv + " = \\cos x" );
							toReturn.push( secv + " = 1/(\\cos x)" );
							toReturn.push( secv + " = \\sec x" ); 
							return toReturn;
						}
					}
			},
		sin: {name: "sin", print: function( angle ){ 
							if( angle == 0 ){
								return 0;
							}
							else if( angle ==30 ){
								return '1/2';
							}
							else if( angle == 45 ){
								return '\\sqrt 2/2';
							}
							else if( angle = 60 ){
								return '\\sqrt 3/2';
							}
							else if( angle == 90 ){
								return '1';
 							}
							return 'undef';
							},
					convertsTo: ["cos","csc"],
					convertTo: function( type, angle ){
							if( type.name == "cos" ){
								sinv = KhanUtil.trigFunc.sin.print( angle );
								cosv = KhanUtil.trigFunc.cos.print( angle );
								toReturn = new Array();
								toReturn.push( "\\sin^2 x + \\cos^2 x = 1" );
								toReturn.push( "(" + sinv + ")^2 + \\cos^2 x = 1" );
								toReturn.push( "(" + sinv + ")^2 = 1- \\cos^2 x " );
								toReturn.push( "(" + sinv + ")^2 - 1 = - \\cos^2 x " ); 
								toReturn.push( "-(" + sinv + ")^2 + 1 = \\cos^2 x " );
						   		toReturn.push( cosv + " =  \\cos x" );
								return toReturn;
 
							}
							else if( type.name == "csc" ){
								sinv = KhanUtil.trigFunc.sin.print( angle )
								cscv = KhanUtil.trigFunc.csc.print( angle );
	
								toReturn = new Array();
								toReturn.push( sinv + " = \\sin x" );
								toReturn.push( cscv + " = 1/(\\sin x)" );
								toReturn.push( cscv + " = \\csc x" );
							}
							}
		
	}
}})
jQuery.extend( KhanUtil, {


	trigTypes: [KhanUtil.trigFunc.sin,KhanUtil.trigFunc.cos,KhanUtil.trigFunc.tan,KhanUtil.trigFunc.csc,KhanUtil.trigFunc.sec],
	// Convert a degree value to a radian value
	toRadians: function( degrees ) {
		return degrees * Math.PI / 180;
	},

	findSteps: function( start, end, value){
		var queue=[];
		var next=start;
		while( next.name != end.name ){
			if ( next.convertsTo ) {
      				$.each( next.convertsTo, function(i, str) {
					var move = KhanUtil.trigFunc[str];
					move["parent"] = next;
					queue.push( move );
           		 	});
                	}
      			 next = queue.shift();
    		}	
		var prev = next;
		var steps = new Array();
		while( prev.name != start.name ){
			steps.unshift( prev.name );
			prev = prev.parent;
		}		
		steps.unshift( prev.name );
		var toReturn = new Array();
		for( x=0; x<steps.length-1 ;x++ ){
			toReturn.push(KhanUtil.trigFunc[steps[x]].convertTo( KhanUtil.trigFunc[steps[x+1]], value ));
		}	
		return toReturn;
	},

	wrongCommonAngle: function( angleIdx, i ) {
		// i is a value from 1 to 3
		return KhanUtil.commonAngles[ (angleIdx + (4 * i)) % KhanUtil.commonAngles.length ];
	},

	wrongDegrees: function( degrees ) {
		var offset;
		var wrong;

		do {
			offset = KhanUtil.randRange( 10, 35 );
			if (KhanUtil.rand(2)) {
				offset *= -1;
			}

			wrong = degrees + offset;
		} while ( !(wrong >= 0 && wrong <= 360) );

		return wrong;
	},

	wrongRadians: function( radians ) {
		var offset;
		var wrong;

		do {
			offset = KhanUtil.randRange( 10, 35 ) / 100;
			if (KhanUtil.rand(2)) {
				offset *= -1;
			}

			wrong = KhanUtil.roundTo( 2, radians + offset );
		} while ( !(wrong >= 0 && wrong <= 2 * Math.PI) );

		return wrong;
	}
});
