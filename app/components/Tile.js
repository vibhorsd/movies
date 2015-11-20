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
}
