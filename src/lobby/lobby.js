import React from 'react';
import JoinGame from './joingame';
import ChessGame from '../chess/ui/chessgame';

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();

    }

    handleUserName = () => {
        const typedText = this.textArea.current.value;
        console.log(typedText);
        this.setState({
            inputText: typedText
        })
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.didGetUserName ? 
                    <>
                        <JoinGame userName={this.state.inputText} isCreator = {false} />
                        <ChessGame myUserName = {this.state.inputText} />
                    </>
                    :
                    <div>
                        <h1 style={{ textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Your Username:</h1>
                        <input style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px"}} 
                               ref = {this.textArea}
                               onInput = {this.handleUserName}
                        />
                        <button className="btn btn-primary" 
                                style={{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}}
                                disabled={!(this.state.inputText.length > 0)}
                                onClick={() => {
                                    this.setState({
                                        didGetUserName: true
                                    })
                                }}>
                                    Submit
                                </button>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default JoinRoom;