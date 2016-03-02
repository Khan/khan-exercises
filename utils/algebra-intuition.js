/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

KhanUtil.scale = {
    orig: {
        unknown: 1,
        leftCoef: 1,
        leftConst: 5,
        rightCoef: 0,
        rightConst: 6
    },
    unknown: 1,
    leftCoef: 1,
    leftConst: 5,
    rightCoef: 0,
    rightConst: 6,
    angle: 0,
    baseY: -6,
    image: "/images/avatars/mr-pink.png",
    equation: {
        eqLabel: {remove: function() {}},
        leftCoefLabel: {remove: function() {}},
        leftLabel: {remove: function() {}},
        rightLabel: {remove: function() {}},
        yPos: -10.5,

        init: function(options) {
            this.graphie = KhanUtil.scale.graphie;
            $.extend(this, options);

            this.graphie.raphael.image(KhanUtil.scale.image,
                this.graphie.scalePoint([-7.8, this.yPos + 1.2])[0],
                this.graphie.scalePoint([-7.8, this.yPos + 1.2])[1],
                40, 40).attr({
                    opacity: 1
                });
        },
        draw: function(x, n, a, b) {
            this.eqLabel.remove();
            this.leftCoefLabel.remove();
            this.leftLabel.remove();
            this.rightLabel.remove();

            if (a + x === b) {
                this.eqLabel = this.graphie.label([0, this.yPos],
                    "\\Huge{=}");
            } else {
                this.eqLabel = this.graphie.label([0, this.yPos],
                    "\\Huge{\\ne}");
            }
            if (n !== 1) {
                this.leftCoefLabel = this.graphie.label([-6.8, this.yPos],
                    "\\Huge{" + n + "(\\qquad\\quad)}");
            } else {
                this.leftCoefLabel = {remove: function() {}};
            }
            if (a !== 0) {
                this.leftLabel = this.graphie.label([-3.7, this.yPos],
                    "\\Huge{{} + " + a + "}");
            } else {
                this.leftLabel = {remove: function() {}};
            }
            this.rightLabel = this.graphie.label([3.5, this.yPos],
                "\\Huge{" + b + "}");
        }
    },

    addWeight: function(xOffset, yOffset, num, dish) {
        var weights = [];
        _(10).times(function(n) {
            var weight = {};
            /*
            var pos = [
                [-1.15, 0.05],
                [0.15, 0.05],
                [-0.5, 1.05],
                [-2.45, 0.05],
                [-1.8, 1.05],
                [-1.15, 2.05],
                [1.45, 0.05],
                [0.8, 1.05],
                [0.15, 2.05],
                [-0.5, 3.05]
            ][n];
            */
            var pos = [
                [-1, 0.0],
                [0, 0.0],
                [-0.5, 1.0],
                [-2, 0.0],
                [-1.5, 1.0],
                [-1, 2.0],
                [1, 0.0],
                [0.5, 1.0],
                [0, 2.0],
                [-0.5, 3.0]
            ][n];

            weight.kgMass = KhanUtil.scale.graphie.path([
                    [pos[0] + xOffset, pos[1] + yOffset],
                    [pos[0] + xOffset + 1, pos[1] + yOffset],
                    [pos[0] + xOffset + 1, pos[1] + yOffset + 1],
                    [pos[0] + xOffset, pos[1] + yOffset + 1], true], {
                strokeWidth: 1,
                stroke: "#994499",
                fill: KhanUtil.PURPLE
            });

            weight.lbl = KhanUtil.scale.graphie.raphael.text(
                KhanUtil.scale.graphie.scalePoint([pos[0] + xOffset + 0.5,
                            pos[1] + yOffset + 0.5])[0],
                KhanUtil.scale.graphie.scalePoint([pos[0] + xOffset + 0.5,
                            pos[1] + yOffset + 0.5])[1], "1");
            weight.lbl.attr({
                "font-size": 15,
                "font-weight": "bold",
                "font-family": "inherit",
                "stroke": "#fff",
                "fill": "#fff"
            });
            weights[n] = weight;
            dish.push(weight.kgMass);
            dish.push(weight.lbl);
            if (n >= num) {
                weight.kgMass.attr({opacity: 0, translation: "0 -40"});
                weight.lbl.attr({opacity: 0, translation: "0 -40"});
            }
            weight.remove = function(speed) {
                if (speed == null) {
                    speed = 300;
                }
                this.kgMass.animate({
                    "opacity": 0.0,
                    "translation": "0 -40"
                }, speed);
                this.lbl.animate({
                    "opacity": 0.0,
                    "translation": "0 -40"
                }, speed);
            };
            weight.add = function(speed) {
                if (speed == null) {
                    speed = 300;
                }
                this.kgMass.animate({
                    "opacity": 1.0,
                    "translation": "0 40"
                }, speed);
                this.lbl.animate({
                    "opacity": 1.0,
                    "translation": "0 40"
                }, speed);
            };
        });
        return weights;
    },

    balance: function(speed) {
        if (speed == null) {
            speed = 500;
        }
        var newAngle = 0;
        this.equation.draw(this.unknown, this.leftCoef,
            this.leftConst, this.rightConst);

        if (this.leftConst + this.unknown < this.rightConst) {
            newAngle = 8;
        } else if (this.leftConst + this.unknown > this.rightConst) {
            newAngle = -8;
        }
        $({r: this.angle}).animate({r: newAngle}, {
            duration: speed,
            step: function(now, fx) {
                var dist = 5.5 * Math.sin(now * Math.PI / 180) *
                        KhanUtil.currentGraph.scale[1];
                var leftPos = KhanUtil.scale.leftDishItems[0].
                        attr("translation").y;
                var rightPos = KhanUtil.scale.rightDishItems[0].
                        attr("translation").y;
                KhanUtil.scale.angle = now;
                KhanUtil.scale.beamItems.rotate(now, [0, 0]);
                KhanUtil.scale.leftDishItems.translate([0, -dist - leftPos]);
                KhanUtil.scale.rightDishItems.translate([0, dist - rightPos]);
            }
        });
        if (_.isFunction(this.onChange)) {
            this.onChange(this.leftCoef, this.leftConst,
                this.rightCoef, this.rightConst);
        }
    },

    subtractLeftWeight: function() {
        this.leftConst -= 1;
        this.leftWeight[this.leftConst].remove();
        this.balance();
    },

    addLeftWeight: function() {
        this.leftWeight[this.leftConst].add();
        this.leftConst += 1;
        this.balance();
    },

    setLeftWeight: function(weight) {
        while (this.leftConst !== weight) {
            if (this.leftConst < weight) {
                this.leftWeight[this.leftConst].add(0);
                this.leftConst += 1;
            } else {
                this.leftConst -= 1;
                this.leftWeight[this.leftConst].remove(0);
            }
        }
        this.balance(0);
    },

    subtractRightWeight: function() {
        this.rightConst -= 1;
        this.rightWeight[this.rightConst].remove();
        this.balance();
    },

    addRightWeight: function() {
        this.rightWeight[this.rightConst].add();
        this.rightConst += 1;
        this.balance();
    },

    setRightWeight: function(weight) {
        while (this.rightConst !== weight) {
            if (this.rightConst < weight) {
                this.rightWeight[this.rightConst].add(0);
                this.rightConst += 1;
            } else {
                this.rightConst -= 1;
                this.rightWeight[this.rightConst].remove(0);
            }
        }
        this.balance(0);
    },

    resetProblem: function() {
        while (this.leftConst !== this.orig.leftConst) {
            if (this.leftConst < this.orig.leftConst) {
                this.leftWeight[this.leftConst].add();
                this.leftConst += 1;
            } else {
                this.leftConst -= 1;
                this.leftWeight[this.leftConst].remove();
            }
        }
        while (this.rightConst !== this.orig.rightConst) {
            if (this.rightConst < this.orig.rightConst) {
                this.rightWeight[this.rightConst].add();
                this.rightConst += 1;
            } else {
                this.rightConst -= 1;
                this.rightWeight[this.rightConst].remove();
            }
        }
        this.balance();
        return false;
    },

    init: function(options) {
        this.graphie = KhanUtil.currentGraph;
        $.extend(this, options);

        // Save the original problem
        this.orig.unknown = this.unknown;
        this.orig.leftCoef = this.leftCoef;
        this.orig.leftConst = this.leftConst;
        this.orig.rightCoef = this.rightCoef;
        this.orig.rightConst = this.rightConst;

        Khan.scratchpad.disable();
        this.graphie.init({
            range: [[-12, 12], [-12, 1.5]],
            scale: [20, 20]
        });

        this.leftWire1 = this.graphie.path(
            [[-9, this.baseY - 0.1], [-5.5, 0]], {
                stroke: KhanUtil.BLACK,
                strokeWidth: 0.5
            });
        this.leftWire2 = this.graphie.path(
            [[-2, this.baseY - 0.1], [-5.5, 0]], {
                stroke: KhanUtil.BLACK,
                strokeWidth: 0.5
            });

        this.rightWire1 = this.graphie.path(
            [[9, this.baseY - 0.1], [5.5, 0]], {
                stroke: KhanUtil.BLACK,
                strokeWidth: 0.5
            });
        this.rightWire2 = this.graphie.path(
            [[2, this.baseY - 0.1], [5.5, 0]], {
                stroke: KhanUtil.BLACK,
                strokeWidth: 0.5
            });

        this.leftDish = this.graphie.path(
            [[-9, this.baseY], [-2, this.baseY], [-2, this.baseY - 0.2], [-9, this.baseY - 0.2], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });
        this.rightDish = this.graphie.path(
            [[9, this.baseY], [2, this.baseY], [2, this.baseY - 0.2], [9, this.baseY - 0.2], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });

        this.leftDishItems = this.graphie.raphael.set();
        this.rightDishItems = this.graphie.raphael.set();
        this.leftDishItems.push(this.leftWire1);
        this.leftDishItems.push(this.leftWire2);
        this.leftDishItems.push(this.leftDish);
        this.rightDishItems.push(this.rightWire1);
        this.rightDishItems.push(this.rightWire2);
        this.rightDishItems.push(this.rightDish);

        this.leftWeight = this.addWeight(-4.5, this.baseY, this.leftConst, this.leftDishItems);
        this.rightWeight = this.addWeight(5.5, this.baseY, this.rightConst, this.rightDishItems);

        this.leftDishItems.push(this.graphie.raphael.image(this.image,
            this.graphie.scalePoint([-8.9, this.baseY + 2.40])[0],
            this.graphie.scalePoint([-8.9, this.baseY + 2.40])[1], 50, 50));

        this.beamItems = this.graphie.raphael.set();
        this.beam = this.graphie.path(
            [[-5.8, -0.1], [5.8, -0.1], [5.8, 0.1], [-5.8, 0.1], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });
        this.beamPointer = this.graphie.path(
            [[-0.1, 0], [0.1, 0], [0.1, 1], [-0.1, 1], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });
        this.beamItems.push(this.beam);
        this.beamItems.push(this.beamPointer);

        this.fulcrumBase = this.graphie.path(
            [[0, -7], [1.2, -8.5], [-1.2, -8.5], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });
        this.fulcrum = this.graphie.path(
            [[-0.2, -8], [0.2, -8], [0.2, 0], [-0.2, 0], true], {
                stroke: null,
                fill: KhanUtil.BLUE
            });

        this.fulcrumJoint1 = this.graphie.circle(
            [0, 0], 0.6, {
                stroke: null,
                fill: KhanUtil.BLUE
            });

        this.fulcrumJoint2 = this.graphie.circle(
            [0, 0], 0.4, {
                stroke: null,
                fill: '#fff'
            });

        this.equation.init();
        this.balance();
    }
};

});
