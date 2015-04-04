var merge = function(a, b) {
    for (var prop in b)
        a[prop] = b[prop];
    return a;
};

var Grapher = function(options) {
    var exports = {};

    var config = merge({
        font: "12px sans-serif",
        lineWidth: 1,
        basePPU: 15,
        height: 500,
        width: 1000,
        zoom: 1
    }, options);

    var ctx = config.canvas.getContext("2d");

    var drawLine = function(from, to) {        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.closePath();
    };
    var makePoint = function(x, y) { return { x: x, y: y }; };

    //configure coord system
    var ppu = config.basePPU * config.zoom;

    var x_axis = config.width/2;
    var y_axis = config.height/2;

    var origin = { x: x_axis, y: y_axis };
    var x_offset = x_axis + 0.5; // location on canvas
    var y_offset = y_axis + 0.5; // of graph's origin

    var ppu = ppu * config.zoom;
    var pixelVal = 1/ppu;

    var y_max = Math.floor(y_axis/ppu);
    var x_max = Math.floor(x_axis/ppu);

    var convertFrom = {
        coord: {
            x: function(x) {
                return x*ppu + origin.x;
            },
            y: function(y) {
                return origin.y - y*ppu;
            },
            point: function(point) {
                return makePoint(convertFrom.coord.x(point.x), convertFrom.coord.y(point.y));
            }
        },
        pos: {
            i: function(i) {
                return (i - x_axis)/ppu;
            },
            j: function(j) {
                return (j - y_axis)/ppu;
            },
            pixel: function(pixel) {
                return makePoint(convertFrom.pos.i(pixel.x), convertFrom.pos.j(pixel.y));
            }
        }
    };

    var drawAxes = function() {
        ctx.clearRect(0, 0, config.width, config.height);

        ctx.lineWidth = 1;

        // draw x-axis
        drawLine(makePoint(0, y_offset), makePoint(x_axis*2, y_offset));

        // draw x values
        j = -x_max;
        while (j <= x_max) {
            x = j * ppu;

            ctx.strokeStyle = '#aaa';
            drawLine(makePoint(x + x_offset, y_offset), makePoint(x + x_offset, y_offset + 10));

            ctx.strokeStyle = '#666';
            ctx.strokeText(j, x + x_offset - 5, y_offset + 30);

            j++;
            if (j === 0) { j++; }
        }

        // draw y-axis
        drawLine(makePoint(x_offset, 0), makePoint(x_offset, y_axis*2));

        // draw y values
        j = -y_max;
        while (j <= y_max) {
            y = j * ppu;
            ctx.strokeStyle = '#aaa';
            drawLine(makePoint(x_offset, y + y_offset), makePoint(x_offset - 10, y + y_offset));

            ctx.strokeStyle = '#666';
            ctx.strokeText(-j, x_offset - 25, y + y_offset + 5);

            j++;
            if (j === 0) { j++; }
        }
    };

    exports.init = function() {
        //configure canvas
        config.canvas.height = config.height;
        config.canvas.width = config.width;

        ctx.font = config.font;
        ctx.lineWidth = config.lineWidth;

        drawAxes();
    };

    exports.reset = function() {
        drawAxes();
    };

    exports.plot = function(f) {
        var calcJ = function(i) {
            var x = convertFrom.pos.i(i);
            var y = f(x);
            return convertFrom.coord.y(y);
        };
        var prev = calcJ(0);

        ctx.beginPath();
        ctx.moveTo(0, prev);

        for(var i = 1; i < config.width; i++){
            var j = calcJ(i);
            ctx.lineTo(i, j);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
    };

    return exports;
};
