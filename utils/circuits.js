$.extend(KhanUtil, {
    initResistorSet: function(options){
        var graph=KhanUtil.currentGraph;
        var resistorSet=$.extend(true,{
            init:[],
            circuitArray:[],
            measuredResistance:0
        },options);

        resistorInit=[[40,20],[40,18],[40,16],[40,14],[40,12],[40,10],[40,8],[40,6]];
        resistorSet.resistors = [];
        for(index=1;index<=resistorSet.init.length;index++){
            resistorSet.resistors.push(KhanUtil.addResistor({
            id:index-1,
            coord:resistorInit[index-1],
            resistance:resistorSet.init[index-1][2],
            displayBox:displaySize})
            );
        };

        resistorSet.updateArray=function(){
            resistorSet.circuitArray=[];
            for(i=0;i<resistorSet.resistors.length;i++){
                if(resistorSet.resistors[i].wireId.length){
                    resistorSet.circuitArray.push(resistorSet.resistors[i].wireId);
                };
            };
        };
        resistorSet.removeResistors=function(){
            for(i=0;i<resistorSet.length;i++){
                resistorSet.resistors[i].graphic.remove();
                resistorSet.resistors[i].graphic=graph.raphael.set();
            }
        };
        return resistorSet;
    },
    addResistor: function(options){
        offset = 2;
        var graph=KhanUtil.currentGraph;
        var resistor = $.extend(true,KhanUtil.movablePoint,{
            id:0,
            direction: "horizontal",
            resistance: 1,
            coord: [0,0],
            displaySize:[[0,42],[0,22]],
            graphic:graph.raphael.set(),
            color: KhanUtil.BLUE,
            wireId:[],
            fixed:false
        },options);

        resistor.label = graph.label(resistor.coord,resistor.resistance,"above");

        resistor.redraw = function(x,y){
            resistor.graphic.remove();
            resistor.graphic = graph.raphael.set();
            if(y>=displaySize[1][1]){y=displaySize[1][1]};
            if(x>=displaySize[0][1]){x=displaySize[0][1]};

            if(resistor.direction=="horizontal"){
                resistor.graphic.push(graph.path([
                        [x-1,y],[x-0.5,y],[x-0.4,y+0.1],[x-0.2,y-0.1],[x,y+0.1],[x+0.2,y-0.1],
                        [x+0.4,y+0.1],[x+0.5,y],[x+1,y]],{ stroke: resistor.color, opacity: 1.0 }));
                resistor.label.css({marginLeft: -10,marginTop: -30});
            }
            else{
                resistor.graphic.push(graph.path([
                        [x,y-1],[x,y-0.5],[x+0.1,y-0.4],[x-0.1,y-0.2],[x+0.1,y],[x-0.1,y+0.2],
                        [x+0.1,y+0.4],[x,y+0.5],[x,y+1]],{ stroke: resistor.color, opacity: 1.0 }));
                resistor.label.css({marginLeft: 0,marginTop: -15});
            }
            resistor.label.setPosition([x,y]);
            return [x,y];
        };

        resistor.check = function(){
            circuits=mainCircuit.subCircuits;
            rx = Math.round(resistor.movable.coord[0]);
            ry = Math.round(resistor.movable.coord[1]);
            needsUpdate=false;
            // Check if the resistor has been moved off the wire
            wireId=resistor.wireId;
            if(resistor.wireId.length>0){
                circuit=circuits[wireId[0]];
                if((resistor.direction=="horizontal" && 
                        (ry-circuit.box[1][0]!=wireId[1] || rx>circuit.box[0][1] || rx<circuit.box[0][0]))||
                        (resistor.direction=="vertical" && 
                        (rx-circuit.box[0][0]!=wireId[1] || ry>circuit.box[1][1] || ry<circuit.box[1][0]))){
                    resistor.wireId = [];
                    resistor.color=KhanUtil.BLUE;
                    needsUpdate=true;
                };
            };
            // Check if the resistor has been moved to a wire
            for(i=0;i<circuits.length;i++){
                circuit = circuits[i];
                if(rx>=circuit.box[0][0] && rx<=circuit.box[0][1] && ry>=circuit.box[1][0] && ry<=circuit.box[1][1]){
                    resistor.direction = circuit.direction;
                    resistor.color=KhanUtil.RED;
                    myWire=0;
                    if(resistor.direction == "horizontal"){
                        myWire = (ry-circuit.box[1][0])/2;
                    }
                    else{
                        myWire = (rx-circuit.box[0][0])/2;
                    };

                    resistor.wireId=[i,myWire,resistor.resistance];
                    needsUpdate=true;
                };
            };
            if(needsUpdate){
                resistorSet.updateArray();
                wireArray=KhanUtil.calculateResistance(resistorSet.circuitArray,true,true)[0];
                mainCircuit.updateWires(wireArray);
            };
        };
        if(!resistor.fixed){
            resistor.movable = KhanUtil.addMovablePoint({
                coord:resistor.coord,
                snapX:2,
                snapY:2,
                onMove:function(x,y){
                    resistor.check();
                    newCoords=resistor.redraw(x,y);
                    return newCoords;
                }
            });
        };
        resistor.redraw(resistor.coord[0],resistor.coord[1]);
        return resistor;
    },
    // Controls for the main circuit
    initMainCircuit: function(options){
        var graph=KhanUtil.currentGraph;
        var mainCircuit=$.extend(true,{
           problemType:"Find Voltage",
           appliedVoltage:0,
           circuitBox:[[0,0],[20,10]],
           mainGraphic:graph.raphael.set(),
           measuredResistance:0
        },options);
        // Draw the main circuit, battery, gauge, and measured resistor with labels
        mainCircuit.mainGraphic.push(graph.path([[mainCircuit.circuitBox[0][0]+OFFSET,mainCircuit.circuitBox[1][0]],
                               [mainCircuit.circuitBox[0][0],mainCircuit.circuitBox[1][0]],
                               [mainCircuit.circuitBox[0][0],mainCircuit.circuitBox[1][1]],
                               [mainCircuit.circuitBox[0][0]+OFFSET,mainCircuit.circuitBox[1][1]]]));
        mainCircuit.mainGraphic.push(graph.path([[mainCircuit.circuitBox[0][1],mainCircuit.circuitBox[1][1]],
                               [mainCircuit.circuitBox[0][1]+OFFSET,mainCircuit.circuitBox[1][1]],
                               [mainCircuit.circuitBox[0][1]+OFFSET,mainCircuit.circuitBox[1][1]-OFFSET/2]]));
        mainCircuit.mainGraphic.push(graph.path([[mainCircuit.circuitBox[0][1]+OFFSET,mainCircuit.circuitBox[1][0]+OFFSET/2],
                               [mainCircuit.circuitBox[0][1]+OFFSET,mainCircuit.circuitBox[1][0]],
                               [mainCircuit.circuitBox[0][1],mainCircuit.circuitBox[1][0]]]));

        batteryPos = [mainCircuit.circuitBox[0][0]-25/15, mainCircuit.circuitBox[1][1]-2];
        batteryPosScaled = graph.scalePoint(batteryPos);
        mainCircuit.mainGraphic.push(graph.mouselayer.image(Khan.urlBase + "images/battery.png", 
                                     batteryPosScaled[0], batteryPosScaled[1], 50, 50));
        mainCircuit.mainGraphic.push(graph.label(batteryPos,mainCircuit.appliedVoltage+"V","center"))
        mainCircuit.mainGraphic.push(graph.label([batteryPos[0],batteryPos[1]-2],"0V","below"))

        mainCircuit.mainGraphic.push(graph.path([[circuitBox[0][0],5],
                                     [circuitBox[0][0]-OFFSET,5],[circuitBox[0][0]-OFFSET,6]]));
        mainCircuit.mainGraphic.push(graph.path([[circuitBox[0][0]-OFFSET,9],
                                     [circuitBox[0][0]-OFFSET,10],[circuitBox[0][0],10]]));

        var gaugePos = graph.scalePoint([circuitBox[0][0]-5.6,9.2]);
        mainCircuit.mainGraphic.push(graph.mouselayer.image(Khan.urlBase + "images/gauge.png", 
                                     gaugePos[0], gaugePos[1], 50, 50));
        mainCircuit.mainGraphic.push(KhanUtil.addResistor({
            coord:[circuitBox[0][0],circuitBox[1][0]+OFFSET],
            direction:"vertical",
            resistance:mainCircuit.measuredResistance,
            color:KhanUtil.RED,
            fixed:true
            }));

        // Add subcircuits that can be modified by the user
        mainCircuit.subCircuits=[];
        if(mainCircuit.problemType=="Find Voltage"){
            mainCircuit.subCircuits = 
                [KhanUtil.addCircuit({
                    coord:[circuitBox[0][0]+OFFSET,circuitBox[1][1]],
                    direction: "horizontal",
                    type: "parallel",
                    len: circuitWidth-OFFSET}),
                KhanUtil.addCircuit({
                    coord:[circuitBox[0][1]+OFFSET,circuitBox[1][0]+OFFSET/2],
                    direction: "vertical",
                    type: "parallel",
                    len: circuitHeight-OFFSET}),
                KhanUtil.addCircuit({
                    coord:[circuitBox[0][0]+OFFSET,circuitBox[1][0]],
                    direction: "horizontal",
                    type: "parallel",
                    len: circuitHeight-OFFSET
                })];
        };
        mainCircuit.updateWires=function(wireArray){
            for(i=0;i<wireArray.length;i++){
                mainCircuit.subCircuits[i].updateWires(wireArray[i]);
            };
        };
        return mainCircuit;
    },
    addCircuit: function(options){
        var graph=KhanUtil.currentGraph;
        var circuit = $.extend(true,{
            coord: [0,0],
            direction:"horizontal",
            type: "parallel",
            len:10,
            resistance: 0,
            nbrWires: 3,
            wire:[graph.raphael.set(),graph.raphael.set(),graph.raphael.set()]
        },options);

        // Set up the graphics for drawing wires and 
        // the bounding box for collision detection with resistors
        circuit.box=[];
        circuit.mainPath=[];
        circuit.lowerPath=[];
        circuit.upperPath=[];
        circuit.lowerConnect1=[];
        circuit.lowerConnect2=[];
        circuit.upperConnect1=[];
        circuit.upperConnect2=[];
        if(circuit.direction=="horizontal"){
            circuit.box = [[circuit.coord[0]+1,circuit.coord[0]+circuit.len-1],
                           [circuit.coord[1]-OFFSET/2,circuit.coord[1]+OFFSET/2]];
            circuit.mainPath=[circuit.coord,[circuit.coord[0]+circuit.len,circuit.coord[1]]];
            circuit.lowerPath=[[circuit.coord[0],circuit.coord[1]-OFFSET/2],
                               [circuit.coord[0]+circuit.len,circuit.coord[1]-OFFSET/2]];
            circuit.lowerConnect1=[[circuit.coord[0],circuit.coord[1]-OFFSET/2],
                                   [circuit.coord[0],circuit.coord[1]]];
            circuit.lowerConnect2=[[circuit.coord[0]+circuit.len,circuit.coord[1]-OFFSET/2],
                                   [circuit.coord[0]+circuit.len,circuit.coord[1]]];
            circuit.upperPath=[[circuit.coord[0],circuit.coord[1]+OFFSET/2],
                               [circuit.coord[0]+circuit.len,circuit.coord[1]+OFFSET/2]];
            circuit.upperConnect1=[[circuit.coord[0],circuit.coord[1]+OFFSET/2],
                                   [circuit.coord[0],circuit.coord[1]]];
            circuit.upperConnect2=[[circuit.coord[0]+circuit.len,circuit.coord[1]+OFFSET/2],
                                   [circuit.coord[0]+circuit.len,circuit.coord[1]]];
        }
        else{
            circuit.box = [[circuit.coord[0]-OFFSET/2,circuit.coord[0]+OFFSET/2],
                           [circuit.coord[1]+1,circuit.coord[1]+circuit.len-1]];
            circuit.mainPath=[circuit.coord,[circuit.coord[0],circuit.coord[1]+circuit.len]];
            circuit.lowerPath=[[circuit.coord[0]-OFFSET/2,circuit.coord[1]],
                               [circuit.coord[0]-OFFSET/2,circuit.coord[1]+circuit.len]];
            circuit.lowerConnect1=[[circuit.coord[0]-OFFSET/2,circuit.coord[1]],
                                   [circuit.coord[0],circuit.coord[1]]];
            circuit.lowerConnect2=[[circuit.coord[0]-OFFSET/2,circuit.coord[1]+circuit.len],
                                   [circuit.coord[0],circuit.coord[1]+circuit.len]];
            circuit.upperPath=[[circuit.coord[0]+OFFSET/2,circuit.coord[1]],
                               [circuit.coord[0]+OFFSET/2,circuit.coord[1]+circuit.len]];
            circuit.upperConnect1=[[circuit.coord[0]+OFFSET/2,circuit.coord[1]],
                                   [circuit.coord[0],circuit.coord[1]]];
            circuit.upperConnect2=[[circuit.coord[0]+OFFSET/2,circuit.coord[1]+circuit.len],
                                   [circuit.coord[0],circuit.coord[1]+circuit.len]];
        };

        circuit.updateWires=function(wireArray){
            if(wireArray[0]>0){
                circuit.wire[0].remove();
                circuit.wire[0]=graph.raphael.set();
                circuit.wire[0].push(graph.path(circuit.lowerPath,{stroke:KhanUtil.BLUE,opacity: 1.0 }));
                circuit.wire[0].push(graph.path(circuit.lowerConnect1));
                circuit.wire[0].push(graph.path(circuit.lowerConnect2));   
            }
            else{
                circuit.wire[0].remove();
            };
            if(wireArray[1]>0 || (wireArray[0]==0 && wireArray[2]==0)){
                circuit.wire[1].remove();
                circuit.wire[1]=graph.raphael.set();
                circuit.wire[1].push(graph.path(circuit.mainPath,{stroke:KhanUtil.BLUE,opacity: 1.0 }));
            }
            else{
                circuit.wire[1].remove();
            };
            if(wireArray[2]>0){
                circuit.wire[2].remove();
                circuit.wire[2]=graph.raphael.set();
                circuit.wire[2].push(graph.path(circuit.upperPath,{stroke:KhanUtil.BLUE,opacity: 1.0 }));
                circuit.wire[2].push(graph.path(circuit.upperConnect1));
                circuit.wire[2].push(graph.path(circuit.upperConnect2));   
            }
            else{
                circuit.wire[2].remove();
            };
        };

        circuit.updateWires([0,0,0]);
        return circuit;
    },

    calculateResistance: function(circuitArray,updateAnswerFlag,roundAnswerFlag){
        totalResistance = 0;
        wireArray = [[0,0,0],[0,0,0],[0,0,0]];
        for(i=0;i<circuitArray.length;i++){
            circuit = circuitArray[i][0];
            if(circuit>-1){
                wireArray[circuit][circuitArray[i][1]]=wireArray[circuit][circuitArray[i][1]]+circuitArray[i][2];
            };
        };
        circuitResistance=0;
        for(i=0;i<wireArray.length;i++){
            subCircuitResistance=0;
            for(j=0;j<wireArray[i].length;j++){
                if(wireArray[i][j]){
                    subCircuitResistance=subCircuitResistance+1/wireArray[i][j];
                };
            };
            if(subCircuitResistance){
                circuitResistance=circuitResistance+1/subCircuitResistance;
            };
        };
        if(roundAnswerFlag){
            circuitResistance = circuitResistance;
        };
        if(updateAnswerFlag){
            voltage=KhanUtil.calculateVoltage(mainCircuit.appliedVoltage,circuitResistance,resistorSet.measuredResistance);
            $("#answer-preview code").text(voltage);
            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#answer-preview")[0]]);
            totalResistance=Math.round((circuitResistance+resistorSet.measuredResistance)*100)/100.0;
            $("#answer-resistance code").text(totalResistance);
            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#answer-resistance")[0]]);

        };
        return [wireArray,circuitResistance];
    },
    calculateVoltage: function(appliedVoltage,circuitResistance,measuredResistance){
        return Math.round((appliedVoltage*(1-circuitResistance/(circuitResistance+measuredResistance)))*100)/100;
    },
    calculateResistorsUsed: function(circuitArray){
        nbrResistors=0;
        for(i=0;i<circuitArray.length;i++){
            if(circuitArray[i][0]>-1){
                nbrResistors++;
            };
        };
        return nbrResistors;
    },
    calculateParallelSections: function(solutionArray){
        nbrParallel=0;
        for(i=0;i<solutionArray.length;i++){
            nbrWires=0;
            for(j=0;j<solutionArray[i].length;j++){
                if(solutionArray[i][j]>0){
                    nbrWires++;
                };
            };
            if(nbrWires>1){
                nbrParallel++;
            };
        };
        return nbrParallel;        
    },
    showVoltageSolution: function(resistors){
        var graph=KhanUtil.currentGraph;
        solutionSet=[];
        wirePosition=[2,2,2];
        for(i=0;i<resistors.length;i++){
            circuitNbr=resistors[i][0];
            if(circuitNbr>-1){
                circuit=mainCircuit.subCircuits[circuitNbr];
                wire=resistors[i][1];
                if(circuit.direction=="horizontal"){
                    rx=circuit.coord[0]+wirePosition[circuitNbr];
                    ry=circuit.coord[1]+wire*2-2;
                    wirePosition[circuitNbr]=wirePosition[circuitNbr]+2;
                }
                else{
                    rx=circuit.coord[0]+wire*2-2;;
                    ry=circuit.coord[1]+wirePosition[circuitNbr];
                    wirePosition[circuitNbr]=wirePosition[circuitNbr]+2;
                };
                solutionSet.push(KhanUtil.addResistor({
                    coord:[rx,ry],
                    resistance:resistors[i][2],
                    direction:circuit.direction,
                    fixed:true,
                    color:KhanUtil.PURPLE
                }));
            }
        };
    }
});
