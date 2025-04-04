//ONCE A PIECE IS SELECTED HIGHLIGHT LEGAL MOVES ON THE BOARD

import { store } from "@/store/store";
import { isMoveValid } from "./validMoves";

export function isPossibleMove(square){
    const state = store.getState().chessBoard;
    const selectedPiece = state.selectedPiece;
    const [squareX,squareY] = square;

    //  if no currently selected piece or square is selected piece
    if(!state.selectedPiece || (squareX === selectedPiece[0] && squareY === selectedPiece[1])) return false;

    return isMoveValid({from: selectedPiece, to: square})
}

