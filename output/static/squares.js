;(function (win, doc, Math) {
  var getRandomColor = function () {
      return 'rgba('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.random().toFixed(1) +')';
  };

  var renderSquare = function (ctx, cols, x, y) {
      ctx.fillStyle = getRandomColor();
      ctx.fillRect(0, 0, cols, cols);
  };

  var Squares = function (board, options) {
      const defaultOptions = {
          width: doc.body.offsetWidth,
          height: doc.body.offsetHeight,

          colWidth: 20,

          grid: {
              color: '#f7f7f7',
              width: 1
          },

          shapeFn: renderSquare
      }

      this.board = board
      this.options = {...defaultOptions, ...options}

      this.setup()

      if(this.options.grid)
        this.renderGrid();
  };

  Squares.prototype = {
      setup: function () {
        var options = this.options;

        this.ctx = this.board.getContext('2d');

        this.updateDimensions();
      },

      updateDimensions: function () {
        var options = this.options;

        this.board.width = options.width;
        this.board.height = options.height;
      },

      renderGrid: function () {
        var options = this.options,
            ctx = this.ctx,
            width = options.width,
            height = options.height,
            cols = options.colWidth;

        ctx.save();
          ctx.translate(0,0);

          ctx.beginPath();

          var x, y;

          for (x = .5; x <= width; x += cols) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
          }

          for (y = .5; y <= height; y += cols) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
          }

          ctx.closePath();

          ctx.strokeStyle = options.grid.color;
          ctx.strokeWidth = options.grid.width;
          ctx.stroke();

        ctx.restore();
      },

      renderShape: function (x, y) {
        var cols = this.options.colWidth;

        x = x * cols;
        y = y * cols;

        this.ctx.save();
          this.ctx.translate(x, y);
          this.options.shapeFn(this.ctx, cols, x, y)
        this.ctx.restore();
      },

      tick: function () {
        var cols = this.options.colWidth,
            randomX = Math.floor((Math.random()*this.options.width)/cols),
            randomY = Math.floor((Math.random()*this.options.height)/cols);

        this.renderShape(randomX, randomY);

        requestAnimationFrame(this.tick.bind(this));
      }
  };

  win.Squares = Squares;
}(window, document, Math));

for (let elem of document.querySelectorAll('.animated-color-grid')) {
  const sqrs = new Squares(elem, {height: elem.height})
  sqrs.tick()

  window.addEventListener('resize', function(e) {
      sqrs.options.width = document.body.offsetWidth
      sqrs.updateDimensions()
  })
}
