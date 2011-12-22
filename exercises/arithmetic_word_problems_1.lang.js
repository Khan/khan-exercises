({
	"nl" : {
		"hint1"		: 'Before the previous stop there <var>plural("was", TOTAL)</var> <var>plural(TOTAL, "person")</var> riding on a train.'+
					'<var>plural(NUM2, "person")</var> ended up getting off at the stop.',
		"hint2"		: 'How many people are riding the train now?',
		"hint3"		: 'The number riding the train now is the difference between the number who were riding and the number who got off at the previous stop.',
		"hint4"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code> <var>plural("person")</var> on the train.',
		"hint5"		: '<code><var>TOTAL</var> - <var>NUM2</var> = <var>NUM1</var></code> <var>plural("person", NUM1)</var> <var>plural("is", NUM1)</var> on the train.',
		"hint6"		: 'There <var>plural("is", NUM1)</var> <var>plural(NUM1, "person")</var> riding on a train.',
		"hint7"		: 'How many people were riding the train before the stop?',
		"hint8"		: 'The number riding the train before the stop is the sum of the number who are riding now and the number who got off at the previous stop.',
		"hint9"		: 'The sum is <code><var>NUM1</var> + <var>NUM2</var></code> <var>plural("person")</var> on the train.',
		"hint10"		: '<code><var>NUM1</var> + <var>NUM2</var> = <var>TOTAL</var></code> <var>plural("person")</var> <var>plural("is", TOTAL)</var> on the train.',
		"hint11"		: 'There <var>plural("was", TOTAL)</var> <var>plural(TOTAL, "person")</var> riding on a train before it stopped and some number of people got off.'+
					'Now there <var>plural("is", NUM2)</var> <var>plural(NUM2, "person")</var> riding on the train.',
		"hint12"		: 'How many people got off the train at the stop?',
		"hint13"		: 'The number of people who got off is the difference between the number who were riding before and the number who are riding now.',
		"hint14"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code> <var>plural("person")</var>.',
		"hint15"		: '<code><var>TOTAL</var> - <var>NUM2</var> = <var>NUM1</var></code> <var>plural("person", NUM1)</var> got off.',
		"hint16"		: 'There <var>plural("is", NUM1)</var> <var>plural(NUM1, "tree")</var> on the right bank of a river and <var>plural(NUM2, "tree")</var> on the left bank.',
		"hint17"		: 'How many trees are on the banks of the river?',
		"hint18"		: 'The total number of trees on the two banks of the river is the sum of the number of trees on the left bank and the number of trees on the right bank.',
		"hint19"		: 'The sum is <code><var>NUM1</var> + <var>NUM2</var></code> <var>plural("tree")</var>.',
		"hint20"		: 'There <var>plural("is", TOTAL)</var> <var>plural(TOTAL, "tree")</var> on the banks of the river. The <var>side(1)</var> bank has <var>NUM2</var> of them.',
		"hint21"		: 'How many trees are on the <var>side(2)</var> bank of the river?',
		"hint22"		: 'he number of trees on the <var>side(2)</var> bank of the river is the difference between the number of trees on both banks of the river and the number of trees on the <var>side(1)</var> bank.',
		"hint23"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code> <var>plural("tree")</var>.',
		"hint24"		: 'Some cars were parked in the <var>store(1)</var> store parking lot.'+
					'<var>NUM2</var> more <var>plural("car")</var> <var>plural("parks", "park", NUM2)</var> at the <var>store(1)</var> store,'+
					'and now there <var>plural("is", TOTAL)</var> <var>plural(TOTAL, "car")</var> in the parking lot.',
		"hint25"		: 'How many cars were parked at the <var>store(1)</var> store at the beginning?',
		"hint26"		: 'The number of cars parked at the store at the beginning is the difference of the number parked now and the number that came and parked earlier.',
		"hint27"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code> <var>plural("car")</var>.',
		"hint28"		: 'Initially there <var>plural( "was", NUM2 )</var> <var>plural( NUM2, "car" )</var> parked in the <var>store(1)</var> store parking lot.'+
					'During the following <var>randRange( 2, 3 )</var> hours some more cars parked at the <var>store(1)</var> store, and now there <var>plural("is", TOTAL)</var> <var>plural(TOTAL, "car")</var> in the parking lot. No cars left the parking lot during this time.',
		"hint29"		: 'How many cars parked in the <var>store( 1 )</var> store parking lot after the initial <var>plural( NUM2, "car" )</var>?',
		"hint30"		: 'The number of cars that came and parked at the store is the difference between the number that were parked earlier and the number that are parked now.',
		"hint31"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code> <var>plural("car")</var>.',
		"hint32"		: '<var>plural(NUM1, "car")</var> <var>plural("was", NUM1)</var> in the <var>store(1)</var> store parking lot.'+
					'<var>NUM2</var> more <var>plural("car", NUM2)</var> <var>plural("parks", "park", NUM2)</var> at the <var>store(1)</var> store.',
		"hint33"		: 'How many cars are in the parking lot now?',
		"hint34"		: 'The number of cars that are parked now is the sum of the number that were parked earlier and the number that came to park.',
		"hint35"		: 'The sum is <code><var>NUM1</var> + <var>NUM2</var></code> <var>plural("car")</var>.',
		"hint36"		: '<var>person(1)</var> did <var>plural(TOTAL, exercise(1))</var> <var>timeofday(1)</var>.'+
					'<var>person(2)</var> did <var>plural(NUM2, exercise(1))</var> <var>timeofday(2)</var>.',
		"hint37"		: 'How many more <var>plural(exercise(1))</var> did <var>person(1)</var> do than <var>person(2)</var>?',
		"hint38"		: "Find the difference between <var>person(1)</var>'s <var>plural(exercise(1))</var> and <var>person(2)</var>'s <var>plural(exercise(1))</var>.",
		"hint39"		: 'The difference is <code><var>TOTAL</var> - <var>NUM2</var></code>.',
		"hint40"		: 'How many fewer <var>plural(exercise(1))</var> did <var>person(2)</var> do than <var>person(1)</var>?',
		"hint41"		: '<var>person(1)</var> did <var>NUM1</var> more <var>plural(exercise(1), NUM1)</var> than <var>person(2)</var> <var>timeofday(1)</var>.'+
					'<var>person(2)</var> did <var>plural(NUM2, exercise(1))</var>.',
		"hint42"		: 'How many <var>plural(exercise(1))</var> did <var>person(1)</var> do?',
		"hint43"		: '<var>person(2)</var> did <var>plural(NUM2, exercise(1))</var>, and <var>person(1)</var> did <var>NUM1</var> more than that, so find the sum.',
		"hint44"		: 'The sum is <code><var>NUM2</var> + <var>NUM1</var></code> <var>plural(exercise(1))</var>.',
		"hint45"		: '<var>He(1)</var> did <code><var>NUM2</var> + <var>NUM1</var> = <var>TOTAL</var></code> <var>plural(exercise(1))</var>.',
		"hint46"		: '<var>person(2)</var> did <var>NUM1</var> fewer <var>plural(exercise(1), NUM1)</var> than <var>person(1)</var> <var>timeofday(1)</var>.'+
					'<var>person(2)</var> did <var>plural(NUM2, exercise(1))</var>.',
		"hint47"		: 'How many <var>plural(exercise(1))</var> did <var>person(2)</var> do?',
		"hint48"		: '<var>person(1)</var> did <var>plural(TOTAL, exercise(1))</var>, and <var>person(2)</var> did <var>NUM1</var> fewer than that, so find the difference.',
		"hint49"		: 'The difference is <code><var>TOTAL</var> - <var>NUM1</var></code> <var>plural(exercise(1))</var>.',
		"hint50"		: '<var>He(2)</var> did <code><var>TOTAL</var> - <var>NUM1</var> = <var>NUM2</var></code> <var>plural(exercise(1), NUM2)</var>.',
		"hint51"		: '<var>person(2)</var> did <var>NUM1</var> fewer <var>plural(exercise(1), NUM1)</var> than <var>person(1)</var> <var>timeofday(1)</var>.'+
					'<var>person(1)</var> did <var>plural(TOTAL, exercise(1))</var>'
		}
})