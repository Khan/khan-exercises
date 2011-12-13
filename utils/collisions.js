jQuery.extend( KhanUtil, {
	initCollision: function( mass1, mass2, directionsign, velocity1, velocity2 ) {
		var graph = KhanUtil.currentGraph;
		
		var options = {
			xpixels: 700,
			ypixels: 200,
			range: [ [-7, 7], [-2, 2] ]
		};
		options.scale = [ options.xpixels/(options.range[0][1] - options.range[0][0]),
		                  options.ypixels/(options.range[1][1] - options.range[1][0]) ];
		graph.init( options );
		
		graph.xpixels = options.xpixels;
		graph.ypixels = options.ypixels;
		graph.range = options.range;
		graph.scale = options.scale;

		//Creates a set for all the circles and lines and a list for all the labels
		//so we can delete them between animations
		var set = graph.collisionSet = graph.raphael.set();
		var labels = graph.collisionLabels = [];
		
		set.push( graph.circle( [-5, 0], 0.5 ) );
		labels.push( graph.label( [-5, 0], mass1 + "kg") );
		
		//Creates velocity arrows in the direction that they are moving
		//Draws second mass depending on the direction it is traveling
		set.push( graph.line( [-4.5, -0], [-3.5, -0], {
			arrows: "&gt;"
		}) );
		labels.push( graph.label( [-3.5, -0], "+" + velocity1 + "m/s", "right") );
		
		//First type of collision - where both masses are moving the whole time
		if ( velocity2 !== 0 ) {
			if ( directionsign === "negative" ) {
				set.push( graph.circle( [3, 0], 0.5) );
				labels.push( graph.label( [3, 0], mass2 + "kg") );
				set.push( graph.line( [2.5, 0], [1.5, 0], {
					arrows: "&gt;"
					}) );
					labels.push( graph.label( [1.5, 0], "-" + velocity2 + "m/s", "left") );
				};
			if ( directionsign === "positive") {
				//This one starts further to the right to give it more
				//room to collide when they end up both moving to the
				//right
				set.push( graph.circle( [-1, 0], 0.5) );
				labels.push( graph.label( [-1, 0], mass2 + "kg") );
				set.push( graph.line( [-.5, 0], [.5, 0], {
					arrows: "&gt;"
					}) );
				labels.push( graph.label( [.5, 0], "+" + velocity2 + "m/s", "right") );
			};
		}; 
		
		//Second type of collision - second mass begins at rest
		if ( velocity2 === 0 ) {
			set.push( graph.circle( [0, 0], 0.5 ) );
			labels.push( graph.label( [0, 0], mass2 + "kg") );
			labels.push( graph.label( [0, -1], "v_2 = 0") );
		};
	},
	
	collision1: function( directionsign, velocity4, mass1, mass2, solution ) {
		var graph = KhanUtil.currentGraph;
		
		graph.collisionSet.remove();
		jQuery.each( graph.collisionLabels, function( i, label ) {
			label.remove();
		} );
		
		//These are the same values from init, but since we just
		//deleted the circles, we need to redraw them
		var c1 = graph.circle( [-5, 0], 0.5 );
		if ( directionsign === "negative") {
			var c2 = graph.circle( [3, 0], 0.5) 
		};
		if ( directionsign === "positive") {
			var c2 = graph.circle( [-1, 0], 0.5 ); 
		};
		
		jQuery( { t: 0 } ).animate( { t: 1 }, {
			easing: "linear",
			duration: 1000,
			step: function( t, fx ) {
				if ( directionsign === "negative" ) {
					c1.remove();
					c1 = graph.circle( [4 * t - 5, 0 ], 0.5);
					c2.remove();
					c2 = graph.circle( [-3 * t + 3, 0], 0.5);
				}; 
				if ( directionsign === "positive") {
					c1.remove(); 
					c1 = graph.circle( [5 * t - 5, 0 ], 0.5);
					c2.remove();
					c2 = graph.circle( [2* t - 1, 0], 0.5); 
				};
			},
			
			complete: function() {
				graph.collisionSet = graph.raphael.set();
				graph.collisionSet.push(c1);
				graph.collisionSet.push(c2);
				KhanUtil.afterCollision1( mass1, mass2, velocity4, directionsign, solution);
			},				
		} );
	}, 
	
	afterCollision1: function( mass1, mass2, velocity4, directionsign, solution) {
		var graph = KhanUtil.currentGraph;
		
		graph.collisionSet.remove();
		
		if ( directionsign === "negative" ) {
			c1x = -1;
			c2x = 0;
		}; 
		if ( directionsign === "positive") {
			c1x = 0;
			c2x = 1;
		};
		
		var c1 = graph.circle( [c1x, 0], 0.5 );
		var c2 = graph.circle( [c2x, 0], 0.5 ); 
		
		//The use of sin in the animations causes the balls to slow down a bit
		//at the end to show a more "realistic view"
		jQuery( { t: 0 } ).animate( { t: 1}, {
			easing: "linear",
			duration: 1570,
			step: function( t, fx) {
				if ( directionsign === "negative" ) {
					if ( solution > 0 ) {
						c1.remove(); 
						c1 = graph.circle( [Math.sin(t*(Math.PI/2)) + c1x, 0], 0.5 );
						c2.remove();
						c2 = graph.circle( [3 * Math.sin(t*(Math.PI/2)) + c2x, 0], 0.5 );
					};
					if ( solution < 0 ) {
						c1.remove();
						c1 = graph.circle( [c1x * Math.sin(t*(Math.PI/2)) + c1x, 0], 0.5 ); 
						c2.remove();
						c2 = graph.circle( [Math.sin(t*(Math.PI/2)) + c2x, 0], 0.5 );
					};
				}; 
				if ( directionsign === "positive" ) {
					if ( solution > 0 ) {
						c1.remove();
						c1 = graph.circle( [Math.sin(t*(Math.PI/2)) + c1x, 0], 0.5 );
						c2.remove();
						c2 = graph.circle( [3 * Math.sin(t*(Math.PI/2)) + c2x, 0], 0.5 );
					};
					if ( solution < 0 ) {
						c1.remove(); 
						c1 = graph.circle( [-c1x * Math.sin(t*(Math.PI/2)) + c1x, 0], 0.5 );
						c2.remove();
						c2 = graph.circle( [c2x * Math.sin(t*(Math.PI/2)) + c2x, 0], 0.5 ); 
					};
				};
			},
			complete: function() {
				if ( directionsign === "negative" ) {
					if ( solution > 0 ) {
						c1x = 0;
						c2x = 3;
					};
					if ( solution < 0 ) {
						c1x = -2;
						c2x = 1;
					};
				};
				if ( directionsign === "positive" ) {
					if ( solution > 0 ) {
						c1x = 1;
						c2x = 4;
					};
					if ( solution < 0 ) {
						c1x = 0; 
						c2x = 4;
					};
				};
				KhanUtil.drawLabels(c1x, c2x, velocity4, solution, mass1, mass2 );
			},
		} ); 
	},
	
	collision2: function( mass1, mass2 ) {
		var graph = KhanUtil.currentGraph
		
		graph.collisionSet.remove();
		jQuery.each( graph.collisionLabels, function( i, label ) {
			label.remove();
		} );
		
		var c1 = graph.circle( [-5, 0], 0.5 ); 
		var c2 = graph.circle( [0, 0], 0.5 );
		
		jQuery( { t: 0 } ).animate( { t: 1 }, {
			easing: "linear",
			duration: 1000,
			step: function( t, fx ) {
				c1.remove(); 
				c1 = graph.circle( [4 * t - 5, 0], 0.5 ); 
			},
			complete: function() {
				graph.collisionSet = graph.raphael.set();
				graph.collisionSet.push(c1);
				graph.collisionSet.push(c2);
				KhanUtil.afterCollision2( mass1, mass2); 
			},
		}); 
	}, 
	
	afterCollision2: function( mass1, mass2 ) {
		var graph = KhanUtil.currentGraph
		
		graph.collisionSet.remove();
		
		var c1 = graph.circle( [-1, 0], 0.5 ); 
		var c2 = graph.circle( [0, 0], 0.5 ); 
		
		jQuery( {t: 0 } ).animate( { t: 1 }, {
			easing: "linear", 
			duration: 1000 * Math.PI / 2, 
			step: function( t, fx ) {
				c2.remove(); 
				c2 = graph.circle( [3 * Math.sin(t*(Math.PI/2)), 0], 0.5 ); 
			}, 
			complete: function() { 
				KhanUtil.drawLabels( -1, 3, "none", 0, mass1, mass2 ); 
			}, 
		}); 
	}, 		
			
	drawLabels: function( c1x, c2x, velocity4, solution, mass1, mass2 ) {
		var graph = KhanUtil.currentGraph
		
		//label masses
		graph.label( [c1x, 0], mass1 + "kg"); 
		graph.label( [c2x, 0], mass2 + "kg");
		
		//draw and label velocity 4
		graph.line( [c2x + 0.5, 0], [c2x + 1.5, 0], {
			arrows: "&gt;"
		}); 
		if ( velocity4 !== "none" ) {
			graph.label( [c2x + 1.5, 0], velocity4 + "m/s", "right"); 
		}; 
		if ( velocity4 === "none") { //only in second collision type
			graph.label( [c2x + 1.5, 0], "v_4", "right");
		};
		
		//draw and label solution arrow - labeled as v_3
		if ( solution === 0 ) { //this happens in second collision type
			graph.label( [c1x, -1], "v_3 = 0"); 
		}; 
		if ( solution > 0) {
			graph.line( [c1x + 0.5, 0], [c1x + 1.5, 0], {
				arrows: "&gt;"
			}); 
			graph.label( [c1x + 1.5, 0], "v_3" , "right"); 
		};
		if ( solution < 0 ) {
			graph.line( [c1x - 0.5, 0], [c1x - 1.5, 0], {
				arrows: "&gt;"
			});
			graph.label( [c1x - 1.5, 0], "v_3", "left");
		};		
	}

});