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
		{deg: 360, rad: "2\\pi"},
	],
//commonAngles2 should work to replace commonAngles as it has a common structure
//each of the 15 degree increments of the circle have been added as well as latex 
//coding for the radical values for sin, cos, and tangent
//size of data structure could be decreased by only storing values for 0-45 or 0-90
//would need to recode unit_circle_intuition
commonAngles2: [
		{deg:15,rad:"\\frac{\\pi}{12}",cos:"\\frac{\\sqrt{6}+\\sqrt{2}}{4}",sin:"\\frac{\\sqrt{6}-\\sqrt{2}}{4}",tan:"2-\\sqrt{3}"},
		{deg:30,rad:"\\frac{\\pi}{6}",cos:"\\frac{\\sqrt{3}}{2}",sin:"\\frac{1}{2}",tan:"\\frac{1}{\\sqrt{3}}"},
		{deg:45,rad:"\\frac{\\pi}{4}",cos:"\\frac{\\sqrt{2}}{2}",sin:"\\frac{\\sqrt{2}}{2}",tan:"1"},
		{deg:60,rad:"\\frac{\\pi}{3}",cos:"\\frac{1}{2}",sin:"\\frac{\\sqrt{3}}{2}",tan:"\\sqrt{3}"},
		{deg:75,rad:"\\frac{5\\pi}{12}",cos:"\\frac{\\sqrt{6}-\\sqrt{2}}{4}",sin:"\\frac{\\sqrt{6}+\\sqrt{2}}{4}",tan:"\\frac{1}{2-\\sqrt{3}}"},
		{deg:90,rad:"\\frac{\\pi}{2}",cos:"0",sin:"1",tan:"infinity"},
		{deg:105,rad:"\\frac{7\\pi}{12}",cos:"-\\frac{\\sqrt{6}-\\sqrt{2}}{4}",sin:"\\frac{\\sqrt{6}+\\sqrt{2}}{4}",tan:"\\frac{1}{\\sqrt{3}-2}"},
		{deg:120,rad:"\\frac{2\\pi}{3}",cos:"-\\frac{1}{2}",sin:"\\frac{\\sqrt{3}}{2}",tan:"-\\sqrt{3}"},
		{deg:135,rad:"\\frac{3\\pi}{4}",cos:"-\\frac{\\sqrt{2}}{2}",sin:"\\frac{\\sqrt{2}}{2}",tan:"-1"},
		{deg:150,rad:"\\frac{5\\pi}{6}",cos:"-\\frac{\\sqrt{3}}{2}",sin:"\\frac{1}{2}",tan:"-\\frac{1}{\\sqrt{3}}"},
		{deg:165,rad:"\\frac{11\\pi}{12}",cos:"-\\frac{\\sqrt{6}+\\sqrt{2}}{4}",sin:"\\frac{\\sqrt{6}-\\sqrt{2}}{4}",tan:"\\sqrt{3}-{2}"},
		{deg:180,rad:"\\pi",cos:"-1",sin:"0",tan:"0"},
		{deg:195,rad:"\\frac{13\\pi}{12}",cos:"-\\frac{\\sqrt{6}+\\sqrt{2}}{4}",sin:"-\\frac{\\sqrt{6}-\\sqrt{2}}{4}",tan:"2-\\sqrt{3}"},
		{deg:210,rad:"\\frac{7\\pi}{6}",cos:"-\\frac{\\sqrt{3}}{2}",sin:"-\\frac{1}{2}",tan:"\\frac{1}{\\sqrt{3}}"},
		{deg:225,rad:"\\frac{5\\pi}{4}",cos:"-\\frac{\\sqrt{2}}{2}",sin:"-\\frac{\\sqrt{2}}{2}",tan:"1"},
		{deg:240,rad:"\\frac{4\\pi}{3}",cos:"-\\frac{1}{2}",sin:"-\\frac{\\sqrt{3}}{2}",tan:"\\sqrt{3}"},
		{deg:255,rad:"\\frac{17\\pi}{12}",cos:"-\\frac{\\sqrt{6}-\\sqrt{2}}{4}",sin:"-\\frac{\\sqrt{6}+\\sqrt{2}}{4}",tan:"\\frac{1}{2-\\sqrt{3}}"},
		{deg:270,rad:"\\frac{3\\pi}{2}",cos:"0",sin:"-1",tan:"infinity"},
		{deg:285,rad:"\\frac{19\\pi}{12}",cos:"\\frac{\\sqrt{6}-\\sqrt{2}}{4}",sin:"-\\frac{\\sqrt{6}+\\sqrt{2}}{4}",tan:"\\frac{1}{\\sqrt{3}-2}"},
		{deg:300,rad:"\\frac{5\\pi}{3}",cos:"\\frac{1}{2}",sin:"-\\frac{\\sqrt{3}}{2}",tan:"\\sqrt{3}"},
		{deg:315,rad:"\\frac{7\\pi}{4}",cos:"\\frac{\\sqrt{2}}{2}",sin:"-\\frac{\\sqrt{2}}{2}",tan:"-1"},
		{deg:330,rad:"\\frac{11\\pi}{6}",cos:"\\frac{\\sqrt{3}}{2}",sin:"-\\frac{1}{2}",tan:"\\frac{1}{\\sqrt{3}}"},
		{deg:345,rad:"\\frac{23\\pi}{12}",cos:"\\frac{\\sqrt{6}+\\sqrt{2}}{4}",sin:"-\\frac{\\sqrt{6}-\\sqrt{2}}{4}",tan:"2-\\sqrt{3}"},
		{deg:360,rad:"2\\pi",cos:"1",sin:"0",tan:"0"},
	],	
	
	
	
		// Convert a degree value to a radian value
	toRadians: function( degrees ) {
		return degrees * Math.PI / 180;
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
