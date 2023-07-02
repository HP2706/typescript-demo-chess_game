import { chess_game, colors, ChessPiece, typeColToDepict, Color, Piece, Depict } from './chess_engine';

type PieceList = {
  [key in Color]: Depict[];
}

const objects: PieceList = {
  "white": ["♖", "♘", "♗", "♕", "♗", "♘", "♖","♙"],
  "black" : [ "♟", "♜", "♞", "♝", "♛", "♝", "♞", "♜"],
}; // without king


function getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
function random_pieces(one_color: boolean = false): Piece[] {
    const random_pieces: Piece[] = [];
    const num = getRandomNumberInRange(7,10)
    let col: Color = colors[getRandomNumberInRange(0,1)]; // we dont want empty pieces

    for (let i = 0; i < num; i++) {
      if (one_color) {
        var random_piece = new Piece(Object.keys(typeColToDepict[col])[getRandomNumberInRange(0,7)] as ChessPiece, col, [0,0]);
      } else {
        let new_col = colors[getRandomNumberInRange(0,1)]; 
        var random_piece = new Piece(Object.keys(typeColToDepict[col])[getRandomNumberInRange(0,7)] as ChessPiece, col, [0,0]);
      }
      random_pieces.push(random_piece);
    }

    return random_pieces;
}

//generate random board

function random_board(game: chess_game, one_col: boolean = false) {
    let pieces = random_pieces(one_col);
    game.Game_board.set_empty();
  
    const kingPositions = randomPositions(2);
    game.Game_board.board[kingPositions[0][0]][kingPositions[0][1]] = new Piece("king", "white", kingPositions[0]);
    game.Game_board.board[kingPositions[1][0]][kingPositions[1][1]] = new Piece("king", "black", kingPositions[1]);
  
    const piecePositions = randomPositions(pieces.length);
    console.log(piecePositions);
    for (let i = 0; i < pieces.length; i++) {
      const [row, col] = piecePositions[i];
      pieces[i].position = [row, col];
      game.Game_board.board[row][col] = pieces[i];
    } 
  }
  
  function randomPositions(count: number): [number, number][] {
    const positions: [number, number][] = [];
    let remainingCount = count;
  
    while (remainingCount > 0) {
      const row = getRandomNumberInRange(0, 7);
      const col = getRandomNumberInRange(0, 7);
      const position: [number, number] = [row, col];
  
      // Ensure the position is not already occupied
      if (!positions.some(([r, c]) => r === row && c === col)) {
        positions.push(position);
        remainingCount -= 1;
      }
    }
  
    return positions;
  }
  

//testing whether move works

let num = 10
let game = new chess_game()
game.simulation_board.set_empty();
let king = new Piece('king', 'white', [4,4])
game.simulation_board.board[4][4] = king
game.simulation_board.print();
for (let i = 0; i < num; i++) {
  let moves = game.simulation_board.get_possible_moves(king)
  let k = getRandomNumberInRange(0, moves.length-1)
  console.log("considering moves", king, moves[k])
  game.simulation_board.move(king, moves[k])

  game.simulation_board.print();
  

}


