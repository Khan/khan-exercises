({
	"nl" : {
		"question1"	: 'Arrange the <var>POINTS</var> orange points on the number line so the'+
					'<span class="hint_blue">arithmetic mean is <code><var>MEAN</var></code></span>'+
					'and the <span class="hint_green">median is <code><var>MEDIAN</var></code></span>.'+
					'The distance between adjacent tick marks is 1.',
		"question2"	: 'Move the orange dots to select your answer.',
		
		"hint1"		: 'The median is middle number. In other words there are always as many points to the'+
						'right of the median as to the left.',
		"hint2"		: 'Try dragging the points so that half of them are to the left of'+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span>'+
						 'and half of them are to the right of'+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'<span data-if="POINTS % 2 === 0">'+
							'The two points in the middle should be the same distance from'+
							'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'</span>'+
						'<span data-else>'+
							'The middle point should be at'+
							'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'</span><br />'+
						'<input type="button" value="Show me an example" onClick="javascript:'+
							'KhanUtil.showMedianExample();'+
						'"></button>',
		"hint3"		: 'As long as there are as many points to the left and to the right of the'+
						'median, the median will stay the same. But the arithmetic mean is calculated'+
						'using the value of every point. Try moving the points on either side of the'+
						'median closer and further from the median to see how the mean is affected.',
		"hint4"		: 'There are a number of different ways to arrange the points so the mean is'+
						'<span class="hint_blue"><code><var>MEAN</var></code></span>'+
						'and the median is'+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'<input type="button" value="Show me an example" onClick="javascript:'+
							'KhanUtil.showMeanExample();'+
						'"></button>'
		}
})