({
	"nl" : {
		"question1"	: '<var>An( color(1) )</var> <var>clothing(1)</var> costs <code>$<var>NUM1</var></code>,'+
				'and a popular <var>color(2)</var> <var>clothing(2)</var> costs <code><var>NUM2</var></code> times as much.',
		"question2"	: 'How much does the <var>color(2)</var> <var>clothing(2)</var> cost?',
		"question3"	: '<var>An( color(1) )</var> <var>clothing(1)</var> costs $<var>TOTAL</var>,'+
				'which is <var>NUM2</var> times as much as <var>an( color(2) )</var> <var>clothing(2)</var> costs.',
		"question4"	: 'How much does the <var>color(2)</var> <var>clothing(2)</var> cost?',
		"question5"	: '<var>An( color(1) )</var> <var>clothing(1)</var> costs $<var>TOTAL</var>,'+
				'and <var>an( color(2) )</var> <var>clothing(2)</var> costs $<var>NUM2</var>.',
		"question6"	: 'The <var>color( 1 )</var> <var>clothing( 1 )</var> costs how many times as much as'+
				'the <var>color( 2 )</var> <var>clothing( 2 )</var> costs?',
		"question7"	: '<var>person(1)</var> <var>rode(1)</var> <var>his(1)</var> <var>bike(1)</var> for <var>plural( NUM1, distance(1) )</var> on each of the past <var>NUM2</var> days.',
		"question8"	: 'How many <var>plural( distance(1) )</var> did <var>person(1)</var> <var>ride(1)</var> <var>his(1)</var> <var>bike(1)</var> altogether?',
		"question9"	: '<var>person(1)</var> <var>rode(1)</var> <var>his(1)</var> <var>bike(1)</var> for a total of <var>plural( TOTAL, distance(1) )</var> over the past <var>NUM2</var> days, and <var>he( 1 )</var> <var>rode( 1 )</var> the same amount each day.',
		"question10": 'How many <var>plural( distance(1) )</var> did <var>person(1)</var> <var>ride(1)</var> <var>his(1)</var> <var>bike(1)</var> each day?',
		"question11": '<var>person(1)</var> has <var>biked(1)</var> <var>his(1)</var> <var>bike(1)</var> for a total of <var>plural( TOTAL, distance(1) )</var> '+
				'since <var>he(1)</var> started <var>biking(1)</var> daily. <var>He(1)</var> has been <var>biking(1)</var> <var>plural( NUM2, distance(1) )</var> each day.',
		"question12": 'For how many days has <var>person(1)</var> been <var>biking(1)</var>?',
		"question13": '<var>person(1)</var> is a <var>farmer(1)</var>.'+
				"<var>He(1)</var> plants <var>plural( NUM1, 'row' )</var> of <var>plural( crop(1) )</var> in a <var>field(1)</var>,"+
				'and each row has <var>plural( NUM2, crop(1) )</var>.',
		"question14": 'How many <var>plural( crop(1) )</var> did <var>person(1)</var> plant in the <var>field(1)</var>?',
		"question15": '<var>person(1)</var> is a <var>farmer(1)</var>.'+
				"<var>He(1)</var> plants <var>plural( NUM1, 'row' )</var> of <var>plural( crop(1) )</var> in a <var>field(1)</var>,"+
				'with each row having the same number of <var>plural( crop(1) )</var>.'+
				'<var>He(1)</var> plants a total of <var>plural( TOTAL, crop(1) )</var> in the <var>field(1)</var>.',
		"question16": 'How many <var>plural( crop(1) )</var> did <var>person(1)</var> plant in each row?',
		"question17": '<var>person(1)</var> is a <var>farmer(1)</var>.'+
				'<var>He(1)</var> plants <var>plural( TOTAL, crop(1) )</var> in a <var>field(1)</var>,'+
				'and each row has <var>plural( NUM1, crop(1) )</var>.',
		"question18": "How many <var>plural( 'row' )</var> of <var>plural( crop(1) )</var> did <var>person(1)</var> plant in the <var>field(1)</var>?",
		
		"hint1"		: 'The cost of the <var>color(2)</var> <var>clothing(2)</var>'+
					'is a multiple of the cost of the <var>color(1)</var> <var>clothing(1)</var>,'+
					'so find the product.',
		"hint2"		: 'The product is <code><var>NUM2</var> \times $<var>NUM1</var></code>.',
		"hint3"		: 'The <var>color(2)</var> <var>clothing(2)</var> costs <code>$<var>TOTAL</var></code>.',
		"hint4"		: 'The cost of the <var>color(1)</var> <var>clothing(1)</var>'+
					'is a multiple of the cost of the <var>color(2)</var> <var>clothing(2)</var>,'+
					'so find the result of dividing.',
		"hint5"		: 'This result, called the quotient, is equal to <code>$<var>TOTAL</var> \div <var>NUM2</var></code>.',
		"hint6"		: '<var>An( color( 2 ) )</var> <var>clothing( 2 )</var> costs <code>$<var>NUM1</var></code>.',
		"hint7"		: 'The cost of the <var>color(1)</var> <var>clothing(1)</var>'+
					'is a multiple of the cost of the <var>color(2)</var> <var>clothing(2)</var>,'+
					'so find the result of dividing.',
		"hint8"		: 'This result, called the quotient, is <code>$<var>TOTAL</var> \div $<var>NUM2</var></code>.',
		"hint9"		: 'The <var>color( 1 )</var> <var>clothing( 1 )</var> costs <code><var>NUM1</var></code> times as much as '+
					'the <var>color( 2 )</var> <var>clothing( 2 )</var> costs.',
		"hint10"	: 'The total number of <var>plural( distance(1) )</var> <var>biked(1)</var>'+
					'is the product of the number of <var>plural( distance(1) )</var> <var>biked(1)</var> each day'+
					'and the number of days that <var>person(1)</var> went <var>biking(1)</var>.',
		"hint11"	: 'The product is <code><var>NUM1</var>\text{ <var>plural( distance( 1 ) )</var> per day} \times <var>NUM2</var>\text{ days}</code>.',
		"hint12"	: '<code><var>NUM1</var>\text{ <var>plural( distance( 1 ) )</var> per day} \times <var>NUM2</var>\text{ days}= <var>TOTAL</var>\text{ <var>plural( distance(1) )</var>}</code>',
		"hint13"	: '<var>person( 1 )</var> <var>biked( 1 )</var> a total of <var>plural( TOTAL, distance( 1 ) )</var>.',
		"hint14"	: 'The number of <var>plural( distance(1) )</var> <var>biked(1)</var> each day'+
					'is the total number of <var>plural( distance(1) )</var> <var>biked(1)</var> divided'+
					'by the number of days that <var>person(1)</var> went <var>biking(1)</var>.',
		"hint15"	: 'We are looking for the quotient, which is <code><var>TOTAL</var>\text{ <var>plural( distance( 1 ) )</var>} \div <var>NUM2</var>\text{ days}</code>.',
		"hint16"	: '<code><var>TOTAL</var>\text{ <var>plural( distance( 1 ) )</var>} \div <var>NUM2</var>\text{ days} = <var>NUM1</var> \text{ <var>plural( distance(1) )</var> per day}</code>',
		"hint17"	: '<var>person( 1 )</var> <var>biked( 1 )</var> <var>NUM1</var> <var>plural( distance(1) )</var> each day.',
		"hint18"	: 'The number of days that <var>person(1)</var> has been <var>biking(1)</var>'+
					'is the total number of <var>plural( distance(1) )</var> <var>biked(1)</var> divided '+
					'by the number of <var>plural( distance(1) )</var> <var>biked(1)</var> each day.',
		"hint19"	: '<code><var>TOTAL</var>\text{ <var>plural( distance( 1 ) )</var>} \div <var>NUM2</var>\text{ <var>plural( distance( 1 ))</var> each day} = \text{number of days driving}</code>',
		"hint20"	: '<code><var>TOTAL</var>\text{ <var>plural( distance( 1 ) )</var>} \div <var>NUM2</var>\text{ <var>plural( distance( 1 ))</var> each day} = <var>NUM1</var>\text{ days}</code>',
		"hint21"	: 'The number of <var>plural( crop(1) )</var> that <var>person(1)</var> planted'+
					'is the product of the number of rows that <var>he(1)</var> planted and'+
					'the number of <var>plural( crop(1) )</var> planted in each row.',
		"hint22"	: 'The product is <code><var>NUM1</var>\text{ rows of <var>plural( crop( 1 ) )</var>} \times <var>NUM2</var>\text{ <var>plural( crop( 1 ) )</var> per row}</code>.',
		"hint23"	: '<code><var>NUM1</var>\text{ rows of <var>plural( crop( 1 ) )</var>} \times <var>NUM2</var>\text{ <var>plural( crop( 1 ) )</var> per row} = <var>TOTAL</var></code> <var>plural( crop(1) )</var>',
		"hint24"	: 'The number of <var>plural( crop(1) )</var> that <var>person(1)</var> planted'+
					'in each row is the total number of <var>plural( crop(1) )</var> that <var>he(1)</var> planted'+
					'divided by the number of rows.',
		"hint25"	: 'The result, called the quotient, is <code><var>TOTAL</var>\text{ <var>plural( crop( 1 ) )</var>} \div <var>NUM1</var>\text{ rows of <var>plural( crop( 1 ) )</var>}</code>.',
		"hint26"	: '<code><var>TOTAL</var>\text{ <var>plural( crop( 1 ) )</var>} \div <var>NUM1</var>\text{ rows of <var>plural( crop( 1 ) )</var>} = <var>NUM2</var>\text{ <var>plural( crop(1) )</var> per row}</code>',
		"hint27"	: "The number of <var>plural( 'row' )</var> of <var>plural( crop(1) )</var> that <var>person(1)</var> planted"+
					'is the total number of <var>plural( crop(1) )</var> that <var>he(1)</var> planted'+
					'divided by the number of <var>plural( crop(1) )</var> in each row.',
		"hint28"	: 'The result, called the quotient, is <code><var>TOTAL</var>\text{ <var>plural( crop( 1 ) )</var>} \div <var>NUM1</var>\text{ <var>plural( crop(1) )</var> per row}</code>.',
		"hint29"	: "<code><var>TOTAL</var>\text{ <var>plural( crop( 1 ) )</var>} \div <var>NUM1</var>\text{ <var>plural( crop(1) )</var> per row} = <var>NUM2</var>\text{  <var>plural( 'row' )</var>}</code>"
		}
})