var container = document.getElementById("container");

var width = 490;
var height = 490;
var border_size = 10;

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var block_colors = {2: "#efe3dc", 4: "#eddfcb", 8: "#f1b07d", 16: "#f3946b", 32: "#f47b66", 64: "#f55e44", 128: "#eccc7b", 256: "#eccb6b", 512: "#ecc65a", 1024: "#eec540", 2048: "#efc12f"};

var Board = function(game_type, size) {
  this.game_type = game_type;
  this.size = size;
  this.base_pieces = [2, 4];
  this.pieces = [];
  this.block_size = (width - ((this.size + 1) * border_size)) / this.size;
  this.game_score = 0;
  this.isWorking = false;
  var made_move = false;
  var game_over = false;
  var id = undefined;

  for(var i = 0; i < this.size; i++) {
    this.pieces[i] = []
    for(var j = 0; j < this.size; j++) {
      this.pieces[i][j] = 0;
    }
  }

  this.removeDiv = function(row, col) {
    var piece = document.getElementById("p" + row + "_" + col);
    piece.remove();
  }

  this.upgradeDiv = function(row, col, val) {
    var piece = document.getElementById("p" + row + "_" + col);
    piece.innerHTML = val;
    piece.style.backgroundColor = block_colors[val];
    if(val <= 4) {
      piece.style.color = "#746d62";
    }
    else {
      piece.style.color = "#FFFFFF";
    }
  }

  this.moveDivHorizontal = function(row, to_col, from_col, val, isMove) {
    var old_piece = document.getElementById("p" + row + "_" + from_col);
    var initial_x = from_col * (this.block_size + border_size);
    var end_x = to_col * (this.block_size + border_size);
    var dx;

    if (initial_x <= end_x) {
      dx = 10;
    } else {
      dx = -10;
    }

    function move(callback) {
      initial_x += dx;

      old_piece.style.left = initial_x + "px";

      if (dx > 0) {
        if (initial_x >= end_x) {
          clearInterval(id);
          callback();
        }
      }
      else {
        if (initial_x <= end_x) {
          clearInterval(id);
          callback();
        }
      }
    }

    var move_bundle = function() {
      move(function() {
        old_piece.remove();

        if(isMove) {
          this.createNewDiv(row, to_col, val, true);
        }
        else {
          this.upgradeDiv(row, to_col, val);
        }
      }.bind(this));
    }

    var id = setInterval(move_bundle.bind(this), 5);
  }

  this.moveDivVertical = function(col, to_row, from_row, val, isMove) {
    var old_piece = document.getElementById("p" + from_row + "_" + col);
    var initial_y = from_row * (this.block_size + border_size);
    var end_y = to_row * (this.block_size + border_size);
    var dy;

    if (initial_y <= end_y) {
      dy = 10;
    } else {
      dy = -10;
    }

    function move(callback) {
      initial_y += dy;

      old_piece.style.top = initial_y + "px";

      if(dy > 0) {
        if (initial_y >= end_y) {
          clearInterval(id);
          callback();
        }
      }
      else {
        if (initial_y <= end_y) {
          clearInterval(id);
          callback();
        }
      }
    }

    var move_bundle = function() {
      move(function() {
        old_piece.remove();

        if(isMove) {
          this.createNewDiv(to_row, col, val, true);
        }
        else {
          this.upgradeDiv(to_row, col, val);
        }
      }.bind(this));
    }

    var id = setInterval(move_bundle.bind(this), 5);
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
              this.game_score += piece.val * 2;
              document.getElementById("score").innerHTML = this.game_score;
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              this.moveDivHorizontal(row, piece.col, col, piece.val * 2, false);
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
              this.game_score += piece.val * 2;
              document.getElementById("score").innerHTML = this.game_score;
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              this.moveDivHorizontal(row, piece.col, col, piece.val * 2, false);
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
              this.game_score += piece.val * 2;
              document.getElementById("score").innerHTML = this.game_score;
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              this.moveDivVertical(col, piece.row, row, piece.val * 2, false);
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
              this.game_score += piece.val * 2;
              document.getElementById("score").innerHTML = this.game_score;
              this.pieces[piece.row][piece.col] = piece.val * 2;
              this.pieces[row][col] = 0;
              this.moveDivVertical(col, piece.row, row, piece.val * 2, false);
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
    var spaces = [];

    for (var row = 0; row < this.size; row++) {
      for (var col = 0; col < this.size; col++) {
        if(this.pieces[row][col] === 0) {
          spaces.push(col);
        }
        else {
          if(spaces.length > 0) {
            var moving_to = spaces.shift();
            var val = this.pieces[row][col];
            this.pieces[row][moving_to] = val;
            this.pieces[row][col] = 0;
            spaces.push(col);

            made_move = true;

            this.moveDivHorizontal(row, moving_to, col, val, true);
          }
        }
      }
      spaces = [];
    }
  }

  // Shifts the board on a right keypress
  this.evalRight = function() {
    var spaces = [];

    for(var row = 0; row < this.size; row++) {
      for(var col = this.size - 1; col >= 0; col--) {
        if(this.pieces[row][col] === 0) {
          spaces.push(col);
        }
        else {
          if(spaces.length > 0) {
            var moving_to = spaces.shift();
            var val = this.pieces[row][col];
            this.pieces[row][moving_to] = val;
            this.pieces[row][col] = 0;
            spaces.push(col);

            made_move = true;

            this.moveDivHorizontal(row, moving_to, col, val, true);

          }
        }
      }
      spaces = [];
    }
  }

  // Shifts the board on an up keypress
  this.evalUp = function() {
    var spaces = [];

    for(var col = 0; col < this.size; col++) {
      for(var row = 0; row < this.size; row++) {
        if(this.pieces[row][col] === 0) {
          spaces.push(row);
        }
        else {
          if(spaces.length > 0) {
            var moving_to = spaces.shift();
            var val = this.pieces[row][col];
            this.pieces[moving_to][col] = val;
            this.pieces[row][col] = 0;
            spaces.push(row);

            made_move = true;

            this.moveDivVertical(col, moving_to, row, val, true);
          }
        }
      }
      spaces = [];
    }
  }

  // Shifts the board on a down keypress
  this.evalDown = function() {
    var spaces = [];

    for(var col = 0; col < this.size; col++) {
      for(var row = this.size - 1; row >= 0; row--) {
        if(this.pieces[row][col] === 0) {
          spaces.push(row);
        }
        else {
          if(spaces.length > 0) {
            var moving_to = spaces.shift();
            var val = this.pieces[row][col];
            this.pieces[moving_to][col] = val;
            this.pieces[row][col] = 0;
            spaces.push(row);

            made_move = true;

            this.moveDivVertical(col, moving_to, row, val, true);
          }
        }
      }
      spaces = [];
    }
  }

  this.createNewDiv = function(row, col, val, isMove) {
    var div = document.createElement('div');

    div.id = "p" + row + "_" + col;
    if(isMove) div.className = "piece";
    else div.className = "piece new-piece";
    div.style.left = col * (this.block_size + border_size) + "px";
    div.style.top = row * (this.block_size + border_size) + "px";
    div.style.backgroundColor = block_colors[val];
    if(val <= 4) {
      div.style.color = "#746d62";
    }
    else {
      div.style.color = "#FFFFFF";
    }
    div.innerHTML = val;
    container.appendChild(div);
  }

  // Creates a new piece on the board at random
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
    this.createNewDiv(new_idx.row, new_idx.col, random_base_piece, false);

    if(possible_pos.length === 1){
      this.check_full();
    }
  }

  this.check_full = function() {
    game_over = true;
    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if(row < this.size-1){
          if(this.pieces[row][col] == this.pieces[row+1][col])
            game_over = false;
        }
        if(row > 0){
          if(this.pieces[row][col] == this.pieces[row-1][col])
            game_over = false;
        }
        if(col < this.size-1){
          if(this.pieces[row][col] == this.pieces[row][col+1])
            game_over = false;
        }
        if(col > 0){
          if(this.pieces[row][col] == this.pieces[row][col-1])
            game_over = false;
        }
      }
    }
    if(game_over){
      document.getElementById("over").innerHTML ="GAME OVER";
      this.endGame();
    }
  }

  this.endGame = function() {

    var div = document.createElement('div');

    div.id = "gameOver";

    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = windowWidth+"px";
    div.style.height = windowHeight+"px";
    div.style.position = "absolute";
    div.style.background = "darkgray";
    div.style.opacity=".7";
    div.style.textAlign="center";
    div.style.verticalAlign="middle";
    div.style.fontSize="100px";
    div.style.zIndex= "1000";


    document.body.appendChild(div);

    var div2 = document.createElement('div');
    div2.id="overText";
    div2.style.textAlign="center";
    div2.style.verticalAlign="middle";
    div2.style.fontSize="100px";
    div2.style.zIndex= "1000";
    div2.innerHTML = "GAME OVER";

    var div3 = document.createElement('div');
    div3.id="scoreText";
    div3.style.textAlign="center";
    div3.style.verticalAlign="middle";
    div3.style.fontSize="100px";
    div3.style.zIndex= "1000";
    div3.innerHTML = "Your Score: "+this.game_score;

    var retry = document.createElement('button');
    retry.id="retry";
    retry.style.textAlign="center";
    retry.style.verticalAlign="middle";
    retry.style.fontSize="80px";
    retry.style.zIndex= "1000";
    retry.innerHTML = "Retry?";



    document.getElementById("gameOver").appendChild(div2);
    document.getElementById("gameOver").appendChild(div3);
    document.getElementById("gameOver").appendChild(retry);

    retry.addEventListener("click", function(){
      board.clean();
      // document.body.removeChild(container);
      board = new Board(2048,4);
      document.getElementById("gameOver").remove();
      document.addEventListener("keyup", board.move, false);
      // document.body.appendChild(container);
      //div.removeChild(div2);
      //div2.remove();
    });
  }

  this.clean = function() {
    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        if (this.pieces[row][col] !== 0) {
          var rePiece = document.getElementById("p" + row + "_" + col);
          container.removeChild(rePiece);
        }
        this.pieces[row][col] = 0;
      }
    }
  }

  this.move = function(e) {
    var dir = e.keyCode;
    document.removeEventListener("keyup", board.move, false);

    var handleMove = function() {
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
      document.addEventListener("keyup", board.move, false);
    }

    setTimeout(handleMove.bind(this), 200);

  }.bind(this)

  // Initialize with two random pieces
  this.addPiece();
  this.addPiece();
}

var board = new Board(2048, 4);


document.addEventListener("keyup", board.move, false);
