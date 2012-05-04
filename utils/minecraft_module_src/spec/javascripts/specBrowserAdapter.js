if (typeof global !== "undefined" && global !== null) {
    global.window = global
    global.headless = true

}
else {
    window.require = function() {}
    window.headless = false
}



