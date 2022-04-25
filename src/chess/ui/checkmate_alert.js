import React from 'react';
import ChessGameWrapper from './chessgame';
import { Modal, Button } from 'react-bootstrap';
const socket = require("../../connections/socket").socket


const CheckMateAlertWrapper = (props) => {
    // Display a modal to alert players that a checkmate 
    // has been given.

    // Show modal if checkmate is true.
    const [show, setShow] = React.useState(props.checkmate)

    const handleClose = () => setShow(false);

    const handleClick = () => {
        socket.emit("startNewGame", {gameId: props.gameId})
        setShow(false);
}


    return (
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkmate!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{textAlign: "center"}}>
                        <h1>Oops, you have been checkmated.</h1>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Button variant="success" onClick={handleClick}>
                                    Start a New Game
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
        </Modal>
    )
}

export default CheckMateAlertWrapper;