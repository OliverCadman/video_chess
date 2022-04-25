import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OnBoard from "./lobby/creategame";
import JoinRoom from "./lobby/lobby";
import { ColorContext } from "./context/colorcontext";
import JoinGame from "./lobby/joingame";
import ChessGame from "./chess/ui/chessgame";
import DarkModeSwitch from "./themes/ui/dark_mode_switch";

function App() {
  const [didRedirect, setDidRedirect] = useState(false);
  const [data, setData] = useState(null);

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true);
  }, []);

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false);
  }, []);

  const [userName, setUserName] = React.useState("");

  return (
    <ColorContext.Provider
      value={{
        didRedirect: didRedirect,
        playerDidRedirect: playerDidRedirect,
        playerDidNotRedirect: playerDidNotRedirect,
      }}
    >
    <DarkModeSwitch/>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={<OnBoard setUserName={setUserName} />}
          ></Route>
          {didRedirect ? (
            <Route
              path="/game/:gameid"
              exact
              element={
                <>
                  <JoinGame userName={userName} isCreator={true} />,{" "}
                  <ChessGame myUserName={userName} />
                </>
              }
            />
          ) : (
            <Route
              path="/game/:gameid"
              exact
              element={<JoinRoom data={data} />}
            />
          )}
        </Routes>
      </Router>
    </ColorContext.Provider>
  );
}

export default App;
