({
	"nl" : {
		"question1" : '<var>person(1)</var> stopt <var>plural( item(1) )</var> in <var>plural( group(1) )</var>.\
					Als <var>he(1)</var> <var>plural( ITEMS_PER_GROUP, item(1) )</var>\
					in elke <var>group(1)</var> stopt, <var>groupVerb(1)</var> <var>he(1)</var>\
					<var>plural( GROUPS, group(1) )</var> en blijven er\
					<var>plural( ITEMS_LEFT, item(1) )</var> over.\
					Als <var>he(1)</var> in plaats daarvan\
					<var>plural( NEW_ITEMS_PER_GROUP, item(1) )</var> in elke\
					<var>group(1)</var> stopt, hoeveel <var>plural( group(1) )</var> met\
					<var>plural( item(1) )</var> <var>groupVerb(1)</var> <var>he(1)</var> dan?',
		"hint1.1" : '<var>plural( GROUPS, group(1) )</var> of\
						<var>plural( ITEMS_PER_GROUP, item(1) )</var> each results in\
						<code><var>GROUPS</var> \times <var>ITEMS_PER_GROUP</var> = <var>ITEMS_IN_GROUPS</var></code>\
						<var>plural( item )</var>.',
		"hint1.2" : '<var>plural( ITEMS_IN_GROUPS, item(1) )</var> plus\
						<var>ITEMS_LEFT</var> left over equals\
						<var>TOTAL_ITEMS</var> total <var>plural( item(1) )</var>.',
		
		"hint1.3" : '<var>plural( TOTAL_ITEMS, item(1) )</var>\
						divided into groups of <var>NEW_ITEMS_PER_GROUP</var> is\
						<code><var>TOTAL_ITEMS</var> \div <var>NEW_ITEMS_PER_GROUP</var> = <var>NEW_GROUPS</var></code>\
						<var>plural( group(1) )</var>.',
		
		"question2"  : '<var>person(1)</var> kocht <var>plural( ITEM_1_COUNT, storeItem(1, 1) )</var>,\
					elk voor dezelfde prijs, in de <var>store(1)</var> winkel.\
					<var>He(1)</var> kocht ook een <var>storeItem(1, 2)</var> voor <var>plural( ITEM_2_COST, "dollar" )</var>.\
					<var>He(1)</var> heeft in totaal <var>plural( TOTAL_SPENT, "dollar" ) uitgegeven</var>.\
					Hoeveel heeft elke <var>storeItem(1, 1)</var> gekost?',	
		"hint2.1" : 'Of the <var>plural( TOTAL_SPENT, "dollar" )</var>, <var>he(1)</var> spent\
						<var>plural( ITEM_2_COST, "dollar" )</var> on a <var>storeItem(1, 2)</var>, so <var>he(1)</var> must have spent\
						a total of <code><var>TOTAL_SPENT</var> - <var>ITEM_2_COST</var> = <var>TOTAL_SPENT_ON_1</var></code>\
						dollars on <var>plural( storeItem(1, 1) )</var>.',	
		"hint2.2" : '<var>He(1)</var> spent <var>plural( TOTAL_SPENT_ON_1, "dollar" )</var> on\
						<var>plural( ITEM_1_COUNT, storeItem(1, 1) )</var>,\
						so <var>he(1)</var> must have spent\
						<code><var>TOTAL_SPENT_ON_1</var> \div <var>ITEM_1_COUNT</var> = <var>ITEM_1_COST</var></code>\
						dollars on each <var>storeItem(1, 1)</var>.',		
		"question3"  : '<var>person(1)</var> has a bunch of <var>plural( item(1) )</var>. When <var>person(1)</var> places <var>plural( ITEMS, item(1) )</var> in each\
					<var>group(1)</var>, <var>he(1)</var> ends up with <var>plural( GROUPS, group(1) )</var>.\
					If <var>he(1)</var> wants <var>plural( NEW_GROUPS, group(1) )</var>,\
					how many <var>plural( item(1) )</var> should <var>he(1)</var> put in each <var>group(1)</var>?',
		"hint3.1" : '<var>plural( ITEMS, item(1) )</var> <code>\times</code>\
						<var>plural( GROUPS, group(1) )</var> <code>=</code>\
						<var>plural( TOTAL_ITEMS, item(1) )</var>.',
	    "hint3.2" : 'If we divide the <var>plural( TOTAL_ITEMS, item(1) )</var> into\
						<var>plural( NEW_GROUPS, group(1) )</var>, then we get\
						<code><var>TOTAL_ITEMS</var> \div <var>NEW_GROUPS</var> = <var>NEW_ITEMS</var></code>\
						<var>plural( item(1) )</var> per <var>group(1)</var>.'
	}
})