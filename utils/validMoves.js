//THIS FILE CONTAINS HELPER FUNCTIONS TO DETERMINE
//VALID MOVE FOR EACH PIECE
//CHECK, CHECKMATE, STALEMATE DETECTION
//SPECIAL RULES: CASTLING, ENPASSANT, PAWN PROMOTION

import { store } from "@/store/store"

export function isMoveValid({from, to}){
    const board = store.getState().chessBoard.board
    const [fromX, fromY] = from;
    const piece = board[fromX][fromY].type;
    
    switch(piece){
        case 'pawn':
            return legalPawnMove({from, to});
        case 'knight':
            return legalKnightMove({from, to});
        case 'bishop':
            return legalBishopMove({from, to});
        case 'rook':
            return legalRookMove({from, to});
        case 'queen':
            return legalQueenMove({from, to});
        case 'king':
            return legalKingMove({from, to});
        default: return false;
    }
}

function isFirstMove(piece){
    const moveHistory = store.getState().chessBoard.history;
    
    return !moveHistory.some(move => 
        move.piece.type === piece.type && 
        move.piece.color === piece.color && 
        move.piece.id === piece.id
    );
}

function legalPawnMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from; // Extract x, y
    const [toX, toY] = to;
    const piece = board[fromX][fromY];
    if (!piece || piece.type !== "pawn") return false; // Ensure it's a pawn

    const direction = piece.color === "white" ? -1 : 1; // White moves up (-1), black moves down (+1)

    //  prevent error in the case this is running isPossibleMove
    if(board[toX][toY] && board[toX][toY].type === 'king' && board[toX][toY].color === piece.color) return false;

    let futureBoard = board.map(row => row.slice());
    futureBoard[toX][toY] = piece;
    futureBoard[fromX][fromY] = null;
    
    if(isKingCheck({board: futureBoard})) return false; // ❌ Move cannot result in a check

    // 🟢 **1. Forward Move (No Capture)**
    if(fromY === toY){  // Same column → moving straight
        if(toX === fromX + direction && !board[toX][toY]) return true;
        if(isFirstMove(piece) && toX === fromX + (2 * direction) && !board[toX][toY] && !board[fromX + direction][toY]) return true;
    }

    // 🔴 **2. Capture Move (Diagonal Attack)**
    if(Math.abs(fromY - toY) === 1 && toX === fromX + direction) {
        if(board[toX][toY] && board[toX][toY].color !== piece.color) return true;
    }
    
    // ❌ If none of the conditions pass, it's not a legal move
    return false;
}

function legalKnightMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from; // Extract x, y
    const [toX, toY] = to;
    const piece = board[fromX][fromY];

    if (!piece || piece.type !== "knight") return false; // Ensure it's a knight

    // 👆 **Check for L shaped move **
    const isKnightMove = (Math.abs(fromX - toX) === 2 && Math.abs(fromY - toY) === 1) ||
                         (Math.abs(fromY - toY) === 2 && Math.abs(fromX - toX) === 1);
    
    if(!isKnightMove) return false;

    //  prevent error in the case this is running isPossibleMove
    if(board[toX][toY] && board[toX][toY].type === 'king' && board[toX][toY].color === piece.color) return false;

    let futureBoard = board.map(row => row.slice());
    futureBoard[toX][toY] = piece;
    futureBoard[fromX][fromY] = null;

    if(isKingCheck({board: futureBoard})) return false; // ❌ Move cannot result in a check

    if(!board[toX][toY] || board[toX][toY].color !== piece.color) return true;

    // ❌ If none of the conditions pass, it's not a legal move
    return false;
    
}

function legalBishopMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    const piece = board[fromX][fromY];
    
    if (!piece || !(piece.type === "bishop" || piece.type === 'queen')) return false; // Ensure it's a bishop

    // ✅ Check that move is diagonal
    const isBishopMove = (Math.abs(fromX - toX) === Math.abs(fromY - toY));

    if(!isBishopMove) return false;

     // ✅ Determine step direction
    const directionX = fromX < toX ? 1 : -1;
    const directionY = fromY < toY  ? 1 : -1;

    // 📖 LESSON LEARNED 📖
    // for loops are best when you know the number of iterations ahead of time
    // do...while is best when the first iteration must happen before checking the condition.

    // ✅ Check path for obstructions (excluding the final destination square)
    let x = fromX + directionX;
    let y = fromY + directionY;
    while(x !== toX && y !== toY){
        if(board[x][y]) return false; // ❌ Path is blocked

        x += directionX;
        y += directionY;
    }

    //  prevent error in the case this is running isPossibleMove
    if(board[toX][toY] && board[toX][toY].type === 'king' && board[toX][toY].color === piece.color) return false;

    let futureBoard = board.map(row => row.slice());
    futureBoard[toX][toY] = piece;
    futureBoard[fromX][fromY] = null;
    
    if(isKingCheck({board: futureBoard})) return false; // ❌ Move cannot result in a check

    // ✅ Handle capture logic at destination
    if (board[toX][toY]) {
        return board[toX][toY].color !== piece.color; // ❌ Cannot capture own piece
    }

    return true; // ✅ Legal bishop move
}

function legalRookMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from;
    const [toX, toY]= to;
    const piece = board[fromX][fromY];
    
    if(!piece || !(piece.type === 'rook' || piece.type === 'queen')) return false;

    const isHorizontalMove = fromX === toX && fromY !== toY;
    const isVerticalMove = fromY === toY && fromX !== toX;

    if(!isHorizontalMove && !isVerticalMove) return false;

    //  prevent error in the case this is running isPossibleMove
    if(board[toX][toY] && board[toX][toY].type === 'king' && board[toX][toY].color === piece.color) return false;

    let futureBoard = board.map(row => row.slice());
    futureBoard[toX][toY] = piece;
    futureBoard[fromX][fromY] = null;
    // 🏰 logic for castling 
    /*if(isFirstMove(piece) && isHorizontalMove){
        if(board[toX][toY].type === 'king' && isFirstMove(board[toX][toY])){
            const directionY = fromY < toY ? 1 : -1;
            let y = fromY + directionY;
            while( y !== toY){
                if(board[fromX][y]) return false; // ❌ Path is blocked
                y += directionY;
            }

            // ❌ King cannot be in check before, during, or after castling
            //‼️NEED TO ADD KING IN CHECK FUNCTION BEFORE USING THIS ‼️
            if (isKingInCheck(king.color)) return false;

            return true;
        }
    }*/

    // ✅ Check path for obstructions (excluding the final destination square)
    
    if(isHorizontalMove){
        const directionY = fromY < toY ? 1 : -1;
        let y = fromY + directionY;
        while( y !== toY){
            if(board[fromX][y]) return false; // ❌ Path is blocked
            y += directionY;
        }
    }
    if(isVerticalMove){
        const directionX = fromX < toX ? 1 : -1;
        let x = fromX + directionX;
        while(x !== toX){
            if(board[x][fromY]) return false; // ❌ Path is blocked
            x += directionX;
        }
    }

    if(isKingCheck({board: futureBoard})) return false; // ❌ Move cannot result in a check

    // ✅ Handle capture logic at destination
    if (board[toX][toY]) {
        return board[toX][toY].color !== piece.color; // ❌ Cannot capture own piece
    }

    return true; // ✅ Legal rook move

}

function legalQueenMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    const piece = board[fromX][fromY];


    if (!piece || piece.type !== "queen") return false; // Ensure it's a queen

    // Prevent capturing own piece
   if (board[toX][toY] && board[toX][toY].color === piece.color) return false;

   //  prevent error in the case this is running isPossibleMove
   if(board[toX][toY] && board[toX][toY].type === 'king' && board[toX][toY].color === piece.color) return false;
   
    let futureBoard = board.map(row => row.slice());
    futureBoard[toX][toY] = piece;
    futureBoard[fromX][fromY] = null;
    if(isKingCheck({board: futureBoard})) return false; // ❌ Move cannot result in a check

    return legalBishopMove({ from, to }) || legalRookMove({ from, to });
}

function legalKingMove({from, to}){
    const board = store.getState().chessBoard.board;
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    const piece = board[fromX][fromY];


    if (!piece || piece.type !== "king") return false; // Ensure it's a king

    // Prevent capturing own piece
    if (board[toX][toY] && board[toX][toY].color === piece.color) return false;

    //prevent king from moving into check
    if(isKingCheck({to})) return false;

    if(Math.abs(toX - fromX) <= 1 & Math.abs(toY - fromY) <= 1) return true;
}

function isKingCheck({to, board}) {
    const state = store.getState().chessBoard;
    const currentBoard = board || state.board;
    const color = state.turn; // Current player's turn

    let kingX = -1;
    let kingY = -1;

    // 🔎 If `to` is provided, assume it's the king's position
    if (to) {
        [kingX, kingY] = to;
    } else {
        // Otherwise, find the king on the board
        currentBoard.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {
                if (square && square.type === 'king' && square.color === color) {
                    kingX = rowIndex;
                    kingY = squareIndex;
                }
            });
        });
    }

    // ❌ Error handling: King should always be found
    if (kingX === -1 || kingY === -1) {
        console.error("Error: King not found on the board!", color);
        return true; // Assume check to stop invalid game state
    }

    // 🏹 **Check for threats in all directions**
    const opponentColor = color === "white" ? "black" : "white";

    // ♜ Rook & Queen (Horizontal & Vertical)
    if (checkLinearThreat(kingX, kingY, [[1, 0], [-1, 0], [0, 1], [0, -1]], ["rook", "queen",], opponentColor, currentBoard)) {
        return true;
    }

    // ♝ Bishop & Queen (Diagonals)
    if (checkLinearThreat(kingX, kingY, [[1, 1], [-1, -1], [1, -1], [-1, 1]], ["bishop", "queen"], opponentColor, currentBoard)) {
        return true;
    }

    // ♞ Knight (L-shape)
    if (checkKnightThreat(kingX, kingY, opponentColor, currentBoard)) {
        return true;
    }

    // ♙ Pawn (Only diagonal threats)
    if (checkPawnThreat(kingX, kingY, opponentColor, currentBoard)) {
        return true;
    }

    // ♔ Enemy King (One-square check)
    if (checkKingThreat(kingX, kingY, opponentColor, currentBoard)) {
        return true;
    }

    return false; // ✅ King is not in check
}


function checkLinearThreat(x, y, directions, pieceTypes, opponentColor, board) {
    
    for (const [dx, dy] of directions) {
        let i = x + dx, j = y + dy;
        while (i >= 0 && i < 8 && j >= 0 && j < 8) {
            if (board[i][j]) {
                if (board[i][j].color === opponentColor && pieceTypes.includes(board[i][j].type)) {
                    return true; // Threat detected
                }
                break; // Stop checking in this direction if a piece blocks the path
            }
            i += dx;
            j += dy;
        }
    }
    return false;
}

function checkKnightThreat(x, y, opponentColor, board) {
    const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    
    return knightMoves.some(([dx, dy]) => {
        const i = x + dx, j = y + dy;
        return i >= 0 && i < 8 && j >= 0 && j < 8 &&
            board[i][j] && board[i][j].color === opponentColor && board[i][j].type === "knight";
    });
}

function checkPawnThreat(x, y, opponentColor, board) {
    const forward = opponentColor === "white" ? -1 : 1; // White moves up (-1), Black moves down (+1)
    const pawnThreats = [[forward, -1], [forward, 1]];
    
    return pawnThreats.some(([dx, dy]) => {
        const i = x + dx, j = y + dy;
        return i >= 0 && i < 8 && j >= 0 && j < 8 &&
            board[i][j] && board[i][j].color === opponentColor && board[i][j].type === "pawn";
    });
}

function checkKingThreat(x, y, opponentColor, board) {
    const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    
    return kingMoves.some(([dx, dy]) => {
        const i = x + dx, j = y + dy;
        return i >= 0 && i < 8 && j >= 0 && j < 8 &&
            board[i][j] && board[i][j].color === opponentColor && board[i][j].type === "king";
    });
}
