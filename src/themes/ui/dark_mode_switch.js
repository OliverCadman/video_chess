import React from 'react';
import {Form} from 'react-bootstrap';
import styled from 'styled-components';
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext, themes } from '../context/themecontext';

const StyledFlexWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  margin-right: 24px;
`;

const DarkModeSwitch = () => {
  /* Render UI for checkbox switch for dark/light mode 
  
    Define a state for dark mode and toggle state
    whenever the checkbox switch is clicked. Then, call
    ThemeContext's 'changeTheme()' function, passing in
    the updated state as argument.
  */
  const [darkMode, setDarkMode] = React.useState(true);
  return (
    <>
      <StyledFlexWrapper>
        <DarkModeIcon
          style={darkMode ? { color: "#e7782d", fontSize: "2rem", marginRight: ".5rem" } : { color: "aaa", fontSize: "2rem", marginRight: ".5rem" }}
        />
        <ThemeContext.Consumer>
          {({ changeTheme }) => (
            <Form.Check
              type="switch"
              onClick={() => {
                console.log("click");
                setDarkMode(!darkMode);
                changeTheme(darkMode ? themes.light : themes.dark);
              }}
            />
          )}
        </ThemeContext.Consumer>
        <LightModeIcon
          style={darkMode ? { color: "#aaa", fontSize: "2rem" } : { color: "#e7782d", fontSize: "2rem" }}
        />
      </StyledFlexWrapper>
    </>
  );
}

export default DarkModeSwitch