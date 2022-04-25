import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const Piece = (props) => {
  /**
   * Define an individual piece's style and state
   *
   * imageUrl
   * color
   * id
   * player colour
   * who's turn is it to play
   * if a player's turn, the colour of this player will
   * be the same colour as this piece.
   *
   * Make the piece draggable.
   */

  const colorChoice = props.isWhite ? 0 : 1;
  const [image, status] = useImage(props.imageUrls[colorChoice]);
  const isDragged = props.id === props.draggedPieceTargetId;

  const canThisPieceEvenBeMovedByThisPlayer =
    props.isWhite === props.thisPlayerColorIsWhite;
  const isItThatPlayersTurn =
    props.playerTurnToMoveIsWhite === props.thisPlayerColorIsWhite;

  const isWhiteKingInCheck = props.id === "wk1" && props.whiteKingInCheck;
  const isBlackKingInCheck = props.id === "bk1" && props.blackKingInCheck;

  return (
    <Image
      image={image}
      x={props.x - 65}
      y={props.y - 65}
      draggable={canThisPieceEvenBeMovedByThisPlayer && isItThatPlayersTurn}
      width={isDragged ? 100 : 82}
      height={isDragged ? 100 : 82}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      fill={
        (isWhiteKingInCheck ? "rgba(225, 45, 45, 0.5)" : "") ||
        (isBlackKingInCheck ? "rgba(225, 45, 45, 0.5)" : "")
      }
      id={props.id}
    />
  );
};

export default Piece;
