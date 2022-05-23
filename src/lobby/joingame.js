import React from "react";
import { useParams } from "react-router-dom";
const socket = require("../connections/socket").socket;

const JoinGameRoom = (gameId, userName, isCreator) => {
  const idData = {
    gameId: gameId,
    userName: userName,
    isCreator: isCreator,
  };
  socket.emit("playerJoinGame", idData);
};

const JoinGame = (props) => {
  const { gameid } = useParams();
  JoinGameRoom(gameid, props.userName, props.isCreator);

  return <></>;
};

export default JoinGame;
