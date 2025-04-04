import { createSlice } from "@reduxjs/toolkit";

//CREATES 2D ARRAY FOR CHESS BOARD
//ARRAY SETS UP BOARD FOR PLAYER → WHITE
let startingBoardArray = [];

for (let i = 0; i < 8; i++) {
    startingBoardArray[i] = [];
    
    if (i === 0 || i === 7) {
        if (i === 0) {
            startingBoardArray[i] = [
                { type: 'rook', color: 'black', id: 1},
                { type: 'knight', color: 'black', id: 1},
                { type: 'bishop', color: 'black', id: 1},
                { type: 'queen', color: 'black', id: 1}, 
                { type: 'king', color: 'black', id:1},  
                { type: 'bishop', color: 'black', id: 2},
                { type: 'knight', color: 'black', id: 2},
                { type: 'rook', color: 'black',id: 2},
            ];
        } else {
            startingBoardArray[i] = [
                { type: 'rook', color: 'white', id: 1},
                { type: 'knight', color: 'white', id: 1},
                { type: 'bishop', color: 'white', id: 1},
                { type: 'queen', color: 'white', id: 1}, 
                { type: 'king', color: 'white', id: 1},  
                { type: 'bishop', color: 'white', id: 2},
                { type: 'knight', color: 'white', id: 2},
                { type: 'rook', color: 'white', id: 2},
            ];
        }
        
    } else {
        for (let j = 0; j < 8; j++) {
            if (i === 1) {
                startingBoardArray[i].push({ type: 'pawn', color: 'black', id: j});
            } else if (i === 6) {
                startingBoardArray[i].push({ type: 'pawn', color: 'white', id: j });
            } else {
                startingBoardArray[i].push(null); // Keep consistent structure
            }
        }
    }
}

const initialState = {
    board: startingBoardArray,
    turn: "white",
    history: [],
    selectedPiece: null,
    gameStatus: "ongoing", //ability to add "check", "checkmate", "stalemate"
}

const chessBoardSlice = createSlice({
    name: "chessBoard",
    initialState,
    reducers: {
        movePiece: (state, action) => {
            const {from, to} = action.payload;
            const [fromX, fromY] = from; // Extract x, y
            const [toX, toY] = to;
            
            if(state.board[toX][toY]){ // check if move captures another piece
                state.history.push({piece: state.board[fromX][fromY], from: from, to: to, capture:state.board[toX][toY]}) // add move to history with capture
            } else {
                state.history.push({piece: state.board[fromX][fromY], from: from, to: to, capture: false}) // add move to history
            }
            state.board[toX][toY] = state.board[fromX][fromY]; // Move piece
            state.board[fromX][fromY] = null; // clear old position
            state.selectedPiece = null; // clear selected piece
            state.turn = state.turn === "white" ? "black" : "white"; // switch turn
        },
        undoMove: (state) => {
            const lastMove = state.history.pop();
            const [fromX, fromY] = lastMove.from; // Extract x, y
            const [toX, toY] = lastMove.to;
            state.board[fromX][fromY] = state.board[toX][toY]; // undo last move
            
            // check if move was a capture, then return piece or clear the square
            if(lastMove.capture){
                state.board[toX][toY] = lastMove.capture
            } else {
                state.board[toX][toY] = null;
            }
             
            state.selectedPiece = null; // make sure selected piece is clear
            state.turn = state.turn === "white" ? "black" : "white"; // switch turn

        },
        selectPiece: (state, action) => {
            state.selectedPiece = action.payload;
        },
        resetGame: () => initialState,
    }
})

export const { movePiece, undoMove, selectPiece, resetGame } = chessBoardSlice.actions;
export default chessBoardSlice.reducer;