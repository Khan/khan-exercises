jQuery.extend( KhanUtil, {

	NL: {
		werkwoordmap: [
				//Type 1
			[
				["loop", "lopen"],
				["koop", "kopen"],
				["programmeer", "programmeren"]
			],
				// Type 2
			[
				["fiets", "fietsen"]
			],
				// Type 3
			[
				["ken", "kennen"],
				["kun", "kunnen"],
				["wil", "willen"]
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
