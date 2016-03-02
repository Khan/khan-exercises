/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, comma-spacing, indent, max-len, no-var, one-var, space-infix-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

MathJax.Hub.Config({
    messageStyle: "none",
    skipStartupTypeset: true,
    jax: ["input/TeX","output/HTML-CSS"],
    extensions: ["tex2jax.js"],
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
            blueA: "\\color{#C7E9F1}",
            blueB: "\\color{#9CDCEB}",
            blueC: "\\color{#58C4DD}",
            blueD: "\\color{#29ABCA}",
            blueE: "\\color{#1C758A}",
            tealA: "\\color{#ACEAD7}",
            tealB: "\\color{#76DDC0}",
            tealC: "\\color{#5CD0B3}",
            tealD: "\\color{#55C1A7}",
            tealE: "\\color{#49A88F}",
            greenA: "\\color{#C9E2AE}",
            greenB: "\\color{#A6CF8C}",
            greenC: "\\color{#83C167}",
            greenD: "\\color{#77B05D}",
            greenE: "\\color{#699C52}",
            goldA: "\\color{#F7C797}",
            goldB: "\\color{#F9B775}",
            goldC: "\\color{#F0AC5F}",
            goldD: "\\color{#E1A158}",
            goldE: "\\color{#C78D46}",
            redA: "\\color{#F7A1A3}",
            redB: "\\color{#FF8080}",
            redC: "\\color{#FC6255}",
            redD: "\\color{#E65A4C}",
            redE: "\\color{#CF5044}",
            maroonA: "\\color{#ECABC1}",
            maroonB: "\\color{#EC92AB}",
            maroonC: "\\color{#C55F73}",
            maroonD: "\\color{#A24D61}",
            maroonE: "\\color{#94424F}",
            purpleA: "\\color{#CAA3E8}",
            purpleB: "\\color{#B189C6}",
            purpleC: "\\color{#9A72AC}",
            purpleD: "\\color{#715582}",
            purpleE: "\\color{#644172}",
            mintA: "\\color{#F5F9E8}",
            mintB: "\\color{#EDF2DF}",
            mintC: "\\color{#E0E5CC}",
            grayA: "\\color{#FDFDFD}",
            grayB: "\\color{#F7F7F7}",
            grayC: "\\color{#EEEEEE}",
            grayD: "\\color{#DDDDDD}",
            grayE: "\\color{#CCCCCC}",
            grayF: "\\color{#AAAAAA}",
            grayG: "\\color{#999999}",
            grayH: "\\color{#555555}",
            grayI: "\\color{#333333}",
            kaBlue: "\\color{#314453}",
            kaGreen: "\\color{#639B24}",
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
                    lcm: ["NamedOp", 0],
                    gcf: ["NamedOp", 0]
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
        if (window.Khan) {
          Khan.warnMathJaxError(file);
        }
        // Otherwise will receive unresponsive script error when finally finish loading
        MathJax.Ajax.loadComplete = function( file ) { };
        oldLoadError.call( this, file );
    };
})( MathJax.Ajax.loadError );

MathJax.Hub.Register.StartupHook("HTML-CSS Jax - disable web fonts", function() {
    if (window.Khan) {
        Khan.warnFont();
    }
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
