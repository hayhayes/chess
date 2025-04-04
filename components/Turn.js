//  Just a simple component to help you track whose turn it is
'use client'
import { useSelector } from "react-redux";

export default function TurnTracker(){
    const turn = useSelector((state) => state.chessBoard.turn)

    return(
        <div className="turn-tracker">
            <p>It is <span>{turn}'s</span> turn</p>
        </div>
    )
}