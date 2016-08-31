importAll = (from) ->
    for i of from
        global[i] = from[i]

same = (thi, that) -> expect(thi).toEqual(that)
isTrue = (val) -> same val, true
isFalse = (val) -> same val, false

require 'specBrowserAdapter'
require 'lib/rbcoffee'
require 'collision'

cube = (vmin, vmax) -> {vmin, vmax}
vec = (x, y, z) -> {x, y, z}


describe "Intersection utils", ->
    it "can decide interval collision", ->
        collides = CollisionUtils.testIntervalCollision
        isTrue collides(0, 9, 6, 12)
        isTrue collides(1, 5, 2, 3)
        isTrue collides(1, 5, 1, 10)
        isFalse collides(1, 5, 6, 10)
        isFalse collides(6, 10, 1, 5)


    it "can decide when unrotated cubes don't collide ", ->
        collides = CollisionUtils.testCubeCollision
        cube1 = cube(vec(0, 0, 0), vec(50, 50, 50))
        cube2 = cube(vec(60, 60, 60), vec(150, 150, 150))
        isFalse collides(cube1, cube2)


    it "can decide when unrotated cubes do collide ", ->
        collides = CollisionUtils.testCubeCollision
        cube1 = cube(vec(822.5, 43, 22.5), vec(847.5, 123, 47.5))
        cube2 = cube(vec(775, 50, 25), vec(825, 100, 75))
        isTrue collides(cube1, cube2)

