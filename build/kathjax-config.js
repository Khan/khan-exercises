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
            RR: "\\mathbb{R}",
            blue: "\\color{#6495ED}",
            orange: "\\color{#FFA500}",
            pink: "\\color{#FF00AF}",
            red: "\\color{#DF0030}",
            green: "\\color{#28AE7B}",
            gray: "\\color{gray}",
            purple: "\\color{#9D38BD}",
            // For rational exponents, we provide \^ instead of ^ which pushes
            // the exponent up higher so it's really clear that the fraction
            // is an exponent.
            "^": ["{}^{^{^{#1}}}", 1]
        },
        Augment: {
            Definitions: {
                macros: {
                    lrsplit: "LRSplit",
                    cancel: "Cancel",
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
                    },
                    Cancel: function( name ) {
                        this.Push( MathJax.ElementJax.mml.menclose( this.ParseArg( name ) ).With({ notation: MathJax.ElementJax.mml.NOTATION.UPDIAGONALSTRIKE }) );
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
