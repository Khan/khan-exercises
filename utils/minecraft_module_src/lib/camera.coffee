MouseEvent =
    isLeftButton: (event) -> event.which == 1
    isRightButton: (event) -> event.which == 3

    isLeftButtonDown: (event) -> event.button == 0 and @isLeftButton event

class Controls
    constructor: (object, domElement) ->
        @object = object
        @target = new THREE.Vector3 0, 0, 0
        @domElement = domElement or document
        @lookSpeed = 0.20
        @mouseX = 0
        @mouseY = 0
        @lat = -66.59
        @lon = -31.8
        @mouseDragOn = false
        @anchorx = null
        @anchory = null
        @defineBindings()

    defineBindings: ->
        $(@domElement).mousemove (e) => @onMouseMove e
        $(@domElement).mousedown (e) => @onMouseDown e
        $(@domElement).mouseup (e) => @onMouseUp e
        $(@domElement).mouseenter (e) => @onMouserEnter e

    onMouserEnter: (event) ->
        @onMouseUp(event) unless MouseEvent.isLeftButtonDown event

    onMouseDown: (event) ->
        return unless MouseEvent.isLeftButton event
        @domElement.focus() if @domElement isnt document
        @anchorx = event.pageX
        @anchory = event.pageY
        @setMouse event
        @mouseDragOn = true
        return false

    onMouseUp: (event) ->
        @mouseDragOn = false
        return false

    setMouse: (event) ->
        @mouseX = event.pageX
        @mouseY = event.pageY

    onMouseMove: (event) ->
        return unless @mouseDragOn
        @setMouse event
        return

    halfCircle:  Math.PI / 180

    viewDirection: -> @target.clone().subSelf(@object.position)

    move: (newPosition) ->
        @object.position = newPosition
        @updateLook()

    updateLook: ->
        {sin, cos} = Math
        phi = (90 - @lat) * @halfCircle
        theta = @lon * @halfCircle
        p = @object.position
        assoc @target,
            x: p.x + 100 * sin(phi) * cos(theta)
            y: p.y + 100 * cos(phi)
            z: p.z + 100 * sin(phi) * sin(theta)
        @object.lookAt @target
        return

    update: ->
        return unless @mouseDragOn
        return if @mouseX is @anchorx and @mouseY is @anchory
        {max, min} = Math
        @lon += (@mouseX - @anchorx) * @lookSpeed
        @lat -= (@mouseY - @anchory) * @lookSpeed
        @anchorx = @mouseX
        @anchory = @mouseY
        @lat = max(-85, min(85, @lat))
        @updateLook()
        return

window.MouseEvent = MouseEvent
window.Controls = Controls