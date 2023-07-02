"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chess_engine_1 = require("./chess_engine"); //remember to add .js to interface.js
// Create a new game board
var game = new chess_engine_1.chess_game();
game.Game_board.set_empty();
game.Game_board.place_piece('king', 'white', [0, 0]);
game.Game_board.place_piece('queen', 'black', [0, 1]);
game.Game_board.place_piece('queen', 'black', [1, 1]);
let active_col = 'white';
function init_state() {
    let chessboardDiv = document.getElementById('chess-board');
    if (chessboardDiv) {
        chessboardDiv.innerHTML = '';
        game.Game_board.board.forEach((row, i) => {
            row.forEach((cell, j) => {
                // Create a new div for the square
                const squareDiv = document.createElement('div');
                if (cell.depict != 'E') {
                    const piece = document.createTextNode(cell.depict);
                    squareDiv.appendChild(piece);
                }
                else {
                    const piece = document.createTextNode('');
                    squareDiv.appendChild(piece);
                }
                // Set the class for the square
                squareDiv.classList.add('square');
                if ((i + j) % 2 === 0) {
                    squareDiv.classList.add('white');
                }
                else {
                    squareDiv.classList.add('black');
                }
                // If there's a piece in this square, add a class for it
                if (cell.depict !== 'E') {
                    squareDiv.classList.add(cell.type);
                    //squareDiv.classList.add(piece_class.color);
                }
                // Set the data attributes for the row and column
                squareDiv.setAttribute('data-row', i.toString());
                squareDiv.setAttribute('data-col', j.toString());
                // Add the square to the chessboard
                if (chessboardDiv) { // check for null value
                    chessboardDiv.appendChild(squareDiv);
                }
            });
        });
    }
    check_for_checkmate(game, active_col);
    setUpSquareClickEvents();
}
function check_for_checkmate(game, active_col) {
    if (game.checkmate(active_col)) {
        console.log('checkmate');
        let messageDiv = document.getElementById('message');
        if (messageDiv) { // ensure that the messageDiv is not null
            let opposite_col = active_col === "white" ? "black" : "white";
            messageDiv.innerHTML = `<h2>Checkmate! ${opposite_col} wins!</h2>`;
            setTimeout(() => {
                if (messageDiv)
                    messageDiv.innerHTML = '';
            }, 1500);
            let countdown = 5;
            let countdownInterval = setInterval(() => {
                if (messageDiv) {
                    if (countdown > 0) {
                        messageDiv.innerHTML = `<h2>Game restarts in ${countdown} seconds</h2>`;
                        countdown--;
                    }
                    else {
                        messageDiv.innerHTML = '';
                        clearInterval(countdownInterval); // stop the interval
                        // reset the game and call init_state()
                        game.restart();
                        active_col = 'white';
                        init_state();
                    }
                }
            }, 1000);
        }
    }
    else {
        console.log('not checkmate');
    }
}
function setUpSquareClickEvents() {
    let squares = document.querySelectorAll('.square');
    if (squares) {
        squares.forEach(square => {
            square.addEventListener("click", (event) => {
                let [x, y] = get_coordinates(square);
                console.log(`coordinates, row: ${x}, col: ${y}`);
                if (game.Game_board.board[x][y].color !== active_col && game.active_piece === null) {
                    let message2 = document.getElementById('message2');
                    if (message2) {
                        message2.innerHTML = `<h2>It is not ${game.Game_board.board[x][y].color}'s turn</h2>`;
                        // Remove the message after 5 seconds (5000 milliseconds)
                        setTimeout(() => {
                            if (message2)
                                message2.innerHTML = '';
                        }, 1500);
                    }
                    return;
                }
                if (square.classList.contains('active')) {
                    console.log('remove square from active');
                    square.classList.remove('active');
                    // find square that is confirmed
                    const confirmed_square = document.querySelector('.confirm');
                    if (confirmed_square) {
                        confirmed_square.classList.remove('confirm');
                    }
                    remove_possible_moves(game);
                    console.log('removing from active piece');
                    setUpSquareClickEvents();
                }
                if (square.classList.contains('possible-move')) {
                    console.log('square is possible move');
                    square.classList.add('confirm');
                    square.classList.remove('possible-move');
                    return;
                }
                if (square.classList.contains('confirm')) {
                    console.log('square is confirmed');
                    square.classList.remove('confirm');
                    remove_possible_moves(game);
                    if (game.active_piece) {
                        if (game.active_piece.position) {
                            game.Game_board.move(game.active_piece, [x, y]);
                        }
                        game.active_piece = null;
                        active_col = active_col === 'white' ? 'black' : 'white';
                        init_state();
                    }
                    else {
                        throw new Error('active_piece is null');
                    }
                    return;
                }
                if (square.classList.contains('white') || square.classList.contains('black')) {
                    let [x, y] = get_coordinates(square);
                    let picked_pos = game.Game_board.board[x][y];
                    if (picked_pos.depict === 'E') {
                        console.log('empty square');
                    }
                    else {
                        game.active_piece = picked_pos;
                        square.classList.add('active');
                        //console.log(`active piece: ${game.active_piece.type}`)
                        visualize_possible_moves(game, game.active_piece);
                    }
                    return;
                }
            });
        });
    }
}
function visualize_possible_moves(game, piece) {
    const possible_moves = game.Game_board.get_possible_moves(piece);
    console.log("here are the possible moves: " + possible_moves);
    possible_moves.forEach(move => {
        const square = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
        if (square) {
            square.classList.add('possible-move');
        }
    });
}
function remove_possible_moves(game) {
    const possible_moves = document.querySelectorAll('.possible-move');
    possible_moves.forEach(move => {
        move.classList.remove('possible-move');
    });
    console.log('all possible moves removed');
}
function get_coordinates(square) {
    let rowAttr = square.getAttribute('data-row');
    let colAttr = square.getAttribute('data-col');
    console.log(`row: ${rowAttr}, col: ${colAttr}`);
    if (rowAttr !== null && colAttr !== null) {
        var x = parseInt(rowAttr, 10);
        var y = parseInt(colAttr, 10);
        console.log(`coordinates, row: ${x}, col: ${y}`);
    }
    else {
        throw new Error('row or col is null');
    }
    return [x, y];
}
init_state();
