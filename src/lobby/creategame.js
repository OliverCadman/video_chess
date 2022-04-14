import React from 'react';
// import { Redirect } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
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
        console.log(newGameRoomId);
        this.setState({
            gameId: newGameRoomId
        })

        socket.emit("createNewGame", newGameRoomId);
        console.log(socket);
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
                {/* <Redirect to={"/game/" + this.state.gameId}>
                    <button className="btn btn-success" style={{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Start The Game</button>
                </Redirect> */}
                <div>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 2) - 120) + "px"}}>Your Username:</h1>
                    <input style={{marginLeft: String((window.innerWidth / 2 ) - 120) + "px", width: "240px", marginTop: "62px"}}
                           ref={this.textArea}
                           onInput={this.typingUserName}
                    />
                    <button className="btn btn-primary"
                    style={{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}}
                    disabled={!(this.state.inputText.length > 0)}
                    onClick={() => {
                        console.log("hello")
                        this.props.didRedirect();
                        this.props.setUserName(this.state.inputText);
                        this.setState({
                            didGetUserName: true
                        })
                        this.send()
                    }}>Submit</button>
                </div>
            </React.Fragment>
        )
    }

}

const OnBoard = (props) => {
    const color = React.useContext(ColorContext);
    return <CreateNewGame didRedirect={color.playerDidRedirect} setUserName={props.setUserName} />
}

export default OnBoard;