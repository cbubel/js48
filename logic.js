var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var offset = 50;

var Board = function(game_type, size) {
  this.game_type = game_type;
  this.size = size;
  this.base_pieces = [2, 4];
  this.pieces = [];

  for(var i = 0; i < this.size; i++) {
    this.pieces[i] = []
    for(var j = 0; j < this.size; j++) {
      this.pieces[i][j] = 0;
    }
  }

  this.draw = function() {
    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        this.drawPiece(row, col);
      }
    }
    return;
  }

  this.drawPiece = function(row, col) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(this.pieces[row][col], offset * col + offset, offset * row + offset);
    return;
  }

  // Combines pieces along rows
  this.combineRightHorizontal = function() {
    var piece = undefined;

    for(var row = 0; row < this.size; row++) {
      piece = undefined;
      for(var col = this.size - 1; col >= 0; col--) {
        if(this.pieces[row][col] !== 0) {
          if(piece === undefined) {
            piece = {row: row, col: col, val: this.pieces[row][col]};
          }
          else {
            if(this.pieces[row][col] == piece.val) {
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              piece = undefined;
            }
            else {
              piece = {row: row, col: col, val: this.pieces[row][col]};
            }
          }
        }
      }
    }
  }

  // Combines pieces along rows
  this.combineLeftHorizontal = function() {
    var piece = undefined;

    for(var row = 0; row < this.size; row++) {
      piece = undefined;
      for(var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] !== 0) {
          if(piece === undefined) {
            piece = {row: row, col: col, val: this.pieces[row][col]};
          }
          else {
            if(this.pieces[row][col] === piece.val) {
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              piece = undefined;
            }
            else {
              piece = {row: row, col: col, val: this.pieces[row][col]};
            }
          }
        }
      }
    }
  }

  // Combines pieces along columns
  this.combineUpVertical = function() {
    var piece = undefined;

    for(var col = 0; col < this.size; col++) {
      piece = undefined;
      for(var row = 0; row < this.size; row++) {
        if(this.pieces[row][col] !== 0) {
          if(piece === undefined) {
            piece = {row: row, col: col, val: this.pieces[row][col]};
          }
          else {
            if(this.pieces[row][col] === piece.val) {
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              piece = undefined;
            }
            else {
              piece = {row: row, col: col, val: this.pieces[row][col]};
            }
          }
        }
      }
    }
  }

  // Combines pieces along columns
  this.combineDownVertical = function() {
    var piece = undefined;

    for(var col = 0; col < this.size; col++) {
      piece = undefined;
      for(var row = this.size - 1; row >= 0; row--) {
        if(this.pieces[row][col] !== 0) {
          if(piece === undefined) {
            piece = {row: row, col: col, val: this.pieces[row][col]};
          }
          else {
            if(this.pieces[row][col] === piece.val) {
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              piece = undefined;
            }
            else {
              piece = {row: row, col: col, val: this.pieces[row][col]};
            }
          }
        }
      }
    }
  }

  // Shifts the board on a left keypress
  this.evalLeft = function() {
    for(var row = 0; row < this.size; row++) {
      for(var col = this.size - 1; col >= 0; col--) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          this.pieces[row].push(0);
        }
      }
    }
    return;
  }

  // Shifts the board on a right keypress
  this.evalRight = function() {
    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          this.pieces[row].unshift(0);
        }
      }
    }
    return;
  }

  // Shifts the board on an up keypress
  this.evalUp = function() {
    var removed = [];

    for(var col = 0; col < this.size; col++) {
      removed = [];
      for(var row = 0; row < this.size; row++) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
        }
        else {
          removed.push(this.pieces[row].splice(col, 1)[0]);
        }
      }
      for(var i = 0; i < this.size; i++) {
        if(removed.length > 0) {
          this.pieces[i].splice(col, 0, removed.shift());
        }
        else {
          this.pieces[i].splice(col, 0, 0);
        }
      }
    }
    return;
  }

  // Shifts the board on a down keypress
  this.evalDown = function() {
    var removed = [];

    for(var col = 0; col < this.size; col++) {
      removed = [];
      for(var row = this.size - 1; row >= 0; row--) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
        }
        else {
          removed.push(this.pieces[row].splice(col, 1)[0]);
        }
      }
      for(var i = this.size - 1; i >= 0; i--) {
        if(removed.length > 0) {
          this.pieces[i].splice(col, 0, removed.shift());
        }
        else {
          this.pieces[i].splice(col, 0, 0);
        }
      }
    }
    return;
  }

  // Creates a new piece on the board at random
  // Initial thought is this should be called
  // immediately before move takes place
  this.addPiece = function() {
    var possible_pos = [];

    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] === 0) {
          possible_pos.push({row: row, col: col});
        }
      }
    }

    // Choose an open space at random
    var random_idx = Math.floor(Math.random() * possible_pos.length);

    // Choose one of the base pieces at random to be placed
    var random_base_piece = this.base_pieces[Math.floor(Math.random() * this.base_pieces.length)];

    // Pull the object for convenience
    var new_idx = possible_pos[random_idx];

    // Assign the new piece
    this.pieces[new_idx.row][new_idx.col] = random_base_piece;
  }

  this.move = function(e) {
    var dir = e.keyCode;

    // Left
    if(dir === 37) {
      this.combineLeftHorizontal();
      this.evalLeft();
    }
    // Up
    else if(dir === 38) {
      this.combineUpVertical();
      this.evalUp();
    }
    // Right
    else if(dir === 39) {
      this.combineRightHorizontal();
      this.evalRight();
    }
    // Down
    else if(dir === 40) {
      this.combineDownVertical();
      this.evalDown();
    }

    if(dir >= 37 && dir <= 40) {
      this.addPiece();
    }
    return;
  }.bind(this)

  // Initialize with one random piece
  this.addPiece();
}

var drawBG = function() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "forestgreen";
  ctx.fill();
  ctx.closePath();
  return;
}

var draw = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBG();
  board.draw();

  return;
  // requestAnimationFrame(draw);
}


var board = new Board(2048, 4);

document.addEventListener("keyup", board.move, false);

setInterval(draw, 10);
