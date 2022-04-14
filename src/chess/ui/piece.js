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
  const [image] = useImage(props.imgUrls[colorChoice]);
  const isDragged = props.id === props.draggedPieceTargetId;

  const canThisPieceEvenBeMovedByThisPlayer = props.isWhite === props.thisPlayerColorIsWhite;
  const isItThatPlayersTurn = props.playerTurnToMoveIsWhite === props.thisPlayerColorIsWhite;

  const isWhiteKingInCheck = props.id === "wk1" && props.whiteKingInCheck;
  const isBlackKingInCheck = props.id === "bk1" && props.blackKingInCheck;


  return <Image image={image}
                x = {props.x - 90}
                y = {props.y - 90}
                draggable = {canThisPieceEvenBeMovedByThisPlayer && isItThatPlayersTurn}
                width = {isDragged ? 75 : 60}
                height = {isDragged ? 75 : 60}
                onDragStart = {props.onDragStart}
                onDragEnd = {props.onDragEnd}
                fill = {(isWhiteKingInCheck && "red") || (isBlackKingInCheck) && "red"}
                id = {props.id} />;
};

export default Piece;
