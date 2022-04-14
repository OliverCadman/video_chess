import logo from "./logo.svg";
import "./App.css";
import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import OnBoard from "./lobby/creategame";
import JoinRoom from "./lobby/lobby";
import {ColorContext} from "./context/colorcontext";
import JoinGame from "./lobby/joingame";
import ChessGame from "./chess/ui/chessgame";

function App() {
  const [didRedirect, setDidRedirect] = useState(false);

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true);
  }, [])

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false);
  }, [])

  const [userName, setUserName] = React.useState("");
  return (
    <ColorContext.Provider
      value={{
        didRedirect: didRedirect,
        playerDidRedirect: playerDidRedirect,
        playerDidNotRedirect: playerDidNotRedirect,
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={<OnBoard setUserName={setUserName} />}
          ></Route>
          <Route
            path="/game/:gameid"
            exact
            element={
              <>
                didRedirect ? (
                <JoinGame userName={userName} isCreator={true} />
                <ChessGame myUserName={userName} />
                ) : <JoinRoom />
              </>
            }
          />
        </Routes>
      </Router>
    </ColorContext.Provider>
  );
}

export default App;
