import React from 'react';
import { useParams } from 'react-router-dom';
const socket = require("../connections/socket").socket;

const JoinGameRoom = ( gameId, userName, isCreator) => {

    const idData = {
        gameId: gameId,
        userName: userName,
        isCreator: isCreator
    }
    socket.emit("playerJoinGame", idData);
}

const JoinGame = (props) => {
    const {gameId} = useParams();
    JoinGameRoom(gameId, props.userName, props.isCreator);

    return (
        <div>
            <h1 style={{ textAlign: "center"}}>Welcome to Chess Video Time</h1>
        </div>
    )
}

export default JoinGame