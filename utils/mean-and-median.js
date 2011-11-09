jQuery.extend( KhanUtil, {

	updateMean: function( mean ) {
		var graph = KhanUtil.currentGraph;

		jQuery( graph.graph.meanValueLabel ).html( mean ).tmpl();

		graph.graph.meanArrow.translate( (mean * graph.scale[0]) - graph.graph.meanArrow.attr("translation").x, 0 );
		graph.graph.meanValueLabel.remove();
		graph.graph.meanValueLabel = graph.label( [ mean, 0.8 ],
			( mean + "" ).replace( /-(\d)/g, "\\llap{-}$1" ),
			"above",
			{ color: KhanUtil.BLUE }
		);

		graph.graph.meanLabel.remove();
		graph.graph.meanLabel = graph.label( [ mean, 1.3 ],	"\\text{mean}", "above", { color: KhanUtil.BLUE });

		graph.graph.mean = mean;
	},


	updateMedian: function( median ) {
		var graph = KhanUtil.currentGraph;

		graph.graph.medianArrow.translate( (median * graph.scale[0]) - graph.graph.medianArrow.attr("translation").x, 0 );
		graph.graph.medianValueLabel.remove();
		graph.graph.medianValueLabel = graph.label( [ median, -1.2 ],
			( median + "" ).replace( /-(\d)/g, "\\llap{-}$1" ),
			"below",
			{ color: KhanUtil.GREEN }
		);

		graph.graph.medianLabel.remove();
		graph.graph.medianLabel = graph.label( [ median, -1.7 ],	"\\text{median}", "below", { color: KhanUtil.GREEN });

		graph.graph.median = median;
	},


	calculateAverages: function() {
		var points = KhanUtil.currentGraph.graph.points;
		var mean = 0;
		var median = 0;
		var values = [];
		jQuery.each( points, function() {
			mean += this.coord[0];
			values.push( this.coord[0] );
		});

		mean /= points.length;

		values = KhanUtil.sortNumbers( values );
		if ( values.length % 2 !== 0 ) {
			median = values[ Math.round( values.length / 2 ) - 1 ];
		} else {
			median = values[ values.length / 2 - 1 ] + values[ values.length / 2 ];
			median /= 2;
		}

		KhanUtil.updateMean( mean );
		KhanUtil.updateMedian( median );
	},


	onMovePoint: function( point, x, y, animate ) {
		var points = KhanUtil.currentGraph.graph.points;

		// Don't do anything unless the point actually moved
		if ( point.coord[0] !== x ) {

			// don't allow the point to move past the bounds
			if ( x < -7 || x > 7 ) {
				return false;
			}

			point.coord = [ x, 0 ];

			// Figure out which points are at the same position
			var positions = {};
			// The point being dragged is always at the bottom of the pile
			positions[ Math.round(x * 2) / 2 ] = [ point ];

			jQuery.each( points, function() {
				if ( this !== point ) {
					var pos = Math.round( this.coord[0] * 2 ) / 2;
					if (!jQuery.isArray( positions[ pos ] )) {
						positions[ pos ] = [];
					}
					positions[ pos ].push( this );
				}
			});

			if (!animate) {
				KhanUtil.calculateAverages();
			}

			// Adjust the y-value of each point in case points are stacked
			jQuery.each( positions, function( value, points ) {
				points = points.sort (function(a, b){ return a.coord[1]-b.coord[1]; });
				jQuery.each( points, function( i, point ) {
					if (!animate) {
						point.moveTo(point.coord[0], 0.3 * i);
					} else {
						point.setCoord([ point.coord[0], 0.3 * i ]);
					}
				});
			});

			return [ x, 0 ];
		}
	},


	arrangePointsAroundMedian: function() {
		var graph = KhanUtil.currentGraph;
		var points = graph.graph.points;
		var targetMedian = graph.graph.targetMedian;
		var numPoints = graph.graph.numPoints;
		var maxWidth = Math.min( Math.abs( -7 - targetMedian ), Math.abs( 7 - targetMedian ) );

		var distance = 0.5;
		var newValues = [];
		if ( numPoints % 2 === 0 ) {
			newValues.push( targetMedian + distance );
			newValues.push( targetMedian - distance );
			distance += 0.5;
		} else {
			newValues.push( targetMedian );
		}

		while ( newValues.length < points.length ) {
			newValues.push( targetMedian + distance );
			newValues.push( targetMedian - distance );
			if ( distance >= maxWidth ) {
				distance = 0.5;
			} else {
				distance += 0.5;
			}
		}
		return KhanUtil.sortNumbers( newValues );
	},


	animatePoints: function( oldValues, newValues, newMedian, newMean ) {
		var graph = KhanUtil.currentGraph;
		var points = graph.graph.points;
		var sortedPoints = points.sort (function(a, b){ return a.coord[0]-b.coord[0]; });

		jQuery.each( oldValues, function( i, oldValue ) {
			jQuery({ 0: oldValue }).animate({ 0: newValues[i] }, {
				duration: 500,
				step: function( now, fx ) {
					KhanUtil.onMovePoint( sortedPoints[ i ], now, 0, true );
				}
			});
		});

		jQuery({ median: graph.graph.median, mean: graph.graph.mean }).animate({
			median: newMedian, mean: newMean
		}, {
			duration: 500,
			step: function( now, fx ) {
				if ( fx.prop === "median" ) {
					KhanUtil.updateMedian( KhanUtil.roundTo(2, now) );
				} else if ( fx.prop === "mean" ) {
					KhanUtil.updateMean( KhanUtil.roundTo(2, now) );
				}
			}
		});
	},


	showMedianExample: function( onComplete ) {
		var points = KhanUtil.currentGraph.graph.points;
		var targetMedian = KhanUtil.currentGraph.graph.targetMedian;
		var maxWidth = Math.min( Math.abs( -7 - targetMedian ), Math.abs( 7 - targetMedian ) );
		var sortedPoints = points.sort( function( a, b ) { return a.coord[0]-b.coord[0]; });
		var oldValues = [];
		jQuery.each( sortedPoints, function( i, point ) {
			oldValues.push( point.coord[0] );
		});
		var newValues = KhanUtil.arrangePointsAroundMedian();

		KhanUtil.animatePoints( oldValues, newValues, targetMedian, targetMedian );
	},


	showMeanExample: function() {
		var graph = KhanUtil.currentGraph;
		var points = graph.graph.points;

		var calculateMean = function( values ) {
			var mean = 0;
			jQuery.each( values, function() {
				mean += this;
			});
			mean /= values.length;
			return mean;
		}

		var sortedPoints = points.sort (function(a, b){ return a.coord[0]-b.coord[0]; });
		var oldValues = [];
		var newValues = [];
		jQuery.each( sortedPoints, function( i, point ) {
			oldValues.push( point.coord[0] );
		});

		var newValues = KhanUtil.arrangePointsAroundMedian();

		// Keep moving outlier points further away from the median until
		// we get to the right mean
		var mean = calculateMean( newValues );
		while ( mean != graph.graph.targetMean ) {
			if ( mean < graph.graph.targetMean ) {
				// Start by moving the right-most point further to the right, then the next, etc.
				var pointToMove = newValues.length - 1;
				while ( newValues[pointToMove] === 7 && pointToMove > (points.length / 2) ) {
					--pointToMove;
				}
				// If we move all the points on the right of the median all the way to the right
				// and we still don't have the right mean, start moving points on the left
				// closer to the median
				if ( pointToMove <= (points.length / 2) ) {
					pointToMove = 0;
				}
				newValues[pointToMove] += 0.5;
			} else {
				// Start by moving the left-most point further to the left, then the next, etc.
				var pointToMove = 0;
				while ( newValues[pointToMove] === -7 && pointToMove < (points.length / 2 - 1) ) {
					++pointToMove;
				}
				// If we move all the points on the left of the median all the way to the left
				// and we still don't have the right mean, start moving points on the right
				// closer to the median
				if ( pointToMove >= (points.length / 2 - 1) ) {
					pointToMove = newValues.length - 1;
				}
				newValues[pointToMove] -= 0.5;
			}
			mean = calculateMean( newValues );
			newValues = KhanUtil.sortNumbers( newValues );
		}

		KhanUtil.animatePoints( oldValues, newValues, graph.graph.targetMedian, graph.graph.targetMean );
	}

});


jQuery.extend( Khan.answerTypes, {
	exploringMeanMedian: function( solutionarea, solution, fallback, verifier, input ) {
		jQuery( solutionarea ).append( jQuery( solution ).clone().contents().tmpl() );

		ret = function() {
			var graph = KhanUtil.currentGraph;
			var points = graph.graph.points;

			ret.guess = [];
			jQuery.each( points, function( i, point ) {
				ret.guess.push( point.coord[0] );
			});

			if ( graph.graph.mean === 0 && graph.graph.median === 0 ) {
				// no guess, don't grade answer
				ret.guess = "";
				return false;
			} else if (
					graph.graph.mean !== graph.graph.targetMean ||
					graph.graph.median !== graph.graph.targetMedian ) {
				return false;
			} else {
				return true;
			}
		};
		ret.examples = [ "any arrangement of the orange dots so that the mean and median are correct" ];
		ret.solution = [ KhanUtil.currentGraph.graph.targetMean, KhanUtil.currentGraph.graph.targetMedian ];

		ret.showGuess = function( guess ) {
			jQuery.each( points, function( i, point ) {
				KhanUtil.onMovePoint( point, guess[i], 0 );
			});
		};
		return ret;
	}
});
