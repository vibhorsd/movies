import React from "react";
import Tile from "./Tile";
/**
 * Home page component
 */
export default class Home extends React.Component {
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        return ( < div >
            < Tile / >
            < Tile / >
            < /div>
        );
    }
}
