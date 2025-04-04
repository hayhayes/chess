'use client'

import Piece from "./Piece"
import { isPossibleMove } from "@/utils/moveHighlighting";
//REPRESENTS AN INDIVIDUAL SQUARE

export default function ({piece, coordinates, handleClick}){
    const [x, y] = coordinates;

    function squareColor(){
        if(x % 2 === 0){
            if(y % 2 === 0){
                return 'light'
            } else {
                return 'dark'
            }
        } else {
            if(y % 2 === 0){
                return 'dark'
            } else {
                return 'light'
            }
        }
    }

    function possibleMove(){
        if(isPossibleMove(coordinates)){
            if(piece){
                console.log(coordinates, piece)
                return 'capture'
            } else {
                return 'move'
            }
            
        } else {
            return ''
        }
    }

    return(
        <div className={`square ${squareColor()}`}  onClick={() => handleClick(piece, coordinates)}>
           {piece &&  <Piece type={piece.type} color={piece.color} /> }
           <div className={possibleMove()}></div>
        </div>
    )
}