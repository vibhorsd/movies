import React from "react";
import Tile from "./Tile";
import {
    GridList
}
from "material-ui";
/**
* Home page component
*/
export default class Home extends React.Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        /*if (Object.keys(this.props.allMovies).length < 1) {
        return null;
        }*/
        var allMovies = this.props.allMovies;
        var movieList = [];
        
        for (var key in allMovies) {
            var movie = allMovies[key];
            if(movie.poster_path != null){
                movieList.push(<Tile key={key} component= {movie} />);
            }
        }
        return ( < div >
            <GridList cellHeight={500} cols={3} padding={1} style={{ overflowY: 'auto'}} >
                {movieList}
            </GridList>
            </ div>
        );
    }
}
