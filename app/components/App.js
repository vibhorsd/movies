import React from "react";
import Home from "./Home";
let injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

/**
* Application component
*/
export default class App extends React.Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        return (<Home/>);
    }
}
