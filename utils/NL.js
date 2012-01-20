jQuery.extend( KhanUtil, {

	NL: {
		werkwoordmap: [
				//Type 1 Stam is werkwoord zonder EN op het einde
				//Type 1
			[
				["fietsen", "fiets"]
				// Type 2 Stam zonder EN op het einde, open klinker (LO-PEN) wordt dubbele klinker (LOOP)
				["lopen", "loop"],
				["kopen", "koop"],
				["programmeren", "programmeer"]
			],
				// Type 3 Stam zonder EN op het einde, dubbele medeklinker wordt enkele medeklinker
				// Type 2
			[
				["fietsen", "fiets"]
			],
				// Type 3
			[
				["kennen", "ken"],
				["kunnen", "kun"],
				["willen", "wil"]
			],
				// Type 4
			[
				["zijn", "ben"]
			]
		]
	},

	randomWerkwoordset: function(type){
		type--
		return this.NL.werkwoordmap[type][
			Math.floor(Math.random()*this.NL. werkwoordmap[type].length)
		]
	},

	shuffle: function(l) {
		list = l.slice();
		var i, j, t;
		for (i = 1; i < list.length; i++){
			j = Math.floor(Math.random()*(1+i));
			if (j != i){
				t = list[i];
				list[i] = list[j];
				list[j] = t;
			}
		}
		return list
	}

});
