{spawn} = require 'child_process'
puts = console.log

system = (name, args) ->
    print = (buffer) -> process.stdout.write buffer.toString()
    proc = spawn name, args
    proc.stdout.on 'data', print
    proc.stderr.on 'data', print
    proc.on        'exit', (status) ->
        process.exit(1) if status != 0

compileall = (from, to, watch = false) ->
    args = ['-o', to, '-c', from]
    args.unshift '-w' if watch
    system 'coffee', args

task 'c', 'Compile and watch', ->
    compileall 'lib/', 'public/', true

task 'compile', 'Compile', ->
    puts "Compiling..."
    compileall 'lib/', 'public/'

task 'server', 'Serve the current filesystem. Needed for loading textures from fs.
Require python installed.', ->
    system 'python', '-m SimpleHTTPServer'.split(' ')

task 'spec', "runs unit tests", ->
    compileall 'lib/', 'public'
    compileall 'spec/coffee', 'spec/javascripts'
    imports = ['spec/jasmine-node/lib', 'spec/javascripts', 'public']
    process.env["NODE_PATH"] += ":" + imports.join ":"
    system "node", ["spec/jasmine-node/specs.js"]
