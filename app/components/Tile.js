import React from "react";
import {
    Card, CardHeader, Avatar, CardMedia, CardTitle, CardActions, FlatButton,
    CardText
}
from "material-ui";
import AppConst from "../constants"

export default class Tile extends React.Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        //console.log("Tile render")
        var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.component.poster_path;
        var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.component.backdrop_path;
        //console.log(poster_path)
        return (
            < Card >
            < CardHeader title = {this.props.component.title}
            avatar = {backdrop_path}/ >
            < CardMedia overlay = { < CardTitle title = "Title"
                subtitle = "Subtitle" / >
            } >
            < img src = {poster_path} / >
            < /CardMedia> < CardTitle title = "Title"
            subtitle = "Subtitle" / >
            < CardActions >
            < FlatButton label = "Action1" / >
            < FlatButton label = "Action2" / >
            < /CardActions> < CardText >
            {this.props.component.overview} < /CardText> < /Card >
        );
    }
}
