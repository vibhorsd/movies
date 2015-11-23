import React from "react";
import {
    Card, CardHeader, Avatar, CardActions, CardText, GridList, GridTile,
    FloatingActionButton, FontIcon, Badge
} from "material-ui";
import AppConst from "../constants"
import MovieFetchAction from "../actions/FetchMovieAction";
import MovieStore from "../stores/MovieStore";

export default class DetailedTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {likeCount: 0, dislikeCoun: 0};
        this._onLikeChange = this._onLikeChange.bind(this);
        this._getInitialCount = this._getInitialCount.bind(this);
    }
    componentDidMount(){
        var movie_id = this.props.movie.id;
        MovieStore.addInitialCountListener(this._getInitialCount);
        MovieStore.addLikeListener(this._onLikeChange);
        MovieFetchAction.fetchLikesDislikes(movie_id);
    }
    _getInitialCount(initialCount) {
        this.setState({likeCount: initialCount.likes, dislikeCount: initialCount.dislikes});
    }
    _onLikeChange(movie) {
        var likeCount = 0;
        var dislikeCount = 0;
        if ("likes" in movie) {
            likeCount = movie.likes;
        }
        if ("dislikes" in movie) {
            dislikeCount = movie.dislikes;
        }
        this.setState({likeCount: likeCount, dislikeCount: dislikeCount});
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
                        <Badge badgeContent={this.state.likeCount} primary={true} badgeStyle={{top:12, right:12, backgroundColor:"rgb(54,137,227)"}}>
                            <FloatingActionButton backgroundColor={"white"} mini={true} label="label" onClick={this.updateLike.bind(this, this.props.movie.id)}>
                                <FontIcon
                                    className="material-icons"
                                    color={"rgb(54,137,227)"}>mood</FontIcon>
                            </FloatingActionButton>
                        </Badge>
                        <Badge badgeContent={this.state.dislikeCount} primary={true} badgeStyle={{top:12, right:12, backgroundColor:"rgb(253,0,0)"}}>
                            <FloatingActionButton backgroundColor={"white"} mini={true} onClick={this.updateDislike.bind(this, this.props.movie.id)}>
                                <FontIcon
                                    className="material-icons"
                                    color={"rgb(253,0,0)"}>mood_bad</FontIcon>
                            </FloatingActionButton>
                        </Badge>
                    </CardActions>
                </Card>
            </GridTile>
        </GridList>
    );
}
}
