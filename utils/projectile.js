$.extend(KhanUtil, {
    initLauncher:function(options){
        var X=0;
        var Y=1;
        var graph=KhanUtil.currentGraph;
        var DEG_TO_RAD=Math.PI/180;
        var g=9.8;
        var launcher=KhanUtil.addMovablePoint($.extend(true,{
            coord:[0,10],
            velocity:10,
            initVelocity:[0,0],
            angle:45,
            baseCoord:[0,0],
            onMove:function(x,y){
                launcher.updateLauncher(x,y);
            }
        },options));

        launcher.line=KhanUtil.addMovableLineSegment({
            pointA:launcher,
            coordZ:launcher.baseCoord,
            fixed:true,
            extendLine:true
        });

        launcher.flightPath=KhanUtil.bogusShape;
        launcher.drawFlight=function(){
            launcher.flightPath.remove();
            launcher.flightPath=graph.plotParametric(function(t) {
                return [launcher.baseCoord[X]+launcher.initVelocity[X]*t, 
                        launcher.baseCoord[Y]+launcher.initVelocity[Y]*t-.5*g*t*t];
            }, [0, 2*launcher.initVelocity[Y]/g], {
                stroke: "gray",
                strokeDasharray: "-"
            });
        };
        launcher.updateLauncher=function(x,y){
            deltaX=x-this.baseCoord[X];
            deltaY=y-this.baseCoord[Y];
            launcher.velocity=Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2))*3;
            launcher.angle=Math.atan(y/x)/DEG_TO_RAD;
            launcher.initVelocity=[launcher.velocity*Math.cos(launcher.angle*DEG_TO_RAD),
                                   launcher.velocity*Math.sin(launcher.angle*DEG_TO_RAD)];
            launcher.drawFlight();
            $("#answer-init_velocity code").text(Math.round(this.velocity*10)/10);
            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#answer-init_velocity")[0]]);
            $("#answer-angle code").text(Math.round(this.angle*10)/10+"\u00B0");
            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $("#answer-angle")[0]]);
        };

        launcher.updateDistance=function(textV,fixed=false){
            if(textV.value){
                newVelocity=textV.value/3;
                if(fixed){
                    launcher.constraints.fixedDistance.dist=newVelocity;
                    launcher.constraints.fixedDistance.point=launcher.baseCoord;
                };
                angle=launcher.angle*DEG_TO_RAD;
                newCoords=[newVelocity*Math.cos(angle),newVelocity*Math.sin(angle)];
                launcher.setCoord(newCoords);
                launcher.onMove(newCoords[X],newCoords[Y]);
            };
        };

        launcher.updateAngle=function(textAngle,fixed=false){
            if(textAngle.value){
                launcher.angle=textAngle.value;
                angle=launcher.angle*DEG_TO_RAD;
                newCoords=[launcher.velocity*Math.cos(angle)/3,launcher.velocity*Math.sin(angle)/3];
                launcher.setCoord(newCoords);
                launcher.onMove(newCoords[X],newCoords[Y]);
                launcher.line.transform(true);
            };
        };

        launcher.updateLauncher(launcher.coord[X],launcher.coord[Y]);

        return launcher;
    },
    drawFlightPath: function(init_x,init_v,a,color){
        var X=0;
        var Y=1;
        var graph=KhanUtil.currentGraph;
        return graph.plotParametric(function(t) {
                  return [init_x[X]+init_v[X]*t+.5*a[X]*t*t, 
                           init_x[Y]+init_v[Y]*t+.5*a[Y]*t*t];
               }, [0, 2*init_v[Y]/9.8], {
                   stroke: color,
                   strokeDasharray: "."
               });
    },
    getMaxTime: function(projectile,xBoundary,yMin){
        X=0;
        Y=1;
        vy=projectile.initVelocity[Y];
        xTime=(xBoundary-projectile.initCoord[X])/projectile.initVelocity[X];
        yTime=(-vy+Math.sqrt(vy*vy-2*projectile.initAccel[Y]*(projectile.initCoord[Y]-yMin)))/projectile.initAccel[Y];
        if(yTime<=0){
            yTime=(-vy-Math.sqrt(vy*vy-2*projectile.initAccel[Y]*(projectile.initCoord[Y]-yMin)))/projectile.initAccel[Y];
        };
        if(xTime<yTime){
            return xTime;
        };
        return yTime;
    },
    projectileCollision: function(projectile,target,initVelocity,angle){
        X=0;
        Y=1;
        var DEG_TO_RAD=Math.PI/180;
        v0=[initVelocity*Math.cos(angle*DEG_TO_RAD),initVelocity*Math.sin(angle*DEG_TO_RAD)];
        maxTime = 10/v0[X];
        timeStep=maxTime/100;
        for(time=0;time<maxTime;time+=timeStep){
            projectileCoord=projectile.eqOfMotion(projectile.initCoord,v0,projectile.initAccel,time)[0];
            targetCoord=projectile.eqOfMotion(target.initCoord,target.initVelocity,target.initAccel,time)[0];
            deltaX=projectileCoord[X]-targetCoord[X];
            deltaY=projectileCoord[Y]-targetCoord[Y];
            if((deltaX*deltaX+deltaY*deltaY)<=(projectile.radius+target.radius)*(projectile.radius+target.radius)){
                return time;
            };
        };
        return -1;
    },
    getVelocity:function(deltaX,deltaY,angle,accel){
        var DEG_TO_RAD=Math.PI/180;
        vinitSq=(0.5*accel*deltaX*deltaX)/
              (deltaY*Math.cos(angle*DEG_TO_RAD)-deltaX*Math.sin(angle*DEG_TO_RAD))/Math.cos(angle*DEG_TO_RAD);
        return Math.sqrt(vinitSq);
    },
    getAngle:function(deltaX,velocity){
        g=9.8;
        return 0.5*Math.asin(g*deltaX/velocity/velocity);
    }
});
