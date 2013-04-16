/**
 * Allows for intuitive matrix input for matrix exercises.
 *
 * See `matrix_transpose.html` for an example.
 *
 * To use in an exercise:
 *
 * 1. Add "matrix matrix-input" to data-require.
 *
 * 2. Use `matrixPad()` to pad the solution matrix with empty string values
 *     and assign to a `var` named `PADDED_SOLN_MAT`:
 *
 * Ex: <var id="PADDED_SOLN_MAT">matrixPad(SOLN_MAT, 3, 3)</var>
 *
 * 3. Use the following HTML for the
 *     solution markup:
 *
 * <div class="solution" data-type="multiple">
 *     <div data-each="PADDED_SOLN_MAT as row" class="row">
 *         <div data-each="row as elem">
 *             <div data-if="elem !== ''" class="sol">
 *                 <var>elem</var>
 *             </div>
 *             <div data-else data-type="text" class="sol">
 *                 <var>elem</var>
 *             </div>
 *         </div>
 *     </div>
 * </div>
 *
 */

$.extend(KhanUtil, {

    matrixInput: {

        eventsAttached: false,

        containerEl: null,
        bracketEls: null,
        cells: null,

        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        ENTER_KEY: 13,

        ROWS: 3,
        COLS: 3,

        maxRow: 0,
        maxCol: 0,

        contentMaxRow: 0,
        contentMaxCol: 0,

        init: function() {
            var self = this;

            this.initContainer();

            var inputs = $(".matrix-input .sol input[type='text']");
            this.cells = _.map(inputs, function(input, i) {
                return {
                    el: input,
                    index: i,
                    row: self.indexToRow(i),
                    col: self.indexToCol(i),
                    val: function() {
                        return $.trim($(this.el).val());
                    },
                    clearVal: function() {
                        $(this.el).val("");
                    }
                };
            });

            this.addBrackets();

            this.bindInputEvents();
            this.resetAllMaxVals();
            this.render();
        },

        initContainer: function() {
            this.containerEl = $("#solutionarea").addClass("matrix-input");
        },

        addBrackets: function(i) {
            var left = $("<div>").addClass("matrix-bracket bracket-left");
            var right = $("<div>").addClass("matrix-bracket bracket-right");
            this.containerEl.prepend(left, right);
            this.bracketEls = [left, right];
        },

        removeBrackets: function() {
            _.each(this.bracketEls, function(bracketEl) {
                $(bracketEl).remove();
            });
        },

        indexToRow: function(i) {
            return Math.floor(i / this.COLS);
        },

        indexToCol: function(i) {
            return i % this.COLS;
        },

        coordToIndex: function(row, col) {
            return this.COLS * row + col;
        },

        bindInputEvents: function() {
            // We reevaluate the highlighted area after:
            // 1) clicking on some element besides the cells, or
            // 2) tabbing to a new cell in the solution area
            // This is sufficient since these are the only ways
            // the user will get to change the value.
            var self = this;

            // case #1
            $("body").click(function() {
                self.resetMaxToContentMax();
                self.render();
            });

            _.each(this.cells, function(cell) {

                $(cell.el).on({
                    // case #2
                    focus: function(e) {
                        self.setMaxVals(cell);
                        self.render();
                    },

                    blur: function(e) {
                        self.setMaxVals(cell);
                    },

                    // case #1 (prevent from performing a redundant
                    // reevaluation when clicking on a cell, since focus event
                    // is triggered on both tabs and clicks)
                    click: function(e) {
                        e.stopPropagation();
                    },

                    keydown: function(e) {
                        var LAST_ROW = self.ROWS - 1;
                        var LAST_INDEX = self.cells.length - 1;

                        var nextIndex = null;
                        var nextRow;

                        // cursor position only does something when you
                        // are at the start of the input, moving left, or
                        // at the end of the input, moving right

                        if (e.which === self.LEFT_ARROW) {
                            // don't do anything if at the first cell
                            // or if the cursor is not at the start
                            if (cell.index === 0 || !$(this).isCursorFirst()) {
                                 return;
                            }
                            nextIndex = cell.index - 1;

                        } else if (e.which === self.RIGHT_ARROW) {
                            // don't do anything if at the last cell
                            // or if the cursor is not at the end of the input
                            // text
                            if (cell.index === LAST_INDEX ||
                                !$(this).isCursorLast()) {
                                return;
                            }
                            nextIndex = cell.index + 1;

                        } else if (e.which === self.UP_ARROW) {
                            // if already on first row, don't do anything
                            if (cell.row === 0) {
                                return;
                            }
                            nextRow = cell.row - 1;
                            nextIndex = self.coordToIndex(nextRow, cell.col);

                        } else if (e.which === self.DOWN_ARROW) {
                            // if on last row, don't do anything
                            if (cell.row === LAST_ROW) {
                                return;
                            }
                            nextRow = cell.row + 1;
                            nextIndex = self.coordToIndex(nextRow, cell.col);

                        // when submitting via enter key, make sure max vals
                        // are set properly
                        } else if (e.which === self.ENTER_KEY) {
                            self.setMaxVals(cell);
                        }

                        // let default behavior take place if we don't do
                        // anything
                        if (nextIndex === null) {
                            return;
                        }

                        // change focus to next input
                        $(self.cells[nextIndex].el).focus();

                        // don't let event bubble
                        e.preventDefault();
                    }
                });
            });
        },

        setContentMaxRow: function(val) {
            this.contentMaxRow = Math.max(val, this.contentMaxRow);
        },

        setContentMaxCol: function(val) {
            this.contentMaxCol = Math.max(val, this.contentMaxCol);
        },

        // maxRow/maxCol is the max of the currently selected element and the
        // content max element
        setMaxRow: function(val) {
            this.maxRow = Math.max(val, this.contentMaxRow);
        },

        setMaxCol: function(val) {
            this.maxCol = Math.max(val, this.contentMaxCol);
        },

        resetMaxToContentMax: function() {
            this.maxRow = this.contentMaxRow;
            this.maxCol = this.contentMaxCol;
        },

        resetAllMaxVals: function() {
            this.maxRow = 0;
            this.maxCol = 0;
            this.contentMaxRow = 0;
            this.contentMaxCol = 0;
        },

        setMaxValsFromScratch: function() {
            // initialize to 0, since we want to start from scratch
            this.resetAllMaxVals();

            var self = this;
            _.each(this.cells, function(cell) {
                if (cell.val()) {
                    self.setContentMaxRow(cell.row);
                    self.setContentMaxCol(cell.col);
                }
            });

            this.resetMaxToContentMax();
        },

        setMaxVals: function(cell) {
            var el = $(cell.el);
            var val = cell.val();

            // cell is nonempty
            if (val) {
                // only nonempty cell can be used to set content max values
                // unless (see case below)
                this.setContentMaxRow(cell.row);
                this.setContentMaxCol(cell.col);

            // cell is empty
            } else {
                // reset the contents of the cell when it's just spaces
                cell.clearVal();

                // if it was the cell responsible for a content max val(s),
                // we need to find the new content max val(s)...
                if (this.contentMaxRow === cell.row ||
                    this.contentMaxCol === cell.col) {

                    this.setMaxValsFromScratch();
                }
            }

            // both nonempty and empty cells can set absolute max values
            this.setMaxRow(cell.row);
            this.setMaxCol(cell.col);
        },

        // position matrix brackets based on bounds
        positionBrackets: function() {

            var cell = $(this.cells[0].el);
            var bracketWidth = this.bracketEls[0].width();

            var rows = this.maxRow + 1;
            var cols = this.maxCol + 1;

            var height = cell.outerHeight(true) * rows;
            var marginLeft = cell.outerWidth(true) * cols - bracketWidth;

            _.each(this.bracketEls, function($el) {
                $el.css({
                    "height": height
                });
            });

            // right bracket
            this.bracketEls[1].css({
                "margin-left": marginLeft
            });
        },

        render: function() {
            this.positionBrackets();
        },

        cleanup: function() {
            this.removeBrackets();
        }
    }
});

$.fn["matrix-inputLoad"] = function() {
    if (KhanUtil.matrixInput.eventsAttached) {
        return;
    }

    $(Khan).on("newProblem.matrix-input", function() {
        KhanUtil.matrixInput.init();
    });

    $(Khan).on("showGuess.matrix-input", function() {
        KhanUtil.matrixInput.setMaxValsFromScratch();
        KhanUtil.matrixInput.render();
    });

    KhanUtil.matrixInput.eventsAttached = true;
};

$.fn["matrix-inputCleanup"] = function() {
    if (!KhanUtil.matrixInput.eventsAttached) {
        return;
    }

    KhanUtil.matrixInput.cleanup();
    $(Khan).off("newProblem.matrix-input");
    $(Khan).off("showGuess.matrix-input");

    KhanUtil.matrixInput.eventsAttached = false;
};
