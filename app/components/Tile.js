import React from "react";
import {
    Card, CardHeader, Avatar, CardMedia, CardTitle, CardActions, FlatButton,
    CardText, GridList, GridTile, StarBorder, IconButton, Paper
}
from "material-ui";
import AppConst from "../constants"

export default class Tile extends React.Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.movie.poster_path;
        // var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.movie.backdrop_path;
        // var releaseDate = (new Date(this.props.movie.release_date)).toDateString();
        return (
            <Paper zDepth={1} onClick={this.props.onClick}>
                <Card>
                    <CardMedia>
                        <img src={poster_path}/>
                    </CardMedia>
                    
                </Card>
            </Paper>
        );
    }
    //     render() {
    //         var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.component.poster_path;
    //         var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.component.backdrop_path;
    //         //console.log(poster_path)
    //
    //         return(<GridTile style={{ overflowY: 'auto'}}>
    //         < Card >
    //         < CardHeader title = {this.props.component.title} avatar = {backdrop_path} />
    //
    //     < CardMedia overlay = { < CardTitle title = {this.props.component.title} />} >
    //     < img src = {poster_path} />
    // </ CardMedia>
    // < CardActions >
    // < FlatButton label = "Like" />
    // < FlatButton label = "Dislike" />
    // </ CardActions>
    // < CardText >
    // {this.props.component.overview}
    // </ CardText>
    // </ Card>
    // </GridTile>);
    // }
}
