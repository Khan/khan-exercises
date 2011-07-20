jQuery.extend(KhanUtil, {
	PRECISION: 2,
	VARIABLES: ["d", "v_i", "v_f", "a", "t"],
	UNITS: {
		"d": "m",
		"v_i": "m/s",
		"v_f": "m/s",
		"a": "m/s^2",
		"t": "s"
	},
	PRETTY_UNITS: {
		"d": "\\text{m}",
		"v_i": "\\frac{\\text{m}}{\\text{s}}",
		"v_f": "\\frac{\\text{m}}{\\text{s}}",
		"a": "\\frac{\\text{m}}{\\text{s}^2}",
		"t": "\\text{s}"
	},


	rollUnknowns: function() {
		var omitted, unknown;
		do {
			omitted = KhanUtil.randFromArray(KhanUtil.VARIABLES);
			unknown = KhanUtil.randFromArray(KhanUtil.VARIABLES);
		} while (omitted === unknown);
		return [omitted, unknown];
	},

	randomFreefallMotion: function() {
		var accel = -9.8;
		var v_init = (KhanUtil.rand(2) ? 0 : KhanUtil.randRange(-100, 300)/10);
		var time = KhanUtil.randRange(0, 200)/10;
		var disp = v_init*time + (1/2)*accel*time*time;
		var v_final = v_init + accel * time;

		var unknowns = KhanUtil.rollUnknowns();

		return {
			d: disp,
			v_i: v_init,
			v_f: v_final,
			a: accel,
			t: time,

			omitted: unknowns[0],
			unknown: unknowns[1]
		};
	},

	randomConstantMotion: function() {
		var accel = 0;
		var time = KhanUtil.randRange(1, 25);
		var veloc = KhanUtil.randRange(5, 25);
		var disp = time * veloc;

		var unknowns;
		do {
			unknowns = KhanUtil.rollUnknowns();
		} while ( ( unknowns[0] === "d" && unknowns[1] === "t" ) ||
				( unknowns[0] === "t" && unknowns[1] === "d" ) );

		return {
			d: disp,
			v_i: veloc,
			v_f: veloc,
			a: accel,
			t: time,

			omitted: unknowns[0],
			unknown: unknowns[1]
		};
	},

	randomAccelMotion: function() {
		// generated numbers are going to be messy anyway, so might as well
		// make them all messy
		var accel = KhanUtil.randRangeNonZero(-200, 200)/10;
		var v_init = KhanUtil.randRange(-400, 400)/10;
		var time = KhanUtil.randRange(100, 200)/10;
		var disp = v_init * time + (1/2) * accel * time * time;
		var v_final = v_init + accel * time;

		var unknowns = KhanUtil.rollUnknowns();

		return {
			d: disp,
			v_i: v_init,
			v_f: v_final,
			a: accel,
			t: time,

			omitted: unknowns[0],
			unknown: unknowns[1]
		};
	},

	// Returns a string containing the value and the associated unit
	// for the value (determined by the variable, e.g. "d" or "t")
	u: function( motion, variable ) {
		return KhanUtil.roundTo(KhanUtil.PRECISION, motion[variable]) + "\\," + KhanUtil.PRETTY_UNITS[variable];
	}
});
