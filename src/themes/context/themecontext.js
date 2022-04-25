import { createContext } from 'react';

/*
    Initialize a React context to provide dark/light theme
    modes at a global level.
*/

export const themes = {
    /*
        Define the two themes "light" and "dark"
    */
    dark: "dark-content",
    light: "white-content",
}

export const ThemeContext = createContext({
    theme: themes.dark,
    changeTheme: () => {},
})