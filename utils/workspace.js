function MakeWorkspace(workspace, options) {
    var defaults = {
    	functions: "f g h",
    };
    
    options = _.extend(defaults, options);
    var message = '"Type in something here and it will be parsed it on the right."'
    var $input = $('<textarea id="workspace_input" placeholder='+message+'/>');
    var $tex = $('<div id="workspace_display" class="tex"/>');
    var $texToggle = $('<a href="#" id="workspace-tex-toggle"/>');
    
	
    $(workspace).append($input, $tex, $texToggle);
	
    var lastParsedTex = [];
    
    var update = function() {
        isTex = Khan.workspace.isTex();
        if(isTex && $input.val()) {
        	$tex.empty().append($("<code>").text($input.val())).tex();
        } else {
        	var inputLines = $input.val().split(/\r|\r\n|\n/);
        	var parsedText = "";
        	_.each(inputLines, function(inputLine, i) {
        		var result = KAS.parse(inputLine, options);
        		if(result.parsed) {
        			lastParsedTex[i] = result.expr.tex();
        		}
        		parsedText += lastParsedTex[i] +" \\\\ ";
        	});
        	$tex.empty().append($("<code>").text(parsedText)).tex()
        }	
    };
        
    // Define event handlers
    $input.on("input propertychange", update);

    $input.on("keydown", function(event) {
        var input = $input[0];

        var start = input.selectionStart;
        var end = input.selectionEnd;
        var supported = start !== undefined;

        if (supported && event.which === 8 /* backspace */) {
            var val = input.value;
            if (start === end && val.slice(start - 1, start + 1) === "()") {
                // "f(|)" + backspace -> "f|" (| is the cursor position)
                event.preventDefault();
                input.value = val.slice(0, start - 1) + val.slice(start + 1);
                input.selectionStart = start - 1;
                input.selectionEnd = end - 1;
                update();
            }
        }
    });

    $input.on("keypress", function(event) {
        var input = $input[0];

        var start = input.selectionStart;
        var end = input.selectionEnd;
        var supported = start !== undefined;

        if (supported && event.which === 40 /* left paren */) {
            var val = input.value;
            event.preventDefault();

            if (start === end) {
                // "f|" + "(" -> "f(|)"
                var insertMatched = _.any([" ", ")", ""], function(c) {
                    return val.charAt(start) === c;
                });

                input.value = val.slice(0, start) +
                        (insertMatched ? "()" : "(") + val.slice(end);
            } else {
                // "f|x+y|" + "(" -> "f(|x+y|)"
                input.value = val.slice(0, start) +
                        "(" + val.slice(start, end) + ")" + val.slice(end);
            }

            input.selectionStart = start + 1;
            input.selectionEnd = end + 1;
            update();

        } else if (supported && event.which === 41 /* right paren */) {
            var val = input.value;
            if (start === end && val.charAt(start) === ")") {
                // f(|) + ")" -> "f()|"
                event.preventDefault();
                input.selectionStart = start + 1;
                input.selectionEnd = end + 1;
                update();
            }
        }
        
        this.update = update;
        
        return this;
    });
}
