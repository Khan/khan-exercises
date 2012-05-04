patch Number,
    mod: (arg) ->
        return @ % arg if @ >= 0
        return (@ + arg) % arg

    div: (arg) -> return Math.floor(@ / arg)


    times: (fn) ->
        i = 0
        while i < @
            fn(i++)

    toRadians: -> (@ * Math.PI) / 180

    toDegrees: ->  (@ * 180) / Math.PI


window.assoc = (o, i) ->
    (o[k] = v) for k, v of i
    return o
