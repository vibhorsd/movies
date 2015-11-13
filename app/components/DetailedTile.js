import React from "react";
import {
    Card, CardHeader, Avatar, CardMedia, CardTitle, CardActions, FlatButton,
    CardText, GridList, GridTile, StarBorder, IconButton, Paper,
    FloatingActionButton, FontIcon
}
from "material-ui";
import AppConst from "../constants"
import ComponentGallery from "react-component-gallery";

export default class DetailedTile extends React.Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.movie.poster_path;
        var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.movie.backdrop_path;
        var releaseDate = (new Date(this.props.movie.release_date)).toDateString();
        return (
            <GridList
                cols={2}
                padding={1}
                cellHeight={450}>
                <GridTile>
                    <img src={poster_path}/>
                </GridTile>
                <GridTile>
                    <Card style={{height: "100%"}}>
                        <CardHeader
                            title={this.props.movie.title}
                            subtitle={releaseDate}
                            avatar={(backdrop_path && backdrop_path.length > 0 && backdrop_path.indexOf("null") === -1)?backdrop_path:(
                                <Avatar>
                                    {this.props.movie.title.charAt(0)}
                                </Avatar>
                            )
                        }>
                    </CardHeader>
                    <CardText>{this.props.movie.overview}</CardText>
                    <CardActions>
                        <FloatingActionButton backgroundColor={"white"} mini={true}>
                            <FontIcon
                                className="material-icons"
                                color={"rgb(54,137,227)"}>mood</FontIcon>
                        </FloatingActionButton>
                        <FloatingActionButton backgroundColor={"white"} mini={true}>
                            <FontIcon
                                className="material-icons"
                                color={"rgb(253,0,0)"}>mood_bad</FontIcon>
                        </FloatingActionButton>
                    </CardActions>
                </Card>
            </GridTile>
        </GridList>
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
