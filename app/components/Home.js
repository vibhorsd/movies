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
        if (Object.keys(this.props.allMovies).length < 1) {
            return null;
        }
        var allMovies = this.props.allMovies;
        var movieList = [];
        
        for (var key in allMovies) {
            movieList.push(<Tile key={key} component= {allMovies[key]} />);
        }
        return ( < div >
            {movieList}
            < /div>
        );
    }
}
