//Programming utilities that are meant to help out with the magic of programming in the browser. 


jQuery.extend(KhanUtil, {
    replLoop: function(input){
        console.log("This is the input:", input);

        if(input == "evalCode()"){
            KhanUtil.evalEditorCode();
        }

        else if(input !== null && input !== ""){
            var result = Python.eval(input);
            console.log("This is the result:",result);
            if(result !== null && result !== "" && result !== undefined){
                KhanUtil.jqconsole.Write(result, "fromreplloop");
            }
        }
        KhanUtil.jqconsole.Prompt(true,KhanUtil.replLoop);
        },
    
    evalEditorCode: function (){
                //     if (Python.isFinished(input.val())) {

        //         var result = Python.eval(code_editor.getSession().getValue());
        //         if (result !== null && result !== undefined) {

        var content = KhanUtil.code_editor.getSession().getValue();
        var results =Python.eval(content);
        if(results === null && results !== undefined) {
            KhanUtil.jqconsole.Write("Ahoy Ahoy! Code evaluated!");
        }

        console.log(results);
    },
    welcomingMessage: "Let's do computer science! This is a REPL."
        + " You can just put in Python code here and it works!\n"
        + "To the left is the editing area. That is where you can work on bigger "
        + "projects. When you want to test the code you wrote in the editor "
        + "just type 'evalCode()' into the REPL. "
        + "Then you have access to all the functions and variables you created!\n"
        + "Your mission, should you choose to accept it, is to make all the tests on the right pass!\n"
                      + "Have fun!",

    setupWorkArea: function(){
        //Some basic elements to be transformed later
        var pre_editor = $("<div>").attr({"id":"programming-editor"});
        var pre_console = $("<div>").attr({"id":"repl"});

        //The editor needs room to breath!
        //Shoe horning the editor and repl into there meant making some adjustments 
        //to how everything was laid out. Probably not the best way to do it though. 
        $("#problemarea").width("80%");
        $("#answer_area").css({"position":"absolute","right":"0px"});
        
        //Elements need to be appended to the document before they will actually work
        //... I think.
        var problem = $("#workarea");

        $(".question", problem).append(pre_console).append(pre_editor);

        //Setting up the editor
        var PythonMode = require("ace/mode/python").Mode;
        this.code_editor = ace.edit("programming-editor");
        this.code_editor.setTheme("ace/theme/vibrant_ink");         //It's the 21st century guys.
        this.code_editor.getSession().setMode(new PythonMode());  //Why aren't these chainable? 

        //Setting up the console
        this.jqconsole = pre_console.jqconsole(KhanUtil.welcomingMessage, "\n>", "cont");        
        this.jqconsole.Prompt(true,this.replLoop);

        //Setting up the console and editor to play nice
        Python.initialize(null, function(chr) {
            KhanUtil.jqconsole.Write(String.fromCharCode(chr));
        });
    }
});


//Everyonce in a while this throws a really gnarly error when loading up the scripts.
// If they don't come in the right order, then chrome throws a hissy fit. 
// Looks like this:
// Uncaught ReferenceError: define is not defined ace.js:1
// Missing module: ace/theme/vibrant_ink
// GET http://localhost:8000/exercises/lib/python2.7/encodings/__init__.py 404 (File not found)
// GET http://khanacademy.org/images/node-not-started.png 
