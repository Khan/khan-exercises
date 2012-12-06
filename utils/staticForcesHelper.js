	function onTestit(){
		 var $graphagain = $('<div class="graphie" id="netGraph" style="position:relative; z-index:3;"> \
							 \
								graphInit({ \
								range: 13, \
								scale: 20,  \
								tickStep: 15,\
								labelStep: 1,\
								unityLabels: false,\
								labelFormat: function( s ) { return "\\small{" + s + "}"; },\
								axisArrows: "->",\
								axisOpacity: .80,\
								gridOpacity: .82\
							}); </div>');
        $('body').append( $graphagain );
	
	
	
		$("#graph").after(' <script src="../khan-exercise.js"></script>');
	alert("in test it");
	
	
	}
	
	function animateGraph(netF){
		//threshold I created so that the graph doesn't animate if your net vector is within the 'threshold'. 
		//I didn't want correct answers to move.
		threshold= 0.01;
		
		//sets the net x and y forces. If they are below the threshold,
		//they are set to zero.
		x=(Math.abs(netF[0])<threshold)? 0 : netF[0];
		y=(Math.abs(netF[1])<threshold)? 0 : netF[1];
		
		//Yeah, this code kinda blows. The hint graph is created beneath the graph on the screen.
		//I have to move the hint graph on top of the graph. That is what the -545 and -20 do. This needs fixing,
		//I'll admit. :(
		//I multiply x and y by a factor of 100 to make the animation more interesting.
		topp=-545-y*100;
		leftp=-20 + x*100;
		
		//Finds the graph and moves it! Then if deletes itself in the callback function. Also note the 'easeInQuad' parameter.
		//I found this library in the hopes of animating the graph more realistically using the distance equations. I have
		//yet to fix it so that it realistically animates. (But it does go in the right direction!)
		$("#netGraph").animate({top:topp,left:leftp},1500,'easeInQuad',function(){$("#netGraph").remove();});	
		
	}
	
	//So this function is called when the textboxes with the answer parameters are changed.
	//It updates the movable point/line to reflect what the user has changed the values to.
	function updateMyVector(){
		angle=$("#testAngle").val();
		mag= $("#testMag").val();
		xn=mag*Math.cos(angle * (Math.PI/180));
		yn=mag*Math.sin(angle* (Math.PI/180));
			
		paulspoint.setCoord([xn,yn]);
		paulspoint.updateLineEnds();
	}
	
	//What does this do you say? Well, it figures out where the heck the point is for the 
	//current magnitude and angle settings. Ahh, if only I had documented as I went along
	//instead of now. My vice.
	function currentXandY(){
		angle=$("#testAngle").val();
		mag= $("#testMag").val();
		xn=mag*Math.cos(angle * (Math.PI/180));
		yn=mag*Math.sin(angle* (Math.PI/180));
		return [xn,yn];
	}
	
	//This function does neat stuff to draw little lines on the lines to make them look
	//like rays. It's a lot of math.
	//Pass this function a point, and it will return an array of where two points are that should
	//be drawn to in this form [x1,y1,x2,y2].
	function arrowPoints(p){
		xp=p[0];
		yp=p[1];
		
		//c and d say how big to make these arrows. I don't recall which does which.
		//Again, my vice of not documenting right away.
		c=.5;
		d=.3;
		if(yp==0){
			if(xp<0) c*=-1;
			return [xp-c,yp-d,xp-c,yp+d];
		} 
		if(xp==0){
			if(yp<0) c*=-1;
			return [xp-d,yp-c,xp+d,yp-c];
		}
		
		Newx= xp - (xp*c)/Math.sqrt(xp*xp+yp*yp);
		Newy= yp - (yp*c)/Math.sqrt(xp*xp+yp*yp);
		pp= [Newx,Newy];
		
		b=Newy-((-1)*(xp/yp)*Newx);
		m=(-1)*(xp/yp);
		xintercept=-b/m;
		bigx=xintercept-Newx;
		bigy=Newy;
		bigr=Math.sqrt(bigx*bigx+bigy*bigy)
		raypoint1x= Newx + bigx*d/bigr;
		raypoint1y= Newy - bigy*d/bigr;
		raypoint2x= Newx - bigx*d/bigr;
		raypoint2y= Newy + bigy*d/bigr;
		return [raypoint1x,raypoint1y,raypoint2x,raypoint2y];
	}
	
	//Given the x and y coordinates as a point, this function returns the angle
	//in degrees between 0 and 360.
	function thetaGetter(x,y){
		tanin = Math.atan(y/x)*(180/Math.PI);
		if(x==0){
			if(y<0){return 270;	}
			else{return 90;	}
		}
		if(tanin<0){
			if(x<0){return 180+tanin;}
			else {return 360 + tanin;}
		}
		else if(y<0) { return 180 + tanin; }
		return tanin;
		}
		