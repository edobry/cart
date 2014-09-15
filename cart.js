$(function() {
  var side = 300;

  var x_axis = side/2;
  var y_axis = side/2;

  var x_max = 5;
  var y_max = 5;

  var ppu = (side/2)/x_max;
  var pixelVal = 1/ppu;

  var origin = { x: x_axis, y: y_axis };

  var xToI = function(x) {
    return x*ppu + origin.x;
  };
  var yToJ = function(y) {
    return y*ppu + origin.y;
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

  var canvas = $("canvas").css({ height: side, width: side});

  var ctx = window.ctx = $("canvas")[0].getContext("2d");
  var out = $("#out");

  var l = function(from, to) {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };
  var p = function(x, y) { return { x: x, y: y }; };


  var x_scale = x_axis / (x_max);
  var y_scale = y_axis / (y_max);

  var x_offset = x_axis + 0.5; // location on canvas
  var y_offset = y_axis + 0.5; // of graph's origin

  var drawAxes = function() {

    ctx.font = "12px sans-serif";
    ctx.lineWidth = 1;

    // draw x-axis
    ctx.beginPath();
    ctx.moveTo(0, y_offset);
    ctx.lineTo(x_axis*2, y_offset);
    ctx.stroke();
    ctx.closePath();

    // draw x values
    j = -x_max;
    while (j <= x_max) {
      x = j * x_scale;
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
      y = j * y_scale;
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
  };
  drawAxes();


  var plot = function(f) {
    var px;
    for(var i = 0; i < side; i++){
      var x = iToX(i);
      var y = f(x);
      ctx.fillRect(i, yToJ(y), 1, 1);
    }
    console.log(px);
  };

  plot(Math.sin);
});
