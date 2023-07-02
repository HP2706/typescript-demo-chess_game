import { includesArray } from './utils';

export type ChessPiece = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "empty";
export type Color = "white" | "black" 
export type Depict = "♖" | "♘" | "♗" | "♕" | "♗" | "♘" | "♖" | "♙" | "♟" 
| "♜" | "♞" | "♝" | "♛" | "♝" | "♞" | "♜" |  "♚" | "♔" | "E"; //watch out adding E might create bugs  

export const colors: Color[] = ["white", "black"];

export const typeColToDepict: { [key in Color]: { [key in ChessPiece]: Depict } } = {
    "white": {
        "pawn": "♙",
        "rook": "♖",
        "knight": "♘",
        "bishop": "♗",
        "queen": "♕",
        "king": "♔",
        "empty": "E"
    },
    "black": {
        "pawn": "♟",
        "rook": "♜",
        "knight": "♞",
        "bishop": "♝",
        "queen": "♛",
        "king": "♚",
        "empty": "E"
    },
};


export class Piece {
    type: ChessPiece;
    depict : Depict;
    color: Color | null;
    // position type is [row, column] or null
    position : [number, number];
    constructor(type: ChessPiece, col: Color | null , pos: [number, number]) {
        this.position = pos;
        this.type = type;
        this.color = col;
        if (col == null) {
            this.depict = "E";
        } else {
        this.depict = typeColToDepict[col][type];
        }
    }
    to_string() {
        return this.depict;
    }
}


export class Game_board {
    board: Array<Array<Piece>> = [];
    constructor() { 
        this.set_starting_position();
    }
    
    set_empty() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = new Piece("empty", null, [i, j]);
            }
        }
    }
    

    place_piece(pieceType : ChessPiece, pieceColor : Color | null , position: [number, number]) {
        if (this.isValidPosition(position)) {
            this.board[position[0]][position[1]] = new Piece(pieceType, pieceColor, position);
            
        } else {
            console.error("Invalid position for piece placement");
        }
    }

    get_free_positions() {
        let free_positions: Array<Array<number>> = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8 ; j++) {
                if (this.board[i][j].depict == "E") {
                    free_positions.push([i, j]);
                }
            }
        }
        return free_positions;
    }

    set_starting_position() { 
        for (let i = 0; i < 8; i++) {
            this.board[i] = []; // Initialize the row
            for (let j = 0; j < 8; j++) {
                if (i === 1) {
                    this.place_piece("pawn", "white", [i,j]) // White pawns// Black pawns
                } else if (i === 6) {
                    this.place_piece("pawn", "black", [i,j]) // White pawns // White pawns
                } else if (i === 0 || i === 7) {
                    let color: Color;
                    let types = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];;
                    if (i === 0) {
                        color = "white";
                        
                    } else { // i === 7
                        color = "black";
                    } 
                    const pieceOrder = [0, 1, 2, 3, 4, 2, 1, 0];
                    this.place_piece(
                        types[pieceOrder[j]] as ChessPiece, 
                        color, 
                        [i, j]
                    );
                } else {
                    this.place_piece("empty", null, [i, j]); // Empty square
                }
            }
        }
    }

    
    getPiecesByColor(color: Color) {
        let pieces = this.get_all_board_pieces()
        pieces = pieces.filter(piece => piece.color === color);
        return pieces;
      }


    isValidPosition(position: Array<number>): boolean {
        return position[0] >= 0 && position[0] < 8 && position[1] >= 0 && position[1] < 8;
    }

    print() {
        for (let i = 0; i < 8; i++) {
            console.log(this.board[i].map(piece => piece.depict).join(" ") + " " + String(i));
        }
        console.log("0 1 2 3 4 5 6 7");

        /* console.log("info about piece color") //for debugging
        for (let i = 0; i < 8; i++) {
            console.log(this.board[i].map(piece => piece.color).join(" ") + " " + String(i));
        }
        console.log("0 1 2 3 4 5 6 7");  */
    }

    get_all_board_pieces() {
        let pieces: Array<Piece> = []; //pieces as string
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8 ; j++) {
                let piece = this.board[i][j];
                if (piece.depict != "E") {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    get_possible_moves(piece: Piece) : Array<[number, number]> {
        //console.log("piece", piece, piece.depict, "position", piece.position);


        let possible_moves: Array<[number, number]> = [];

        const calculateMove = (direction: number[], pawn? : boolean) => {
            let [dx, dy] = direction;
            let x = piece.position[0] + dx, y = piece.position[1] + dy;
            if (!this.isValidPosition([x, y])) {
                //console.log("not valid position", [x, y])
                return false;   
            }
            
            if (piece.color != null && this.getPiecesByColor(piece.color).includes(this.board[x][y])) {
                //console.log("piece of same color, returning false", [x, y])
                return false;
            }

            if (this.board[x][y].depict == "E") {
                if (pawn) {
                    if (dy != 0) {
                        return false;
                    }                   
                } 
                possible_moves.push([x, y]);
                return true;

            } else {
                // take piece if it is of the other color
                if (piece.color != null &&  !this.getPiecesByColor(piece.color).includes(this.board[x][y])) {
                    //console.log("adding position can claim enemy piece", [x, y])
                    possible_moves.push([x, y]);
                    //console.log("take piece", [x, y]);
                    return false;
                } else {
                    // if the piece is of the same color, don't add the move and return false
                    return false;
                }
            }
        };

        if (piece.type == "pawn") {
            if (piece.color == "white") {
                var directions = [[1, 0], [1, -1], [1, 1]];  //black
            }
            else {
                var directions = [[-1, 0], [-1, -1], [-1, 1]]; 
            }
                
            // Forward, forward left diagonal, forward right diagonal.
            for (let direction of directions) {
                calculateMove(direction, true);
            }
            // Handle 2 steps forward for the pawn's first move

            //to step forward fix readability
            if ((piece.position[0] === 1 && this.board[piece.position[0]+2][piece.position[1]].depict === "E") || 
                (piece.position[0] === 6 && this.board[piece.position[0]-2][piece.position[1]].depict === "E")) {
                possible_moves.push([piece.position[0]+(piece.color === "white" ? 2 : -2), piece.position[1]]);
            }
            return possible_moves;
        }
        
        if (piece.type == "rook") {
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Up, down, right, left
            for (let direction of directions) {
                let steps = 1;
                while (calculateMove(direction.map(num => num * steps))) {
                    steps++;
                }
            }
            return possible_moves;
        }

        if (piece.type == "knight") {
            const directions = [[1,2], [-1,2], [1,-2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]];  // L shape
            for (let direction of directions) {
                calculateMove(direction);
            }
            return possible_moves;
        }

        if (piece.type == "bishop") {
            const directions = [[1,1], [-1,1], [1,-1], [-1,-1]];  // Diagonals
            for (let direction of directions) {
                let steps = 1;
                while (calculateMove(direction.map(num => num * steps))) {
                    steps++;
                }
            }
            return possible_moves;
        }
        if (piece.type == "queen") {
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1,1], [-1,1], [1,-1], [-1,-1]]; // Up, down, right, left, diagonals
            for (let direction of directions) {
                let steps = 1;
                while (calculateMove(direction.map(num => num * steps))) {
                    steps++;
                }
            }
            return possible_moves;
        }
        if (piece.type == "king") {
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1,1], [-1,1], [1,-1], [-1,-1]]; // Up, down, right, left, diagonals
            for (let direction of directions) {
                calculateMove(direction);
            }
            return possible_moves;
        }
        else {
            return [];
        }
    }

    find_all(piece: Piece) {
        //console.log("finding piece", piece);
        let positions: Array<Array<number>> = [];
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (this.board[i][j].depict == piece.depict) { //cannot compare pieces directly
              positions.push([i, j]);
            }
          }
        }
        if (positions.length == 0) {
          return [[]];
        }
        return positions;
    }

    move(piece: Piece, target_position: [number, number]) {
        let candidates = this.get_possible_moves(piece);
        //console.log("target position", target_position)
        //console.log(piece)
        //console.log("candidates", candidates);
        if (!includesArray(candidates, target_position)) {
            throw new Error(`Invalid move for ${piece.type} at ${piece.position} to ${target_position}`);
        }
        let [x, y] = target_position;
        let [old_x, old_y] = piece.position;

        this.place_piece(piece.type, piece.color, [x,y]);
        this.place_piece("empty", null, [old_x, old_y])
        console.log(this.board[old_x][old_y])
    }

    all_moves(color: string) {
        const pieces_by_color = this.getPiecesByColor(color as Color);
        let potential_moves: Array<[number, number]> = [];
        pieces_by_color.forEach((piece:Piece) => {
                var possible_moves = this.get_possible_moves(piece);
                potential_moves.push(...possible_moves);
            });     
        return potential_moves;
      }
    
    check_threat(color: Color) {
        let enemy_col = color === "white" ? "black" : "white";
        let enemy_moves = this.all_moves(enemy_col);

        let pieces = this.getPiecesByColor(color); // get pieces
        let kings = pieces.filter(p => p.type === "king" && p.color === color);

        if (kings.length === 0) {
            console.log('No king found! on this board.')
            this.print();
            throw new Error(`No king of color ${color} found!`); 
        }
        let king_position = kings[0].position;

        //console.log("enemy moves", enemy_moves)
        //console.log("king position", king_position)
        
        for (let move of enemy_moves) {
          if (includesArray([move], king_position)) {
            return true;
          }
        }
        return false;
    }
}

export class chess_game {
    Game_board: Game_board;
    simulation_board : Game_board;
    active_piece : Piece | null = null;
    constructor() {
        this.Game_board = new Game_board();
        this.simulation_board = new Game_board();
    }
    

      checkmate(color: Color) { 
        this.simulation_board.board = JSON.parse(JSON.stringify(this.Game_board.board));  //deep copy to avoid object referencing issues
        if (this.simulation_board.check_threat(color)) {
            console.log("threatened")
            let pieces = this.Game_board.getPiecesByColor(color);
            let isCheckmate = true;
    
            for (let piece of pieces) {
                let moves = this.Game_board.get_possible_moves(piece);
                //console.log("moves", moves)
                for (let move of moves) {
                    // copy the real board to the simulation board
                    this.simulation_board.board = JSON.parse(JSON.stringify(this.Game_board.board));
    
                    /* console.log("piece", piece, "move", move)
                    console.log("position before move", piece.position, move)
                    console.log("all pieces", this.Game_board.get_all_board_pieces())
                    console.log("pieces by color", color, this.simulation_board.getPiecesByColor(color))
                    console.log("pieces by color", 'white' ? 'black' : 'white' , this.simulation_board.getPiecesByColor(color)) */

                    this.simulation_board.move(piece, move);

                    /* console.log("position after", piece.position)
                    console.log("board after")
                    this.simulation_board.print()
                    console.log("threatened" ,this.simulation_board.check_threat(color)) */
                
                    if (!this.simulation_board.check_threat(color)) {
                        // if not, then it's not checkmate
                        isCheckmate = false;
                        break;
                    }
                    
                    if (!isCheckmate) break;
                }
                if (!isCheckmate) break;
            }
            return isCheckmate;
        }
        return false;  
    }

    restart(){
        this.Game_board.set_starting_position();
        this.simulation_board.set_starting_position();
    }
}

//TODOS:
//move works

//fix checkmate
//rewrite how simulation is done
// fix double king bug
//en passant, castling, promotion when pawn reaches end of board