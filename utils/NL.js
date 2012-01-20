jQuery.extend( KhanUtil, {

	NL: {
		werkwoordmap: [
				//Type 1
			[
				["lopen", "loop"],
				["kopen", "koop"],
				["programmeren", "programmeer"]
			],
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
				["ben", "zijn"]
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
