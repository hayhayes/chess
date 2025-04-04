'use client'
import Image from "next/image";

//REPRESENTS A SINGLE CHESS PIECE

const pieceImages = {
    pawn: {white: '/wp.png', black: '/bp.png'},
    knight: {white: '/wn.png', black: '/bn.png'},
    bishop: {white: '/wb.png', black: '/bb.png'},
    rook: {white: '/wr.png', black: '/br.png'},
    queen: {white: '/wq.png', black: '/bq.png'},
    king: {white: '/wk.png', black: '/bk.png'},
};

export default function Piece ({type, color}){
    const imgSrc = pieceImages[type]?.[color]

    return(
        <div className="piece">
            {imgSrc && <Image src={imgSrc} alt={`${color} ${type}`} width={50} height={50} />}
        </div>
    )
}