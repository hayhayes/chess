"use client"

import React from "react";
import Square from "./Square";
import { useSelector, useDispatch } from "react-redux";
import { movePiece, selectPiece } from "@/features/chessBoardSlice";
import { isMoveValid } from "@/utils/validMoves";

export default function Board () {
    const boardArray = useSelector((state) => state.chessBoard.board)
    const selectedPiece = useSelector((state) => state.chessBoard.selectedPiece)
    const turn = useSelector((state) => state.chessBoard.turn)
    const dispatch = useDispatch();
    

    function handleClick(coordinates){
        const [x, y] = coordinates;
        
        if(selectedPiece){  // check if there is a currently selected piece
            
            if(isMoveValid({from: selectedPiece, to: coordinates})){   //check if new coordinates are valid move
                dispatch(movePiece({from: selectedPiece, to: coordinates}))
            } else if(boardArray[x][y]){
                if(boardArray[x][y].color === turn){
                    dispatch(selectPiece(coordinates))
                } else {
                    dispatch(selectPiece(null))
                }
            } else {
                console.log('invalid move')
                dispatch(selectPiece(null))
            }

        }  else if(boardArray[x][y]){  // no currently selected piece → check if clicked square has a piece
            
            if(boardArray[x][y].color && boardArray[x][y].color === turn){    // check turn
                dispatch(selectPiece(coordinates))
                //TESTING
                console.log(`selected piece set to: ${boardArray[x][y].type} on square ${coordinates}`)
            } else {
                console.log(`oops! it's ${turn}'s turn!`)
            }     

        } 
        // no currently selected piece & square is empty
        else { 

            //TESTING
            console.log('no currently selected piece & this square is empty')

        }
    }

    return(
        <div className="board">
            {boardArray.map((row, xIndex) => 
                row.map((square, yIndex) => (
                    <Square 
                        key={`${xIndex}-${yIndex}`} 
                        piece={square} 
                        coordinates={[xIndex, yIndex]}
                        handleClick={() => handleClick([xIndex, yIndex])}
                    />
                )))}
        </div>
    )
}