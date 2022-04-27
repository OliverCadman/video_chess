import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ColorContext } from '../context/colorcontext';
const socket = require("../connections/socket").socket;


class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }

    send = () => {
        const newGameRoomId = uuid();
        this.setState({
            gameId: newGameRoomId
        })

        socket.emit("createNewGame", newGameRoomId);
    }

    typingUserName = () => {
        const typedText = this.textArea.current.value;
        this.setState({
            inputText: typedText
        })
    }

    render() {
        return (
          <React.Fragment>
            <div>
              <h1 style={{ textAlign: "center" }}>
                Welcome to Chess Video Time
              </h1>
            </div>
            {this.state.didGetUserName ? (
              <React.Fragment>
                <Routes>
                  <Route
                    path="*"
                    element={
                      <Navigate replace to={"/game/" + this.state.gameId} />
                    }
                  />
                </Routes>
                <Routes></Routes>
              </React.Fragment>
            ) : (
              <div>
                <h2
                  style={{
                    textAlign: "center",
                    marginTop: String(window.innerHeight / 2 - 200) + "px",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                >
                  Please enter your username:
                </h2>
                <input
                  style={{
                    marginLeft: String(window.innerWidth / 2 - 120) + "px",
                    width: "240px",
                    marginTop: "30px",
                  }}
                  ref={this.textArea}
                  onInput={this.typingUserName}
                />
                <button
                  className="btn light-button"
                  style={{
                    marginLeft: String(window.innerWidth / 2 - 60) + "px",
                    width: "120px",
                    marginTop: "30px",
                    fontSize: "1.25rem",
                  }}
                  disabled={!(this.state.inputText.length > 0)}
                  onClick={() => {
                    this.props.didRedirect();
                    this.props.setUserName(this.state.inputText);
                    this.setState({
                      didGetUserName: true,
                    });
                    this.send();
                  }}
                >
                  Submit
                </button>
              </div>
            )}
          </React.Fragment>
        );
    }

}

const OnBoard = (props) => {
    const color = React.useContext(ColorContext);
    return <CreateNewGame didRedirect={color.playerDidRedirect} setUserName={props.setUserName} gameId={props.gameId}/>
}

export default OnBoard;