import React from 'react';
import {ThemeContext, themes} from '../context/themecontext';

export default function ThemeContextWrapper (props) {
    /* 
        Define a state for theme, and update the state
        in a switch statement within a useEffect, which
        updates whenever the 'theme' dependency is changed.

        Then, return the ThemeContextWrapper as a ThemeContext.Provider
    */
    const [theme, setTheme] = React.useState(themes.dark);

    function changeTheme(theme) {
        setTheme(theme);
    }

    React.useEffect(() => {
        switch (theme) {
            case themes.light:
                document.body.classList.remove("dark-content");
                document.body.classList.add('light-content');
                if (document.querySelector("button")) {
                      document
                        .querySelector("button")
                        .classList.remove("dark-button");
                      document
                        .querySelector("button")
                        .classList.add("light-button");
                }
                break
            case themes.dark:
                document.body.classList.remove("light-content");
                document.body.classList.add("dark-content");
                if (document.querySelector("button")) {
                    document.querySelector("button").classList.remove("light-button");
                    document.querySelector("button").classList.add("dark-button");
                }
                break;
            default:
                document.body.classList.add("dark-content")
                break;
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme: theme, changeTheme: changeTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}
