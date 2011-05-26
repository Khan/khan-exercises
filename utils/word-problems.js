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
		}
	});
};
