$.extend(KhanUtil, {
    // make a 3d object, which holds the vertices,
    //   faces, and perspective of an object
    make3dObject: function(verts, options) {
        var object = $.extend({
            verts: verts,
            perspective: KhanUtil.makeMatrix([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]),
            scale: 5.0,
            faces: []
        }, options);

        var graph = KhanUtil.currentGraph;

        // set the scale
        object.setScale = function(scale) {
            object.scale = scale;
        };

        // set and offset the camera pos
        object.offsetPos = function(offset) {
            this.perspective[0][3] += offset[0];
            this.perspective[1][3] += offset[1];
            this.perspective[2][3] += offset[2];
        };

        object.setPos = function(pos) {
            this.perspective[0][3] = pos[0];
            this.perspective[1][3] = pos[1];
            this.perspective[2][3] = pos[2];
        };

        // perform a rotation of ang around the vector (x, y, z)
        object.rotate = function(x, y, z, ang) {
            var s = Math.sin(ang);
            var c = Math.cos(ang);

            // stolen from the OpenGL glRotate man page
            var rotation = KhanUtil.makeMatrix([
                [x*x*(1-c)+c,   x*y*(1-c)-z*s, x*z*(1-c)+y*s, 0],
                [y*x*(1-c)+z*s, y*y*(1-c)+c,   y*z*(1-c)-x*s, 0],
                [x*z*(1-c)-y*s, y*z*(1-c)+x*s, z*z*(1-c)+c,   0],
                [0,             0,             0,             1]
            ]);

            this.perspective = KhanUtil.matrixMult(this.perspective, rotation);
        };

        // perform the perspective transformation stored in
        //   object.perspective on a 3d point
        object.doPerspective = function(pt) {
            var newpt = KhanUtil.arrayToColumn(pt);

            newpt[3] = [-1];

            var result = KhanUtil.matrixMult(this.perspective, newpt);

            return KhanUtil.columnToArray(result).slice(0, 3);
        };

        // perform the perspective rotation sorted in object.perspective
        //   on a 3d vector (doesn't perform translation)
        object.doRotation = function(pt) {
            var newpt = KhanUtil.arrayToColumn(pt);

            newpt[3] = [0];

            var result = KhanUtil.matrixMult(this.perspective, newpt);

            return KhanUtil.columnToArray(result).slice(0, 3);
        };

        // perform the perspective transformation and then project
        //   the 3d point onto a 2d screen
        object.doProjection = function(pt) {
            var p = this.doPerspective(pt);

            var x1 = p[0] * (this.scale / p[2]);
            var y1 = p[1] * (this.scale / p[2]);

            return [x1, y1];
        };

        // add a face to the object, with verts being indices of the
        //   object.verts array
        object.addFace = function(options) {
            var face = $.extend(true, {
                verts: [],
                color: "black",
                lines: [],
                labels: [],
                infront: false
            }, options);

            // compute the normal of a face
            face.normal = function() {
                var a = object.verts[this.verts[0]];
                var b = object.verts[this.verts[1]];
                var c = object.verts[this.verts[2]];

                var ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
                var ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];

                var normal = [
                    ab[1] * ac[2] - ab[2] * ac[1],
                    ab[2] * ac[0] - ab[0] * ac[2],
                    ab[0] * ac[1] - ab[1] * ac[0]
                ];

                var length = KhanUtil.vectorLength(normal);

                return _.map(normal, function(e) { return e / length; });
            };

            // find the array of the projected points of the face
            face.mappedVerts = function() {
                return _.map(this.verts, function(v) {
                    return object.doProjection(object.verts[v]);
                });
            };

            // create a path of the face
            face.path = function() {
                return graph.path(
                    face.mappedVerts(),
                    { fill: face.color, stroke: false }
                );
            };

            // draw the face's lines
            face.drawLines = function() {
                var set = graph.raphael.set();

                _.each(this.lines, function(line) {
                    set.push(
                        graph.line(
                            object.doProjection(line[0]),
                            object.doProjection(line[1]),
                            {
                                stroke: "black",
                                strokeDasharray: ". "
                            }
                        )
                    );
                });

                return set;
            };

            // draw the face's labels
            face.drawLabels = function() {
                _.each(this.labels, function(label) {
                    var normal = face.normal();
                    var newpt = [0.2 * normal[0] + label[0][0],
                                 0.2 * normal[1] + label[0][1],
                                 0.2 * normal[2] + label[0][2]];
                    var pt = object.doProjection(newpt);

                    if (label.label == null) {
                        label.label = graph.label(pt, label[1]);
                    } else {
                        label.label.setPosition(pt);
                    }
                });
            };

            // draw all the objects on the face and return the set of them all
            face.draw = function() {
                var set = graph.raphael.set();

                set.push(face.path());
                set.push(face.drawLines());

                face.drawLabels();

                return set;
            };

            // draw the face in the back, which is just the outline
            face.drawBack = function() {
                return graph.path(
                    face.mappedVerts(),
                    { fill: null, stroke: "#666", opacity: 0.1 }
                );
            };

            face.toFront = function() {
                this.infront = true;
            };

            face.toBack = function() {
                this.infront = false;

                _.each(this.labels, function(label) {
                    if (label.label != null) {
                        label.label.remove();
                        label.label = null;
                    }
                });
            };

            this.faces.push(face);

            return this;
        };

        // draw the object, performing backface culling to ensure
        //   faces don't intersect each other
        object.draw = function() {
            var frontFaces = [];
            var backFaces = [];

            // figure out which objects should be drawn in front,
            // and which in back
            _.each(object.faces, function(face) {
                var vert = object.doPerspective(object.verts[face.verts[0]]);
                var normal = face.normal();
                if (KhanUtil.vectorDot(object.doRotation(normal), vert) < 0) {
                    frontFaces.push(face);
                } else {
                    backFaces.push(face);
                }
            });

            // draw each of the faces, and store it in a raphael set
            var image = graph.raphael.set();
            _.each(frontFaces, function(face) {
                face.toFront();
                image.push(face.draw());
            });
            _.each(backFaces, function(face) {
                face.toBack();
                image.push(face.drawBack());
            });
            return image;
        };

        // a list of the current and next frame
        // each time a new one is created, the old one is
        // removed later to avoid fast flickering
        object.images = [graph.raphael.set()];

        // whether or not an image is pending for deletion,
        // in which case we shouldn't draw again
        object.drawPending = false;

        // do the full double-buffered drawing
        object.doDraw = function() {
            // only draw if we don't have a second frame waiting
            if (!this.drawPending) {
                this.drawPending = true;

                // do the drawing, and store the new frame
                this.images.push(this.draw());

                // defer removing the old frame
                _.defer(function() {
                    object.images.shift().remove();
                    object.drawPending = false;
                });
            }
        };

        return object;
    }
});
