$(function() {
  var basePPU = 15;

  var canvas = $("canvas")[0];

  var ctx = window.ctx = $("canvas")[0].getContext("2d");
  ctx.font = "12px sans-serif";
  ctx.lineWidth = 1;

  var out = $("#out");

  var l = function(from, to) {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };
  var p = function(x, y) { return { x: x, y: y }; };

  var init = function(zoom) {
    var ppu = basePPU * zoom;
    var width = Math.round($(window).width(), 0);
    var height = Math.round($(window).height(), 0);

    canvas.height = height;
    canvas.width = width;

    ctx.clearRect(0, 0, width, height);

    var x_axis = width/2;
    var y_axis = height/2;

    var origin = { x: x_axis, y: y_axis };
    var x_offset = x_axis + 0.5; // location on canvas
    var y_offset = y_axis + 0.5; // of graph's origin

    var ppu = ppu * zoom;
    var pixelVal = 1/ppu;

    var y_max = Math.floor(y_axis/ppu);
    var x_max = Math.floor(x_axis/ppu);

    var xToI = function(x) {
      return x*ppu + origin.x;
    };
    var yToJ = function(y) {
      return origin.y - y*ppu;
    };
    var iToX = function(x) {
      return (x - x_axis)/ppu;
    };
    var jToY = function(y) {
      return (y - y_axis)/ppu;
    };

    var pointToPx = function(point) {
      return p(xToI(point.x), ytoJ(point.y));
    };
    var pxToPoint = function(pixel) {
      return p(iToX(pixel.x), jtoY(pixel.y));
    };

    // draw x-axis
    ctx.beginPath();
    ctx.moveTo(0, y_offset);
    ctx.lineTo(x_axis*2, y_offset);
    ctx.stroke();
    ctx.closePath();

    // draw x values
    j = -x_max;
    while (j <= x_max) {
      x = j * ppu;
      ctx.strokeStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(x + x_offset, y_offset);
      ctx.lineTo(x + x_offset, y_offset + 10);
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = '#666';
      ctx.strokeText(j, x + x_offset - 5, y_offset + 30);

      j++;
      if (j === 0) { j++; }
    }

    // draw y-axis
    ctx.beginPath();
    ctx.moveTo(x_offset, 0);
    ctx.lineTo(x_offset, y_axis*2);
    ctx.stroke();
    ctx.closePath();

    // draw y values
    j = -y_max;
    while (j <= y_max) {
      y = j * ppu;
      ctx.strokeStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(x_offset, y + y_offset);
      ctx.lineTo(x_offset - 10, y + y_offset);
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = '#666';
      ctx.strokeText(-j, x_offset - 25, y + y_offset + 5);

      j++;
      if (j === 0) { j++; }
    }
    return {
      width: width,
      height: height,
      plot: function(f) {
        var calcJ = function(i) {
          var x = iToX(i);
          var y = f(x);
          return yToJ(y);
        };
        var prev = calcJ(0);

        ctx.beginPath();
        ctx.moveTo(0, prev);

        for(var i = 1; i < width; i++){
          var j = calcJ(i);
          ctx.lineTo(i, j);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
    };
  };
  init(parseInt($("#zoom").val()));

//  plot(function(x) {
//    return Math.pow(Math.E, -Math.pow(x, 2));
//  });
  
  $("#go").click(function() {
    var equations = $("#equations").val().split('\n');
    var funcs = equations.map(function(eq) { return new Function('x', "return " + eq + ';'); });

    var graph = init(parseInt($("#zoom").val()));

    funcs.forEach(graph.plot);
  });

  // plot(function(x) {
  //   return 1/(Math.PI*(1+Math.pow(x, 2)));
  // });

  //$("#out").text(converge(a, b, 0, 5));
});

var converge = function(a, b, start, end) {
  if(end <= start) throw Exception("End must be after start");

  var D = function(x) { return a(x) - b(x); };
  var prevD = D(start);
  var out = true;
  for(var i = ++start; i <= end; i++) {
    var d = D(i);
    if(d > prevD) {
      out = false;
      break;
    }
    prevD = d;
  };

  return out;
};

