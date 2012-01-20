jQuery.extend( KhanUtil, {

	NL: {
		werkwoordmap: [
				//Type 1 Stam is werkwoord zonder EN op het einde
			[
				["fietsen", "fiets"]
			],
				// Type 2 Stam zonder EN op het einde, open klinker (LO-PEN) wordt dubbele klinker (LOOP)
			[

				["lopen", "loop"],
				["kopen", "koop"],
				["programmeren", "programmeer"]
			],
				// Type 3 Stam zonder EN op het einde, dubbele medeklinker wordt enkele medeklinker
			[
				["kennen", "ken"],
				["kunnen", "kun"],
				["willen", "wil"]
			]
		]
	},

	randomWerkwoordset: function(type){
		type--
		return this.NL.werkwoordmap[type][
			Math.floor(Math.random()*this.NL. werkwoordmap[type].length)
		]
	}

});
