import React from "react";
import {
    Card, CardHeader, Avatar, CardMedia, CardTitle, CardActions, FlatButton,
    CardText, GridList, GridTile, StarBorder, IconButton, Paper,
    FloatingActionButton, FontIcon
}
from "material-ui";
import AppConst from "../constants"
import ComponentGallery from "react-component-gallery";
import MovieFetchAction from "../actions/FetchMovieAction";
import MovieStore from "../stores/MovieStore";

export default class DetailedTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {like_count : 0, dislike_count : 0};
        this._onLikeChange = this._onLikeChange.bind(this);
        this._getInitialCount = this._getInitialCount.bind(this);
    }
    componentDidMount(){
  	var movie_id = this.props.movie.id;
        MovieStore.addInitialCountListener(this._getInitialCount);
        MovieStore.addLikeListener(this._onLikeChange);
	MovieFetchAction.fetchLikesDislikes(movie_id);
    }
    _getInitialCount(initial_count) {
	var like_count = initial_count.likes;
	var dislike_count = initial_count.dislikes;
        this.setState({like_count: like_count, dislike_count: dislike_count});
    }
    _onLikeChange(movie) {
        var like_count = 0;
        var dislike_count = 0;
        if ("likes" in movie) {
	    like_count = movie.likes;
	}
	if ("dislikes" in movie) {
	    dislike_count = movie.dislikes;
	}
        this.setState({like_count: like_count, dislike_count: dislike_count});   
    }
    
    updateLike(movie_id) {
	MovieFetchAction.updateLike(movie_id);        
    }

    updateDislike(movie_id) {
	MovieFetchAction.updateDislike(movie_id);
    }

    /**
	* render
	* @return {ReactElement} markup
    */

    render() {
        var poster_path = AppConst.IMDB_IMG_BASE_URL + "w500/" + this.props.movie.poster_path;
        var backdrop_path = AppConst.IMDB_IMG_BASE_URL + "w300/" + this.props.movie.backdrop_path;
        var releaseDate = (new Date(this.props.movie.release_date)).toDateString();
        var movie_id = this.props.movie.id;
	var likes = this.state.like_count;
	var dislikes = this.state.dislike_count;
	var count = likes - dislikes;

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
			<span>{count !=0?count:""}</span>
                        <FloatingActionButton backgroundColor={"white"} mini={true} label="label" onClick={this.updateLike.bind(this, movie_id)}>
                            <FontIcon
                                className="material-icons"
                                color={"rgb(54,137,227)"}>mood</FontIcon>
                        </FloatingActionButton>
                        <FloatingActionButton backgroundColor={"white"} mini={true} onClick={this.updateDislike.bind(this, movie_id)}>
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
