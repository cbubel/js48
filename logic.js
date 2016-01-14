var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var width = canvas.width;
var height = canvas.height;
var border_size = 10;
var block_colors = {2: "#efe3dc", 4: "#eddfcb", 8: "#f1b07d", 16: "#f3946b", 32: "#f47b66", 64: "#f55e44", 128: "#eccc7b", 256: "#eccb6b", 512: "#ecc65a", 1024: "#eec540", 2048: "#efc12f"};

var Board = function(game_type, size) {
  this.game_type = game_type;
  this.size = size;
  this.base_pieces = [2, 4];
  this.pieces = [];
  this.block_size = (width - ((this.size + 1) * border_size)) / this.size;
  var made_move = false;

  for(var i = 0; i < this.size; i++) {
    this.pieces[i] = []
    for(var j = 0; j < this.size; j++) {
      this.pieces[i][j] = 0;
    }
  }

  this.draw = function() {
    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] !== 0) {
          this.drawPiece(row, col);
        }
      }
    }
    return;
  }

  this.drawPiece = function(row, col) {
    ctx.beginPath();
    ctx.rect(col * (this.block_size + border_size) + border_size, row * (this.block_size + border_size) + border_size, this.block_size, this.block_size);
    ctx.fillStyle = block_colors[this.pieces[row][col]];
    ctx.fill();
    ctx.closePath();

    ctx.font = "bold 36px Arial";
    if(this.pieces[row][col] <= 4) {
      ctx.fillStyle = "#746d62";
    }
    else {
      ctx.fillStyle = "#FFFFFF";
    }
    var text = this.pieces[row][col];
    var text_width = ctx.measureText(text).width;

    var h_mid = col * (this.block_size + border_size) + border_size + (this.block_size - text_width) / 2;
    // TODO: Figure out relationship to avoid random -26
    var v_mid = (row + 1) * (this.block_size + border_size) - (this.block_size - 26) / 2;
    ctx.fillText(text, h_mid, v_mid);
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
            if(this.pieces[row][col] === piece.val) {
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              piece = undefined;
              made_move = true;
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
              made_move = true;
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
              made_move = true;
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
              made_move = true;
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
    var saw_piece = false;

    for(var row = 0; row < this.size; row++) {
      for(var col = this.size - 1; col >= 0; col--) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          this.pieces[row].push(0);
          if(saw_piece) made_move = true;
        }
        else {
          saw_piece = true;
        }
      }
      saw_piece = false;
    }
    return;
  }

  // Shifts the board on a right keypress
  this.evalRight = function() {
    var saw_piece = false;

    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          this.pieces[row].unshift(0);
          if(saw_piece) made_move = true;
        }
        else {
          saw_piece = true;
        }
      }
      saw_piece = false;
    }
    return;
  }

  // Shifts the board on an up keypress
  this.evalUp = function() {
    var removed = [];
    var saw_zero = false;

    for(var col = 0; col < this.size; col++) {
      removed = [];
      for(var row = 0; row < this.size; row++) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          saw_zero = true;
        }
        else {
          removed.push(this.pieces[row].splice(col, 1)[0]);
          if(saw_zero) made_move = true;
        }
      }
      saw_zero = false;
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
    var saw_zero = false;

    for(var col = 0; col < this.size; col++) {
      removed = [];
      for(var row = this.size - 1; row >= 0; row--) {
        if(this.pieces[row][col] === 0) {
          this.pieces[row].splice(col, 1);
          saw_zero = true;
        }
        else {
          removed.push(this.pieces[row].splice(col, 1)[0]);
          if(saw_zero) made_move = true;
        }
      }
      saw_zero = false;
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

    if(dir >= 37 && dir <= 40 && made_move) {
      this.addPiece();
    }
    made_move = false;

    return;
  }.bind(this)

  // Initialize with two random pieces
  this.addPiece();
  this.addPiece();
}

var drawBG = function() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#cec0b6";
  ctx.fill();
  ctx.closePath();
  return;
}

var drawDividers = function() {
  ctx.beginPath();
  var block_size = board.block_size;
  for (var i = 0; i <= board.size; i++) {
    if(i === board.size) {
      ctx.rect(0, height - border_size, width, border_size);
      ctx.rect(width - border_size, 0, border_size, height);
    }
    else {
      ctx.rect(0, i * (block_size + border_size), width, border_size);
      ctx.rect(i * (block_size + border_size), 0, border_size, height);
    }
  }

  ctx.fillStyle = "#bdaca1";
  ctx.fill();
  ctx.closePath();
}

var draw = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBG();
  drawDividers();
  board.draw();

  requestAnimationFrame(draw);
}


var board = new Board(2048, 4);

document.addEventListener("keyup", board.move, false);

// setInterval(draw, 10);
draw();
