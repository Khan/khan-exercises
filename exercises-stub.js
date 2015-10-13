/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/**
 * Stub version of the Exercises object used in the live Khan Academy site.
 */
window.Exercises = {
    localMode: true,

    useKatex: true,

    khanExercisesUrlBase: "../",

    getCurrentFramework: function() {
        return "khan-exercises";
    },

    PerseusBridge: {
        cleanupProblem: function() {
            return false;
        }
    }
};
