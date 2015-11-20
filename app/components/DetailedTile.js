import React from "react";
import {
    Card, CardHeader, Avatar, CardActions, CardText, GridList, GridTile,
    FloatingActionButton, FontIcon
} from "material-ui";
import AppConst from "../constants"

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
}
