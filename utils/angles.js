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
		tan: {name: "tan", print: function(angle){
      						        if(angle==0){
                                                                return 0;
                                                        }
                                                        else if(angle==30){
                                                                return '1/sqrt(3)';
                                                        }
                                                        else if(angle==45){
                                                                return '1';
                                                        }
                                                        else if(angle==60){
                                                                return 'sqrt(3)';
                                                        }
                                                        else if(angle==90){
                                                                return 'undef';
                                                        }
                                                        return 'undef';
	
						}
			},
		cos :{name: "cos", print: function(angle){ 
							return KhanUtil.trigFunc.sin.print(90-angle);
							}
			},
		sin: {name: "sin", print: function( angle ){ 
							if(angle==0){
								return 0;
							}
							else if(angle==30){
								return '1/2';
							}
							else if(angle==45){
								return 'sqrt(2)/2';
							}
							else if(angle==60){
								return 'sqrt(3)/2';
							}
							else if(angle==90){
								return '1';
 							}
							return 'undef';
							},
					convertsTo: ["cos"],
					convert: function( type, angle ){
							if(type.name=="cos"){
								sinv=this.print( angle );
								cosv= KhanUtil.trigFunc.sin.print( angle );
								toReturn='sin^2 x + cos^2 x = 1'+'(' + sinv + ')^2 = 1 - cos^2 x'+'(' + sinv + ')^2 - 1 = - cos^2 x'+'-(' + sinv + ')^2 + 1 = cos^2 x'+cosv + ' = cos x';	
							} 
		}
	}
})
jQuery.extend( KhanUtil, {


	trigTypes: [KhanUtil.trigFunc.sin,KhanUtil.trigFunc.cos,KhanUtil.trigFunc.tan],
	// Convert a degree value to a radian value
	toRadians: function( degrees ) {
		return degrees * Math.PI / 180;
	},

	findSteps: function(start,end){
		var queue=[];
		var next=start;
		while(next.name!=end.name){
			if (next.convertsTo) {
      				$.each(next.convertsTo, function(i, str) {
					var move=TrigFunc[str];
					move["parent"]=next;
					queue.push(move);
           		 	});
                	}
      			 next = queue.shift();
    		}	
		var prev=next;
		var steps=new Array();
		while(prev.name!=start.name){
			steps.unshift(prev.name);
			prev=prev.parent;
		}		
		steps.unshift(prev.name);

		var toReturn=new Array();
		while(int x=0;x<steps.length-1;x++){
			toReturn.push(trigFunc[steps[x]].convertTo(steps[x+1]));
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
