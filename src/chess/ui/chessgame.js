import React from "react";
import {Container, Row, Col} from "react-bootstrap"
import Game from "../model/chess";
import Square from "../model/square";
import { Stage, Layer } from "react-konva";
import Board from "../assets/chess_board.jpg";
import Piece from "./piece";
import piece_styles from "./piece_styles";
import { useParams } from "react-router-dom";
import { ColorContext } from "../../context/colorcontext";
import CheckMateAlertWrapper from "./checkmate_alert";

const cloneDeep = require("clone-deep");

const socket = require("../../connections/socket").socket;

class ChessGame extends React.Component {
  state = {
    gameState: new Game(this.props.color),
    draggedPieceTargetId: "",
    playerTurnToMoveIsWhite: true,
    whiteKingInCheck: false,
    blackKingInCheck: false,
    checkmate: false,
  };

  componentDidMount() {
    // Register event listeners for socket.io
    socket.on("opponent move", (move) => {
      if (move.playerColorThatJustMovedIsWhite !== this.props.color) {
        this.movePiece(
          move.selectedId,
          move.finalPosition,
          this.state.gameState,
          false
        );
        this.setState({
          playerTurnToMoveIsWhite: !move.playerColorThatJustMovedIsWhite,
        });
      }
    });

    socket.on("restartGame", () => {
      this.reset();
    });
  }

  startDragging = (e) => {
    this.setState({
      draggedPieceTargetId: e.target.attrs.id,
    });
  };

  movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {
    /**
     * Use pythagorean theorem to calculate
     * distance between the final position of
     * chess piece and every square on the board,
     * and assigns the piece to the closest square.
     */

    let whiteKingInCheck = false;
    let blackKingInCheck = false;
    let whiteCheckmated = false;
    let blackCheckmated = false;
    const update = currentGame.movePiece(selectedId, finalPosition, isMyMove);

    if (update === "moved in the same position.") {
      this.revertToPreviousState(selectedId);
      return;
    } else if (update === "user tried to capture their own piece") {
      this.revertToPreviousState(selectedId);
      return;
    } else if (update === "b is in check" || update === "w is in check") {
      if (update[0] === "b") {
        blackKingInCheck = true;
      } else {
        whiteKingInCheck = true;
      }
    } else if (
      update === "b has been checkmated" ||
      update === "w has been checkmated"
    ) {
      if (update[0] === "b") {
        blackCheckmated = true;
      } else {
        whiteCheckmated = true;
      }
    } else if (update === "invalid move") {
      this.revertToPreviousState(selectedId);
      return;
    }

    if (isMyMove) {
      socket.emit("new move", {
        nextPlayerColorToMove: !this.state.gameState.playerIsWhite,
        playerColorThatJustMovedIsWhite: this.state.gameState.playerIsWhite,
        selectedId: selectedId,
        finalPosition: finalPosition,
        gameId: this.props.gameId,
      });
    }

    this.setState({
      draggedPieceTargetId: "",
      gameState: currentGame,
      playerTurnToMoveIsWhite: !this.props.color,
      whiteKingInCheck: whiteKingInCheck,
      blackKingInCheck: blackKingInCheck,
    });

    if (blackCheckmated) {
      this.setState({
        checkmate: true,
      });
    } else if (whiteCheckmated) {
      this.setState({
        checkmate: true,
      });
    }
  };

  endDragging = (e) => {
    const currentGame = this.state.gameState;
    const currentBoard = currentGame.getBoard();
    const finalPosition = this.inferCoord(
      e.target.x() + 100,
      e.target.y() + 100,
      currentBoard
    );
    const selectedId = this.state.draggedPieceTargetId;
    this.movePiece(selectedId, finalPosition, currentGame, true);
  };

  revertToPreviousState = (selectedId) => {
    const oldGameState = this.state.gameState;
    const oldBoard = oldGameState.getBoard();
    const temporaryGameState = new Game(true);
    const temporaryBoard = [];

    for (let i = 0; i < 8; i++) {
      temporaryBoard.push([]);
      for (let j = 0; j < 8; j++) {
        if (oldBoard[i][j].getPieceIdOnThisSquare() === selectedId) {
          temporaryBoard[i].push(
            new Square(j, i, null, oldBoard[i][j].canvasCoordinates)
          );
        } else {
          temporaryBoard[i].push(oldBoard[i][j]);
        }
      }
    }

    temporaryGameState.setBoard(temporaryBoard);

    this.setState({
      gameState: temporaryGameState,
      draggedPieceTargetId: "",
    });

    this.setState({
      gameState: oldGameState,
    });
  };

  inferCoord = (x, y, chessBoard) => {
    let hashmap = {};
    let shortestDistance = Infinity;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const canvasCoord = chessBoard[i][j].getCanvasCoordinates();
        const deltaX = canvasCoord[0] - x;
        const deltaY = canvasCoord[1] - y;
        const newDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        hashmap[newDistance] = canvasCoord;

        if (newDistance < shortestDistance) {
          shortestDistance = newDistance;
        }
      }
    }

    return hashmap[shortestDistance];
  };

  reset() {
    /*
      Reset the board if a user chooses to play a new game.

      Re-initialize gameState and model.
    */
    this.setState({
      gameState: new Game(this.props.color),
      playerTurnToMoveIsWhite: true,
      checkmate: false,
    });

    this.state.gameState.restartGame();
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            backgroundImage: `url(${Board})`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "contain",
            width: "720px",
            height: "720px",
            justifyContent: "center",
          }}
        >
          <Stage width={720} height={720}>
            <Layer>
              {this.state.gameState.getBoard().map((row, index) => {
                return (
                  <React.Fragment>
                    {row.map((square, index) => {
                      if (square.isOccupied()) {
                        return (
                          <Piece
                            key={index}
                            x={square.getCanvasCoordinates()[0]}
                            y={square.getCanvasCoordinates()[1]}
                            imageUrls={piece_styles[square.getPiece().name]}
                            isWhite={square.getPiece().color === "white"}
                            draggedPieceTargetId={
                              this.state.draggedPieceTargetId
                            }
                            onDragStart={this.startDragging}
                            onDragEnd={this.endDragging}
                            id={square.getPieceIdOnThisSquare()}
                            thisPlayerColorIsWhite={this.props.color}
                            playerTurnToMoveIsWhite={
                              this.state.playerTurnToMoveIsWhite
                            }
                            whiteKingInCheck={this.state.whiteKingInCheck}
                            blackKingInCheck={this.state.blackKingInCheck}
                          ></Piece>
                        );
                      }
                      return;
                    })}
                  </React.Fragment>
                );
              })}
            </Layer>
          </Stage>
          {this.state.checkmate && (
            <CheckMateAlertWrapper
              checkmate={this.state.checkmate}
              gameId={this.props.gameId}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const ChessGameWrapper = (props) => {
  const domainName = "http://localhost:8000";
  const color = React.useContext(ColorContext);
  console.log("color", color);
  const { gameid } = useParams();

  const [opponentDidJoinTheGame, setOpponentDidJoinTheGame] =
    React.useState(false);
  console.log("OPPONENT JOINED GAME", opponentDidJoinTheGame);
  const [opponentUserName, setOpponentUserName] = React.useState("");
  const [gameSessionDoesNotExist, setGameSessionDoesNotExist] =
    React.useState(false);

  React.useEffect(() => {
    socket.on("playerJoinedRoom", (statusUpdate) => {
      console.log("A new player has joined the room");
      if (socket.id !== statusUpdate.mySocketId) {
        setOpponentDidJoinTheGame(statusUpdate.mySocketId);
      }
    });

    socket.on("status", (statusUpdate) => {
      if (statusUpdate === "This game session doesn't exist");
      setGameSessionDoesNotExist(true);
    });

    socket.on("start game", (opponentUserName) => {
      console.log("Start game!");
      if (opponentUserName !== props.myUserName) {
        setOpponentUserName(opponentUserName);
        setOpponentDidJoinTheGame(true);
      } else {
        socket.emit("request username", gameid);
      }
    });

    socket.on("give userName", (socketId) => {
      if (socket.id !== socketId) {
        console.log("give userName stage: " + props.myUserName);
        socket.emit("received username", {
          userName: props.myUserName,
          gameId: gameid,
        });
      }
    });

    socket.on("get Opponent UserName", (data) => {
      /* Get opponents username to display in UI.
        Update state to start game when opponent joins the room.
      */
      if (socket.id !== data.socketId) {
        setOpponentUserName(data.userName);
        setOpponentDidJoinTheGame(true);
      }
    });
  }, [gameid, props.myUserName]);

  return (
    <React.Fragment>
      {opponentDidJoinTheGame ? (
        <Container>
          <Row>
            <Col md={3} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <h4>
                  Opponent: {opponentUserName}
                </h4>
                <h4>You: {props.myUserName}</h4>
            </Col>
            <Col md={9}>
              <div style={{ display: "flex ", justifyContent: "center" }}>
                <ChessGame gameId={gameid} color={color.didRedirect}></ChessGame>
              </div>

            </Col>
          </Row>

        </Container>
      ) : gameSessionDoesNotExist ? (
        <div>
          <h1 style={{ textAlign: "center", marginTop: "200px" }}> :( </h1>
        </div>
      ) : (
        <div>
          <h1
            style={{
              textAlign: "center",
              marginTop: String(window.innerHeight / 8) + "px",
            }}
          >
            Hey{" "}
            <strong>
              {props.myUserName}, copy and paste the URL below to send to your
              friend.
            </strong>
          </h1>
          <textarea
            style={{
              marginLeft: String(window.innerWidth / 2 - 290) + "px",
              marginTop: "30px",
              width: "580px",
              height: "30px",
            }}
            onFocus={(event) => {
              event.target.select();
            }}
            value={domainName + "/game/" + gameid}
            type="text"
            readOnly
          ></textarea>
          <br />
          <h1 style={{ textAlign: "center", marginTop: "100px" }}>
            {" "}
            Waiting for other opponent to join the game...{" "}
          </h1>
        </div>
      )}
    </React.Fragment>
  );
};

export default ChessGameWrapper;
