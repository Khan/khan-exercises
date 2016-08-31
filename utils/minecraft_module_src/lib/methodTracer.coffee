class MethodTracer
    constructor: ->
        @tracer = {}

    trace: (clasname) ->
        clas = eval(clasname)
        for name, f of clas.prototype when typeof f is 'function'
            uniqueId = "#{clasname}##{name}"
            tracer = @tracer
            tracer[uniqueId] = false
            clas.prototype[name] = (args...) ->
                tracer[uniqueId] = true
                f(args...)
        return @

    traceClasses: (classNames) ->
        for clas in classNames.split(' ')
            @trace clas
        return @

    printUnused: ->
        for id, used of @tracer when not used
            puts id
        return @

window.MethodTracer = MethodTracer