MathJax.Hub.Config({
	messageStyle: "none",
	skipStartupTypeset: true,
	jax: ["input/TeX","output/HTML-CSS"],
	extensions: ["tex2jax.js","MathZoom.js"],
	TeX: {
		extensions: [
			"AMSmath.js",
			"AMSsymbols.js",
			"noErrors.js",
			"noUndefined.js",
			"newcommand.js",
			"boldsymbol.js"
		],
		Macros: {
			RR: "\\mathbb{R}"
		},
		Augment: {
			Definitions: {
				macros: {
					lrsplit: "LRSplit",
					lcm: ["NamedOp", 0]
				}
			},
			Parse: {
				prototype: {
					LRSplit: function( name ) {
						var num = this.GetArgument( name ),
							den = this.GetArgument( name );
						var frac = MathJax.ElementJax.mml.mfrac( MathJax.InputJax.TeX.Parse( '\\strut\\textstyle{'+num+'\\qquad}', this.stack.env ).mml(),
							MathJax.InputJax.TeX.Parse( '\\strut\\textstyle{\\qquad '+den+'}', this.stack.env ).mml() );
						frac.numalign = MathJax.ElementJax.mml.ALIGN.LEFT;
						frac.denomalign = MathJax.ElementJax.mml.ALIGN.RIGHT;
						frac.linethickness = "0em";
						this.Push( frac );
					}
				}
			}
		}
	},
	"HTML-CSS": {
		scale: 100,
		showMathMenu: false,
		availableFonts: [ "TeX" ],
		imageFont: null
	}
});

// We don't want to use inline script elements, we want to use code blocks
MathJax.Hub.elementScripts = function( elem ) {
	return elem.nodeName.toLowerCase() === "code" ?
		[ elem ] :
		elem.getElementsByTagName( "code" );
};

// Data is read in here:
// https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/TeX/jax.js#L1704
// We can force it to convert HTML entities properly by saying we're Konqueror
MathJax.Hub.Browser.isKonqueror = true;

MathJax.Ajax.timeout = 60 * 1000;
MathJax.Ajax.loadError = (function( oldLoadError ) {
	return function( file ) {
		Khan.warnTimeout();
		// Otherwise will receive unresponsive script error when finally finish loading 
		MathJax.Ajax.loadComplete = function( file ) { };
		oldLoadError.call( this, file );
	};
})( MathJax.Ajax.loadError );

MathJax.Hub.Register.StartupHook("HTML-CSS Jax - disable web fonts", function() {
	Khan.warnFont();
});

// Trying to monkey-patch MathJax.Message.Init to not throw errors
MathJax.Message.Init = (function( oldInit ) {
	return function( styles ) {
		if ( this.div && this.div.parentNode == null ) {
			var div = document.getElementById("MathJax_Message");
			if ( div && div.firstChild == null ) {
				var parent = div.parentNode;
				if ( parent ) {
					parent.removeChild( div );
				}
			}
		}
		
		oldInit.call( this, styles );
	};
})( MathJax.Message.Init );

MathJax.Hub.Startup.onload();