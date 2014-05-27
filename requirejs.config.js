({
    name: "third_party/almond.js",
    include: [
        "khan-exercise.js",

        // Base modules used by every problem (matches Khan.getBaseModules())
        "utils/answer-types.js",
        "utils/tex.js",
        "utils/tmpl.js",
        "utils/jquery.adhesion.js",

        // Loaded separately.
        "genfiles/calculator.js",

        // Utils required asynchronously by khan-exercise.js (when files are
        // required without a callback, r.js will include them automatically)
        "utils/scratchpad.js",

        // Utils used by Perseus only
        "utils/kray.js",

        // Complete list of utils that are required by exercises (i.e., in a
        // <html data-require="..."> tag)
        "utils/algebra-intuition.js",
        "utils/angles.js",
        "utils/chemistry.js",
        "utils/cipher.js",
        "utils/congruency.js",
        "utils/constructions.js",
        "utils/convert-values.js",
        "utils/derivative-intuition.js",
        "utils/exponents.js",
        "utils/expressions.js",
        "utils/functional.js",
        "utils/geom.js",
        "utils/graphie.js",
        "utils/graphie-3d.js",
        "utils/graphie-geometry.js",
        "utils/graphie-helpers.js",
        "utils/graphie-helpers-arithmetic.js",
        "utils/graphie-polygon.js",
        "utils/interactive.js",
        "utils/khanscript.js",
        "utils/kline.js",
        "utils/kmatrix.js",
        "utils/math.js",
        "utils/math-format.js",
        "utils/matrix-input.js",
        "utils/mean-and-median.js",
        "utils/parabola-intuition.js",
        "utils/polynomials.js",
        "utils/probability.js",
        "utils/qhints.js",
        "utils/rational-expressions.js",
        "utils/slice-clone.js",
        "utils/spin.js",
        "utils/stat.js",
        "utils/subhints.js",
        "utils/time.js",
        "utils/triangle-congruence.js",
        "utils/unit-circle.js",
        "utils/visualizing-derivatives.js",
        "utils/word-problems.js",

        "main.js"
    ],
    optimize: "none",
    out: "genfiles/exercise-content-bundle.js",
    shim: {
        // Wrap these with a define() wrapper to defer execution until required
        "genfiles/calculator.js": true,
        "utils/jquery.adhesion.js": true,
        "third_party/jquery.cursor-position.js": true,
        "third_party/jquery.mobile.vmouse.js": true
    },
    wrap: true,
    wrapShim: true
})
