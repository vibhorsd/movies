import React from "react";
import {
    Card, CardHeader, Avatar, CardMedia, CardTitle, CardActions, FlatButton,
    CardText, GridList, GridTile, StarBorder, IconButton, Paper
}
from "material-ui";
import AppConst from "../constants";
import LazyLoad from "react-lazy-load";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity: 1.0};
    }
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.movie === nextProps.movie) &&
        (this.state.opacity === nextState.opacity)) {
            return false;
        }
        return true;
    }
    onMouseEnter() {
        this.setState({opacity: 0.7});
    }
    onMouseLeave() {
        this.setState({opacity: 1.0});
    }
    render() {
        var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.movie.poster_path;
        // var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.movie.backdrop_path;
        // var releaseDate = (new Date(this.props.movie.release_date)).toDateString();
        return (
            <LazyLoad height={this.props.height} threshold={10}>
                <Paper
                    zDepth={1}
                    onClick={this.props.onClick}
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onMouseLeave={this.onMouseLeave.bind(this)}>
                    <Card>
                        <CardMedia>
                            <img src={poster_path} style={{opacity: this.state.opacity}}/>
                        </CardMedia>
                        
                    </Card>
                </Paper>
            </LazyLoad>
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
