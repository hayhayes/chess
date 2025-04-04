//PROVIDES OPTIONS TO RESTART, UNDO MOVES, HINTS
'use client'

import { useDispatch } from "react-redux";
import { undoMove, resetGame } from "@/features/chessBoardSlice";

export function UndoButton(){
    const dispatch = useDispatch();

    function handleClick(){
       dispatch(undoMove());
    }

    
    return(
        <div className="button undo" onClick={() => handleClick()}>
            <img src="/undo.png" alt="undo" /> Undo
        </div>
    )
}

export function ResetButton(){
    const dispatch = useDispatch();

    function handleClick(){
        dispatch(resetGame());
    }

    return(
        <div className="button reset" onClick={() => handleClick()}>
            <img src="/new.png" alt="undo" /> Reset
        </div>
    )
}