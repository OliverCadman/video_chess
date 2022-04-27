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
            {!this.state.didGetUserName && (
              <div>
                <h1 style={{ textAlign: "center" }}>
                  Welcome to Chess Video Time
                </h1>
              </div>
            )}
            {this.state.didGetUserName ? (
              <>
                <JoinGame userName={this.state.inputText} isCreator={false} />
                <ChessGame myUserName={this.state.inputText} />
              </>
            ) : (
              <div>
                <h2
                  style={{
                    marginTop: String(window.innerHeight / 2 - 200) + "px",
                    fontFamily: "Work Sans, sans-serif",
                    textAlign: "center",
                  }}
                >
                  Please enter your username:
                </h2>
                <input
                  style={{
                    marginLeft: String(window.innerWidth / 2 - 120) + "px",
                    width: "240px",
                    marginTop: "30px",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                  ref={this.textArea}
                  onInput={this.handleUserName}
                />
                <button
                  className="btn light-button"
                  style={{
                    marginLeft: String(window.innerWidth / 2 - 60) + "px",
                    width: "120px",
                    marginTop: "30px",
                    fontFamily: "Work Sans, sans-serif",
                    fontSize: "1.25rem",
                  }}
                  disabled={!(this.state.inputText.length > 0)}
                  onClick={() => {
                    this.setState({
                      didGetUserName: true,
                    });
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

export default JoinRoom;