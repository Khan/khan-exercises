(function(KhanUtil) {
    KhanUtil.Projectile_motion = function(coord_in, vel_in, accel) {
        this.coord_in = coord_in;
        this.vel_in = vel_in;
        this.accel = accel;
    };   
    KhanUtil.Projectile_motion.prototype = {
        x: function(time){
            return this.coord_in[0] + this.vel_in[0] * time + this.accel[0] * Math.pow(time, 2) / 2;
        },
        y: function(time){
            return this.coord_in[1] + this.vel_in[1] * time + this.accel[1] * Math.pow(time, 2) / 2;
        },
        time_on_the_top: function(){
            return ((this.vel_in[1]/this.accel[1]) < 0) ? (-this.vel_in[1]/this.accel[1]) : 0;
        },      
        vx: function(time){
            return this.vel_in[0] + this.accel[0] * time;
        },
        vy: function(time){
            return this.vel_in[1] + this.accel[1] * time;
        },
        v: function(time){
            return Math.sqrt(Math.pow(this.vx.call(this, time), 2) + Math.pow(this.vy.call(this, time), 2));
        },
        v_angle: function(time){
            return Math.atan(this.vy.call(this, time)/this.vx.call(this, time))
        },  
        draw: function(graph, PR, t, scaling, a_scaling, v_scaling){
            var y_coord = PR.y(t)*scaling;
            var x_coord = PR.x(t)*scaling;
            graph.point_onTraject.setCoord([x_coord, y_coord]);
            if(graph.accel_vector) graph.accel_vector.remove();
            graph.accel_vector = KhanUtil.currentGraph.line( [x_coord, y_coord], [x_coord, y_coord+PR.accel[1]*a_scaling], { stroke: "blue", arrows: "-&gt;", "stroke-opacity": 0.4 } );      
            if(graph.v_vector) graph.v_vector.remove();
            graph.v_vector = KhanUtil.currentGraph.line( [x_coord, y_coord], [x_coord+PR.vx(t)*v_scaling, y_coord+PR.vy(t)*v_scaling], {stroke: "purple", arrows: "-&gt;" }); 
            if(graph.vx_vector) graph.vx_vector.remove();
            graph.vx_vector = KhanUtil.currentGraph.line( [x_coord, y_coord], [x_coord+PR.vx(t)*v_scaling, y_coord], {stroke: "green", arrows: "-&gt;", strokeDasharray: "- ", "stroke-opacity": 0.9});
            if(graph.vy_vector) graph.vy_vector.remove();
            graph.vy_vector = KhanUtil.currentGraph.line( [x_coord, y_coord], [x_coord, y_coord+PR.vy(t)*v_scaling], {stroke: "red", arrows: "-&gt;", strokeDasharray: "- ", "stroke-opacity": 0.9});                             
        },
        move: function(graph, PR, full_time, scaling, a_scaling, v_scaling, global, update_interval, number_of_steps){
            var time =0;           
            global.in_motion = 1;
            var interval_Var=setInterval(function(){
                PR.draw(graph, PR, time, scaling, a_scaling, v_scaling);  
                time = time + full_time/number_of_steps;
                if (global.in_motion == 0){
                    clearInterval(interval_Var);
                    PR.clear_graph(graph);
                }  
                if (time >= full_time) {
                    clearInterval(interval_Var);
                    global.in_motion = 0;
                }
            },update_interval);
        },
        clear_graph: function(graph){
            graph.accel_vector.remove();
            graph.vx_vector.remove();
            graph.vy_vector.remove();
            graph.v_vector.remove();
        }
   }
})(KhanUtil); 