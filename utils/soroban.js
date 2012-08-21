$.extend(KhanUtil, {
  soroban: {
    answerStart: 0,
    mp: [],
  }});
  
$.extend(KhanUtil, {
  initSoroban: function(columns, firstDot, answerStart) {
    if (answerStart != null) KhanUtil.soroban.answerStart = answerStart;
    var width = 1.5;
    var graph = KhanUtil.currentGraph;
    var mp = KhanUtil.soroban.mp;
    graph.init({
      range: [[-2, columns * width + 1] ,[-1.5, 8]],
      scale: [20, 20]
    });
    KhanUtil.addMouseLayer();

    function addPoint(x, y) {
      var pnt = KhanUtil.addMovablePoint({
        snapY: 1,
        coord: [x * width, y],
          highlightStyle: {
            fill: KhanUtil.RED,
            stroke: KhanUtil.RED,
            scale: 4
          }
      });

      pnt.onMove = function( x, y, recursive ) {
        if (recursive == null) {
          var heaven = KhanUtil.soroban.mp[this.col][5];
          if (this.baseX + 1 <= x) {
            y = this.id;
            heaven.onMove(this.baseX, 6, 1);
            heaven.moveTo(this.baseX, 6);
          } else if (this.baseX - 1 >= x) {
            y = this.id + 1;
            heaven.onMove(this.baseX, 5, 1);
            heaven.moveTo(this.baseX, 5);
          }
        }
        x = this.baseX;
        if (y == this.coord[1]) return([x, y]);
        if (y > this.id + 1 || y < this.id) return ([x, this.coord[1]]);
        var direction = y > this.coord[1] ? 1 : -1;
        var sister = KhanUtil.soroban.mp[this.col][this.id + direction];
        if (sister != null) {
          sister.onMove(x, y + direction, 1);
          sister.moveTo(x, y + direction);
        }
        if (recursive == null) {
          this.coord[1] = y;
          KhanUtil.updateSorobanAnswer();
        }
        return([x, y]);
      }
    
      pnt.normalStyle.scale = 2;
      pnt.visibleShape.animate(pnt.normalStyle, 50);
      pnt.id = y;
      pnt.col = x;
      pnt.baseX = x * width;
      if (KhanUtil.soroban.mp[x] == null) KhanUtil.soroban.mp[x] = [];
      KhanUtil.soroban.mp[x][y] = pnt;
    }

    for (var x = 0; x < columns; x++) {
      var xPos = x * width;
      graph.line([xPos, -.5], [xPos, 6.5]);
      for (var y = 0; y < 4; y++) addPoint(x, y);
      addPoint(x, 5);
      mp[x][5].moveTo(xPos, 6);
    }
    graph.style({ stroke: "#6495ED", strokeWidth: 2 });
    var w = columns * width - .5;
    graph.line([-1, -.5], [w, -.5]);
    graph.line([-1, -.5], [-1, 6.5]);
    graph.line([w, -.5], [w, 6.5]);
    graph.line([-1, 4.5], [w, 4.5]);
    graph.style({ strokeWidth: 6 });
    graph.line([-1.05, 6.6], [w + .05, 6.6]);
    graph.style({ fill: "#FFFFFF", strokeWidth: 0 });
    var d = firstDot;
    while (d < columns) {
      graph.circle([d * width, 6.6], .05);
      d += 3;
    }
    KhanUtil.soroban.lastUnit = d - 3;
  },

  getSorobanVal : function(range) {
    var sb = KhanUtil.soroban;
    var mp = sb.mp;
    var start, end;
    if (range == null) {
      start = sb.answerStart;
      end = sb.lastUnit;
    } else {
      start = range[0];
      end = range[1];
    }
    var value = 0;
    for (var n = start; n <= end; n++) {
      value *= 10;
      var column = mp[n];
      for (var i = 0; i < 4; i++) if (i != column[i].coord[1]) value++;
      if (column[5].coord[1] == 5) value += 5;
    }
    return value;
  },

  resetSoroban : function() {
    var mp = KhanUtil.soroban.mp;
    for (var x = 0; x < mp.length; x++) {
      for (var y = 0; y < 4; y++) mp[x][y].moveTo(mp[x][y].coord[0], y);
      mp[x][5].moveTo(mp[x][5].coord[0], 6);
    }
    KhanUtil.updateSorobanAnswer();
  },

  setSoroban : function(val, unitPos) {
    var mp = KhanUtil.soroban.mp;
    KhanUtil.resetSoroban();
    while (val > 0) {
      var unit = val % 10;
      val = parseInt(val / 10);
      if (unit > 4) {
        mp[unitPos][5].moveTo(mp[unitPos][5].coord[0], 5);
        unit -= 5;
      }
      unit = 4 - unit;
      while (unit < 4) {
        mp[unitPos][unit].moveTo(mp[unitPos][5].coord[0], unit + 1);
        unit++;
      }
      unitPos--;
    }
    KhanUtil.updateSorobanAnswer();
  },

  updateSorobanAnswer : function() {
    $($("div.answer-label")[0]).text(KhanUtil.getSorobanVal());
  }

});
