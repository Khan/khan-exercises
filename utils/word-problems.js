// Example usage:
// <var>person(1)</var> traveled 5 mi by <var>vehicle(1)</var>. Let
// <var>his(1)</var> average speed be <var>personVar(1)</var>.
// Let <var>person(2)</var>'s speed be <var>personVar(2)</var>.
//
// Note that initials (-Var) are guaranteed to be unique in each category,
// but not across them.

jQuery.extend( KhanUtil, {
	toSentence: function( array, conjunction ) {
		if ( conjunction == null ) {
			conjunction = "and";
		}

		if ( array.length == 0 ) {
			return "";
		} else if ( array.length == 1 ) {
			return array[0];
		} else if ( array.length == 2 ) {
			return array[0] + " " + conjunction + " " + array[1];
		} else {
			return array.slice(0, -1).join(", ") + ", " + conjunction + " " + array[ array.length - 1 ];
		}
	}
});

jQuery.fn[ "word-problemsLoad" ] = function() {
	if(!this.is(".exercise")) {
		return;
	}

	var people = KhanUtil.shuffle([
		["Ashley", "f"],
		["Brandon", "m"],
		["Christopher", "m"],
		["Daniel", "m"],
		["Emily", "f"],
		["Gabriela", "f"],
		["Ishaan", "m"],
		["Jessica", "f"],
		["Kevin", "m"],
		["Luis", "m"],
		["Michael", "m"],
		["Nadia", "f"],
		["Omar", "m"],
		["Stephanie", "f"],
		["Tiffany", "f"],
		["Umaima", "f"],
		["Vanessa", "f"],
		["William", "m"]
	]);

	var vehicles = KhanUtil.shuffle([
		"bike",
		"car",
		"horse",
		"motorcycle",
		"scooter",
		"train"
	]);

	var courses = KhanUtil.shuffle([
		"algebra",
		"chemistry",
		"geometry",
		"history",
		"physics",
		"Spanish"
	]);

	var exams = KhanUtil.shuffle([
		"exam",
		"test",
		"quiz"
	]);

	var binops = KhanUtil.shuffle([
		"\\barwedge",
		"\\veebar",
		"\\odot",
		"\\oplus",
		"\\otimes",
		"\\oslash",
		"\\circledcirc",
		"\\boxdot",
		"\\bigtriangleup",
		"\\bigtriangledown",
		"\\dagger",
		"\\diamond",
		"\\star",
		"\\triangleleft",
		"\\triangleright"
	]);

	var collections = KhanUtil.shuffle([
		["chair", "row", "make"],
		["party favor", "bag", "fill"],
		["jelly bean", "pile", "make"],
		["book", "shelf", "fill"],
		["can of food", "box", "fill"]
	]);

	var stores = KhanUtil.shuffle([
		{
			name: "office supply",
			items: KhanUtil.shuffle( ["pen", "pencil", "notebook"] )
		},
		{
			name: "hardware",
			items: KhanUtil.shuffle( ["hammer", "nail", "saw"] )
		},
		{
			name: "grocery",
			items: KhanUtil.shuffle( ["banana", "loaf of bread", "gallon of milk", "potato"] )
		},
		{
			name: "gift",
			items: KhanUtil.shuffle( ["toy", "game", "souvenir"] )
		},
		{
			name: "toy",
			items: KhanUtil.shuffle( ["stuffed animal", "video game", "race car", "doll"] )
		}
	]);

	jQuery.extend( KhanUtil, {
		person: function( i ) {
			return people[i - 1][0];
		},

		personVar: function( i ) {
			return people[i - 1][0].charAt(0).toLowerCase();
		},

		he: function( i ) {
			return people[i - 1][1] == "m" ? "he" : "she";
		},

		He: function( i ) {
			return people[i - 1][1] == "m" ? "He" : "She";
		},

		him: function( i ) {
			return people[i - 1][1] == "m" ? "him" : "her";
		},

		his: function( i ) {
			return people[i - 1][1] == "m" ? "his" : "her";
		},

		His: function( i ) {
			return people[i - 1][1] == "m" ? "His" : "Her";
		},

		vehicle: function( i ) {
			return vehicles[i - 1];
		},

		vehicleVar: function( i ) {
			return vehicles[i - 1].charAt(0);
		},

		course: function( i ) {
			return courses[i - 1];
		},

		courseVar: function( i ) {
			return courses[i - 1].charAt(0).toLowerCase();
		},

		exam: function( i ) {
			return exams[i - 1];
		},

		binop: function( i ) {
			return binops[i - 1];
		},

		item: function( i ) {
			return collections[i - 1][0];
		},

		group: function( i ) {
	    		return collections[i - 1][1];
		},

		groupVerb: function( i ) {
			return collections[i - 1][2];
		},

		store: function( i ) {
			return stores[i].name;
		},

		storeItem: function( i, j ) {
			return stores[i].items[j];
		}
	});
};
