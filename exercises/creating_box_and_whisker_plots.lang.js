({
	"nl" : {
		"question1"	: 'Represent the following data using a box-and-whiskers plot:',
		
		"problem1"	: '<ul id="sortable">'+
					  '<li data-each="DATA as NUM">'+
					  '<code><var>NUM</var></code>'+
					  '</li>'+
					  '</ul>'+
					  "If it helps, you may drag the numbers to put them in a different order. The order isn't checked with your answer."+
					  '<var>SORTER.init( "sortable" )</var>',
		"problem2"	: 'Drag each part of the box-and-whiskers plot left and right so it correctly represents the data.',
		
		"hint1"		: 'Begin by putting the data in order:',
		"hint2"		: 'Plot the sample minimum (smallest number):',
		"hint3"		: 'Plot the sample maximum (largest number):',
		"hint4"		: 'Plot the median (middle number):',
		"hint5"		: "Plot the first quartile (halfway between the smallest number and the middle number). Since there isn't"+
				      'a single number halfway between the smallest number and the median, average the two numbers to get'+
				      '<code class="hint_pink"><var>Q1</var></code>:',
		"hint6"		: "Plot the third quartile (halfway between the middle number and the largest number). Since there isn't"+
				      'a single number halfway between the median and the largest number, average the two numbers to get'+
				      '<code class="hint_pink"><var>Q3</var></code>:',
		"hint7"		: 'Your box-and-whisker plot should look like the example below the number line.'
		}
})