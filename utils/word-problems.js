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
		["chair", "chairs", "row", "rows", "make"],
		["party favor", "party favors", "bag", "bags", "fill"],
		["jelly bean", "jelly beans", "pile", "piles", "make"],
		["book", "books", "shelf", "shelves", "fill"],
		["can of food", "cans of food", "box", "boxes", "fill"]
	]);

	var stores = KhanUtil.shuffle([
		{
			name: "office supply",
			items: KhanUtil.shuffle([
				["pen", "pens"],
				["pencil", "pencils"],
				["notebook", "notebooks"]
			])
		},
		{
			name: "hardware",
			items: KhanUtil.shuffle([
				["hammer", "hammers"],
				["nail", "nails"],
				["saw", "saws"]
			])
		},
		{
			name: "grocery",
			items: KhanUtil.shuffle([
				["banana", "bananas"],
				["loaf of bread", "loaves of bread"],
				["gallon of milk", "gallons of milk"],
				["potato", "potatoes"]
			])
		},
		{
			name: "gift",
			items: KhanUtil.shuffle([
				["toy", "toys"],
				["game", "games"],
				["souvenir", "souvenirs"]
			])
		},
		{
			name: "toy",
			items: KhanUtil.shuffle([
				["stuffed animal", "stuffed animals"],
				["video game", "video games"],
				["race car", "race cars"],
				["doll", "dolls"]
			])
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

		Him: function( i ) {
			return people[i - 1][1] == "m" ? "Him" : "Her";
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

		itemPlural: function( i ) {
			return collections[i - 1][1];
		},

		group: function( i ) {
	    		return collections[i - 1][2];
		},

		groupPlural: function( i ) {
			return collections[1 - 1][3];
		},

		groupVerb: function( i ) {
			return collections[i - 1][4];
		},

		store: function( i ) {
			return stores[i].name;
		},

		storeItem: function( i, j ) {
			return stores[i].items[j][0];
		},

		storeItemPlural: function( i, j ) {
			return stores[i].items[j][1];
		}
	});
};
