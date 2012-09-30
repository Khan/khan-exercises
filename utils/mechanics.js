$.extend(KhanUtil, {
    initNewtonObject: function(options){
        var X=0;
        var Y=1;
        var graph=KhanUtil.currentGraph;
        var newtonObject=$.extend(true,{
            mass:1,
            initCoord:[10,10],
            initVelocity:[0,0],
            initAccel:[0,0],
            image: function(x,y){
                return graph.circle([x,y],0.1)
            },
            graphic:graph.raphael.set(),
            eqOfMotion:function(coord,velocity,accel,time){
                x=coord[X]+velocity[X]*time+.5*accel[X]*time*time;
                y=coord[Y]+velocity[Y]*time+.5*accel[Y]*time*time;
                vx = velocity[X]+accel[X]*time;
                vy = velocity[Y]+accel[Y]*time;
                return [[x,y],[vx,vy]]
            },
            stopCondition:function(){
                if(this.coord[Y]<=0 && this.velocity[Y]<0){
                    this.coord[Y]=0;
                    this.velocity=[0,0];
                    this.accel=[0,0];
                };
            }
        },options);
        newtonObject.coord=newtonObject.initcoord;
        newtonObject.velocity=newtonObject.initVelocity;
        newtonObject.accel=newtonObject.initAccel;

        newtonObject.update=function(timeStep,useInit){
            newtonObject.graphic.remove();
            newcoord=[0,0];
            if(useInit){
                newVars=newtonObject.eqOfMotion(
                          newtonObject.initCoord,newtonObject.initVelocity,newtonObject.initAccel,timeStep);
            }
            else{
                newVars=newtonObject.eqOfMotion(
                          newtonObject.coord,newtonObject.velocity,newtonObject.accel,timeStep);
            };
            x=newVars[0][X];
            y=newVars[0][Y];
            newtonObject.velocity=newVars[1];
            newtonObject.coord=[x,y];
            newtonObject.stopCondition();
            newtonObject.graphic.push(newtonObject.image(newtonObject.coord[X],newtonObject.coord[Y]));
        };

        newtonObject.update(0,[0,0]);
        return newtonObject;
    },

    initNewtonWorld: function(options){
        var graph=KhanUtil.currentGraph;
        var newtonWorld=$.extend(true,{
            gravity:true,
            timeStep:0.1,
            time:0,
            maxTime:10,
            inMotion:false,
            newtonObjects:[],
            stopCondition: function(){
                if(!newtonWorld.inMotion){
                    return true;
                };
                return false;
            },
            timebarCoords:[0,0],
            timebarSize:10
        },options);

        newtonWorld.motion=function(timeStep,init){
            if(init){
                newtonWorld.time=timeStep;
            }
            else{
                newtonWorld.time+=timeStep;
            };
            if(newtonWorld.time>newtonWorld.timebar.maxTime){
                newtonWorld.time=newtonWorld.timebar.maxTime;
            };
            newtonWorld.timebar.setCoord([newtonWorld.timebar.size*newtonWorld.time/newtonWorld.timebar.maxTime+
                                          newtonWorld.timebar.startCoord[X], newtonWorld.timebar.startCoord[Y]]);
            for(i=0;i<newtonWorld.newtonObjects.length;i++){
                newtonWorld.newtonObjects[i].update(timeStep,init);
            };
            $("#elapsed_time code").text(Math.round(newtonWorld.time*10)/10);
            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#elapsed_time")[0]]);
            if(!init && newtonWorld.stopCondition()){
                newtonWorld.pause();
            }
        };

        newtonWorld.timeEvent=function(){
            newtonWorld.motion(newtonWorld.timeStep,false);
        };

        newtonWorld.startMotion=function(timeStep){
            if(newtonWorld.inMotion){
                newtonWorld.pause();
            }
            else{
                newtonWorld.timeStep=timeStep;
                worldTime=setInterval(function(){newtonWorld.timeEvent()},timeStep*1000);
                newtonWorld.inMotion=true;
                $("#start_button code").text("Pause");
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#start_button")[0]]);
            }
        };

        newtonWorld.pause=function(){
                clearInterval(worldTime);
                newtonWorld.inMotion=false;
                $("#start_button code").text("Play");
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#start_button")[0]]);
        };

        newtonWorld.reset=function(){
            for(i=0;i<newtonWorld.newtonObjects.length;i++){
                newtonWorld.newtonObjects[i].coord=newtonWorld.newtonObjects[i].initCoord;
                newtonWorld.newtonObjects[i].velocity=newtonWorld.newtonObjects[i].initVelocity;
                newtonWorld.newtonObjects[i].accel=newtonWorld.newtonObjects[i].initAccel;
                newtonWorld.newtonObjects[i].update(0,true);
                newtonWorld.pause();
                newtonWorld.time=0;
                newtonWorld.timebar.setCoord([0.5,-0.5]);
            }
        };

        newtonWorld.timebar=KhanUtil.addTimebar({
            startCoord:newtonWorld.timebarCoords,
            update:function(time){
                if(newtonWorld.inMotion==true){
                    newtonWorld.pause();
                };
                newtonWorld.motion(time,true);
            },
            size:newtonWorld.timebarSize
        });
        newtonWorld.timebar.constraints.constrainY=true;
        return newtonWorld;
    },
    addTimebar:function(options){
        var X=0;
        var Y=1;
        var graph=KhanUtil.currentGraph;
        var timebar=KhanUtil.addMovablePoint($.extend(true,{
            startCoord: [0,0],
            size:10,
            direction:"horizontal",
            time:0,
            maxTime:10,
            graphic:KhanUtil.bogusShape,
            update:function(){
                return true
            },
            onMove:function(x,y){
                newTime=0;
                if(this.direction=="horizontal"){
                    newTime=x-this.startCoord[X];
                }
                else{
                    newTime=y-this.startCoord[Y];
                };
                if(newTime<=0){
                    newTime=0;
                }
                else if(newTime>this.size){
                    newTime=this.size;
                };
                this.time=newTime*this.maxTime/this.size;
                this.update(this.time);
                if(this.direction=="horizontal"){
                    x=newTime+this.startCoord[X];
                }
                else{
                    y=newTime+this.startCoord[Y];
                };
                return [x,y];
            }
        },options));

        timebar.setCoord(timebar.startCoord);
        if(timebar.direction=="horizontal"){
            timebar.graphic=graph.path([timebar.coord,[timebar.coord[X]+timebar.size,timebar.coord[Y]]]);
        }
        else{
            timebar.graphic=graph.path([timebar.coord,[timebar.coord[X],timebar.coord[Y]+timebar.size]]);
        };
        return timebar;
    }
});
