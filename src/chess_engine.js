"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chess_game = exports.Game_board = exports.Piece = exports.colors = void 0;
exports.colors = ["white", "black"];
var Piece = /** @class */ (function () {
    function Piece(type, col, pos) {
        this.position = pos;
        this.type = type;
        this.color = col;
        this.depict = type;
    }
    Piece.prototype.to_string = function () {
        return this.depict;
    };
    return Piece;
}());
exports.Piece = Piece;
var Game_board = /** @class */ (function () {
    function Game_board() {
        this.board = [];
        this.set_starting_position();
    }
    Game_board.prototype.set_empty = function () {
        this.board = Array(8).fill(null).map(function () { return Array(8).fill("E"); });
    };
    Game_board.prototype.get_free_positions = function () {
        var free_positions = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.board[i][j].depict == "E") {
                    free_positions.push([i, j]);
                }
            }
        }
        return free_positions;
    };
    Game_board.prototype.set_starting_position = function () {
        for (var i = 0; i < 8; i++) {
            this.board[i] = []; // Initialize the row
            for (var j = 0; j < 8; j++) {
                if (i === 1) {
                    this.board[i][j] = new Piece("♙", "black", [i, j]); // Black pawns
                }
                else if (i === 6) {
                    this.board[i][j] = new Piece("♟", "white", [i, j]); // White pawns
                }
                else if (i === 0 || i === 7) {
                    if (j === 0 || j === 7) {
                        this.board[i][j] = new Piece(i === 0 ? "♜" : "♖", i === 0 ? "black" : "white", [i, j]); // Rooks
                    }
                    else if (j === 1 || j === 6) {
                        this.board[i][j] = new Piece(i === 0 ? "♞" : "♘", i === 0 ? "black" : "white", [i, j]); // Knights
                    }
                    else if (j === 2 || j === 5) {
                        this.board[i][j] = new Piece(i === 0 ? "♝" : "♗", i === 0 ? "black" : "white", [i, j]); // Bishops
                    }
                    else if (j === 3) {
                        this.board[i][j] = new Piece(i === 0 ? "♛" : "♕", i === 0 ? "black" : "white", [i, j]); // Queens
                    }
                    else if (j === 4) {
                        this.board[i][j] = new Piece(i === 0 ? "♚" : "♔", i === 0 ? "black" : "white", [i, j]); // Kings
                    }
                }
                else {
                    this.board[i][j] = new Piece("E", "white", [i, j]); // Empty square
                }
            }
        }
    };
    Game_board.prototype.getPiecesByColor = function (color) {
        var pieces = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.board[i][j].color == color) {
                    pieces.push(this.board[i][j]);
                }
            }
        }
        return pieces;
    };
    Game_board.prototype.isValidPosition = function (position) {
        return position[0] >= 0 && position[0] < 8 && position[1] >= 0 && position[1] < 8;
    };
    Game_board.prototype.print = function () {
        for (var i = 0; i < 8; i++) {
            console.log(this.board[i].join(" ") + " " + String(i));
        }
        console.log("0 1 2 3 4 5 6 7");
    };
    Game_board.prototype.get_all_board_pieces = function () {
        var pieces = []; //pieces as string
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var piece = this.board[i][j];
                if (piece.depict != "E") {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    };
    Game_board.prototype.get_possible_moves = function (piece) {
        // console.log("piece", piece, "position", position);
        var _this = this;
        var possible_moves = [];
        var calculateMove = function (direction, pawn) {
            var dx = direction[0], dy = direction[1];
            var x = piece.position[0] + dx, y = piece.position[1] + dy;
            if (!_this.isValidPosition([x, y])) {
                //console.log("not valid position", [x, y])
                return false;
            }
            if (_this.getPiecesByColor(piece.color).includes(_this.board[x][y])) {
                //console.log("piece of same color, returning false", [x, y])
                return false;
            }
            if (_this.board[x][y].depict == "E") {
                if (pawn) {
                    if (dy != 0) {
                        return false;
                    }
                }
                possible_moves.push([x, y]);
                return true;
            }
            else {
                // take piece if it is of the other color
                if (!_this.getPiecesByColor(piece.color).includes(_this.board[x][y])) {
                    //console.log("adding position can claim enemy piece", [x, y])
                    possible_moves.push([x, y]);
                    //console.log("take piece", [x, y]);
                    return false;
                }
                else {
                    // if the piece is of the same color, don't add the move and return false
                    return false;
                }
            }
        };
        if (piece.type == "pawn") {
            if (piece.color == "white") {
                var directions = [[-1, 0], [-1, -1], [-1, 1]];
            }
            else {
                var directions = [[1, 0], [1, -1], [1, 1]]; //black
            }
            // Forward, forward left diagonal, forward right diagonal.
            for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                var direction = directions_1[_i];
                calculateMove(direction, true);
            }
            // Handle 2 steps forward for the pawn's first move
            //to step forward
            if (piece.position[0] === 1 && this.board[piece.position[0] + 2][piece.position[1]].depict === "E") {
                possible_moves.push([piece.position[0] + 2, piece.position[1]]);
            }
            return possible_moves;
        }
        if (piece.type == "rook") {
            var directions_7 = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Up, down, right, left
            var _loop_1 = function (direction) {
                var steps = 1;
                while (calculateMove(direction.map(function (num) { return num * steps; }))) {
                    steps++;
                }
            };
            for (var _a = 0, directions_2 = directions_7; _a < directions_2.length; _a++) {
                var direction = directions_2[_a];
                _loop_1(direction);
            }
            return possible_moves;
        }
        if (piece.type == "knight") {
            var directions_8 = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]; // L shape
            for (var _b = 0, directions_3 = directions_8; _b < directions_3.length; _b++) {
                var direction = directions_3[_b];
                calculateMove(direction);
            }
            return possible_moves;
        }
        if (piece.type == "bishop") {
            var directions_9 = [[1, 1], [-1, 1], [1, -1], [-1, -1]]; // Diagonals
            var _loop_2 = function (direction) {
                var steps = 1;
                while (calculateMove(direction.map(function (num) { return num * steps; }))) {
                    steps++;
                }
            };
            for (var _c = 0, directions_4 = directions_9; _c < directions_4.length; _c++) {
                var direction = directions_4[_c];
                _loop_2(direction);
            }
            return possible_moves;
        }
        if (piece.type == "queen") {
            var directions_10 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]; // Up, down, right, left, diagonals
            var _loop_3 = function (direction) {
                var steps = 1;
                while (calculateMove(direction.map(function (num) { return num * steps; }))) {
                    steps++;
                }
            };
            for (var _d = 0, directions_5 = directions_10; _d < directions_5.length; _d++) {
                var direction = directions_5[_d];
                _loop_3(direction);
            }
            return possible_moves;
        }
        if (piece.type == "king") {
            var directions_11 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]; // Up, down, right, left, diagonals
            for (var _e = 0, directions_6 = directions_11; _e < directions_6.length; _e++) {
                var direction = directions_6[_e];
                calculateMove(direction);
            }
            return possible_moves;
        }
        else {
            return [];
        }
    };
    Game_board.prototype.find_all = function (piece) {
        //console.log("finding piece", piece);
        var positions = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.board[i][j].depict == piece.depict) { //cannot compare pieces directly
                    positions.push([i, j]);
                }
            }
        }
        if (positions.length == 0) {
            return [[]];
        }
        return positions;
    };
    Game_board.prototype.move = function (piece, target_position) {
        var x = target_position[0], y = target_position[1];
        var _a = piece.position, old_x = _a[0], old_y = _a[1];
        this.board[x][y] = piece;
        this.board[old_x][old_y] = new Piece("E", "empty", [old_x, old_y]);
    };
    Game_board.prototype.all_moves = function (color) {
        var _this = this;
        var pieces_by_color = this.getPiecesByColor(color);
        var potential_moves = [];
        pieces_by_color.forEach(function (piece) {
            var possible_moves = _this.get_possible_moves(piece);
            potential_moves.push.apply(potential_moves, possible_moves);
        });
        return potential_moves;
    };
    return Game_board;
}());
exports.Game_board = Game_board;
var chess_game = /** @class */ (function () {
    function chess_game() {
        this.active_piece = null;
        this.Game_board = new Game_board();
        this.simulation_board = new Game_board();
    }
    chess_game.prototype.check_threat = function (color, sim) {
        if (sim === void 0) { sim = false; }
        if (sim) {
            console.log("simulating");
            var Board = this.simulation_board;
        }
        else {
            var Board = this.Game_board;
        }
        var enemy_col = color === "white" ? "black" : "white";
        var enemy_moves = Board.all_moves(enemy_col);
        var pieces = Board.getPiecesByColor(color); // get pieces
        var king_position = pieces.filter(function (p) { return p.type === "king" && p.color === color; })[0].position; // ok, you can never have more than one king
        for (var _i = 0, enemy_moves_1 = enemy_moves; _i < enemy_moves_1.length; _i++) {
            var move = enemy_moves_1[_i];
            if (move[0] === king_position[0] && move[1] === king_position[1]) {
                return true;
            }
        }
        return false;
    };
    chess_game.prototype.checkmate = function (color) {
        this.simulation_board.board = JSON.parse(JSON.stringify(this.Game_board.board)); //deep copy to avoid object referencing issues
        //console.log("board before")
        //this.Game_board.print();
        if (this.check_threat(color)) {
            console.log("threatened");
            var pieces = this.Game_board.getPiecesByColor(color);
            var isCheckmate = true;
            for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
                var piece = pieces_1[_i];
                var moves = this.Game_board.get_possible_moves(piece);
                for (var _a = 0, moves_1 = moves; _a < moves_1.length; _a++) {
                    var move = moves_1[_a];
                    // copy the real board to the simulation board
                    this.simulation_board.board = JSON.parse(JSON.stringify(this.Game_board.board));
                    // make the move on the simulation board
                    this.simulation_board.move(piece, move);
                    if (!this.check_threat(color, true)) {
                        // if not, then it's not checkmate
                        isCheckmate = false;
                        break;
                    }
                    if (!isCheckmate)
                        break;
                }
                if (!isCheckmate)
                    break;
            }
            return isCheckmate;
        }
        return false;
    };
    return chess_game;
}());
exports.chess_game = chess_game;
//TODOS:
// fix tests_chess.ts, interface.ts
//fix checkmate
// make tests
// fix inheritance
//en passant, castling, promotion when pawn reaches end of board
