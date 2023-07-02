"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_engine_1 = require("./chess_engine");
var objects = {
    "white": ["♖", "♘", "♗", "♕", "♗", "♘", "♖", "♙"],
    "black": ["♟", "♜", "♞", "♝", "♛", "♝", "♞", "♜"],
    "empty": []
}; // without king
function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function random_pieces(one_color) {
    if (one_color === void 0) { one_color = false; }
    var random_pieces = [];
    var num = getRandomNumberInRange(7, 10);
    var col = chess_engine_1.colors[getRandomNumberInRange(0, 1)]; // we dont want empty pieces
    for (var i_1 = 0; i_1 < num; i_1++) {
        if (one_color) {
            var random_piece = new chess_engine_1.Piece(objects[col][getRandomNumberInRange(0, 7)], col, [0, 0]);
        }
        else {
            var new_col = chess_engine_1.colors[getRandomNumberInRange(0, 1)];
            var random_piece = new chess_engine_1.Piece(objects[new_col][getRandomNumberInRange(0, 7)], col, [0, 0]);
        }
        random_pieces.push(random_piece);
    }
    return random_pieces;
}
//generate random board
function random_board(game, one_col) {
    if (one_col === void 0) { one_col = false; }
    var pieces = random_pieces(one_col);
    game.Game_board.set_empty();
    var kingPositions = randomPositions(2);
    game.Game_board.board[kingPositions[0][0]][kingPositions[0][1]] = new chess_engine_1.Piece("♚", "white", kingPositions[0]);
    game.Game_board.board[kingPositions[1][0]][kingPositions[1][1]] = new chess_engine_1.Piece("♔", "black", kingPositions[1]);
    var piecePositions = randomPositions(pieces.length);
    console.log(piecePositions);
    for (var i_2 = 0; i_2 < pieces.length; i_2++) {
        var _a = piecePositions[i_2], row = _a[0], col = _a[1];
        game.Game_board.board[row][col] = pieces[i_2];
    }
}
function randomPositions(count) {
    var positions = [];
    var remainingCount = count;
    var _loop_1 = function () {
        var row = getRandomNumberInRange(0, 7);
        var col = getRandomNumberInRange(0, 7);
        var position = [row, col];
        // Ensure the position is not already occupied
        if (!positions.some(function (_a) {
            var r = _a[0], c = _a[1];
            return r === row && c === col;
        })) {
            positions.push(position);
            remainingCount -= 1;
        }
    };
    while (remainingCount > 0) {
        _loop_1();
    }
    return positions;
}
var i = 5;
var game = new chess_engine_1.chess_game();
while (i > 0) {
    console.log("new game------------\n");
    game.Game_board.set_empty();
    //generate random color
    random_board(game, true);
    var isCheckmate = game.checkmate("white");
    console.log("checking checkmate (".concat("white", "): result: ").concat(isCheckmate, " on this board state: ").concat(game.Game_board.print(), "\n"));
    var isCheckmate2 = game.checkmate("black");
    console.log("checking checkmate (".concat("black", "): result: ").concat(isCheckmate2, " on this board state: ").concat(game.Game_board.print()));
    i--;
}
