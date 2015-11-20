import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");
import {Paper, AppBar, CircularProgress, TextField} from "material-ui";
import Waypoint from "react-waypoint";
import SearchMovieAction from "../actions/SearchMovieAction";

injectTapEventPlugin();

/**
* Application component
*/
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.boundLoadNextPage = this.loadNextPage.bind(this);
        this.boundWaypointEnter = this.waypointEnter.bind(this);
        this.boundWaypointExit = this.waypointExit.bind(this);
        this.backup = null;
        this.searchKey = null;
        this.state = {allMovies : props.allMovies?props.allMovies:MovieStore.getAllMovie(), totalPages : parseInt(props.totalPages), currentPage: 1, showLoading: false};
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
        MovieStore.addSearchListner(this._onSearch.bind(this));
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    _validateState(obj){
        if (obj.allMovies && obj.totalPages) {
            return true;
        }
        else {
            return false;
        }
    }
    
    _onChange(change) {
        if (this._validateState(change)){
            this.setState(change);
        }
    }
    
    _onSearch(value) {
    }
    
    fetchMovie(pageNumber) {
        var pageNumber = pageNumber.selected + 1;
        MovieFetchAction.fetch(pageNumber);
    }
    loadNextPage() {
        if (this.state.currentPage < this.state.totalPages) {
            var nextPage = this.state.currentPage + 1;
            this.setState({showLoading: true});
            MovieFetchAction.fetch(nextPage);
        }
    }
    waypointEnter() {
        this.loadNextPage();
    }
    waypointExit() {
    }
    _getMovieTitles () {
        var titles = [];
        for(var key in this.state.allMovies) {
            
            var obj = this.state.allMovies[key];
            if (obj.title){
                titles.push(obj.title);
            }
        }
        return titles;
    }
    onSearch(event) {
        var text = event.target.value;
        if (text && (text.length > 0)) {
            SearchMovieAction.search(text);
        } else {
            SearchMovieAction.clear();
        }
    }
    /**
    * render
    * @return {XML} markup
    */
    render() {
        var logo = "/images/logo.png";
        return (
            <Paper zDepth={0}>
                <AppBar
                    style={{margin: "0 0 5px 0"}}
                    iconElementRight={
                        <div>
                            <TextField
                                hintText="Search for a movie"
                                onChange={this.onSearch.bind(this)}
                                hintStyle={{color: "white"}}
                                inputStyle={{color: "white"}}/>
                        </div>
                    }
                    iconElementLeft={<img src="/images/logo.png"/>}
                    />
                <Home allMovies={this.state.allMovies}/>
                {this.state.search?null:
                    (
                        <Waypoint
                            onEnter={this.boundWaypointEnter}
                            onLeave={this.boundWaypointExit}
                            threshold={0.2}/>
                    )
                }
                {this.state.showLoading?(
                    <div style={{textAlign: "center"}}>
                        <CircularProgress mode="indeterminate" size={0.5}/>
                    </div>
                ):null}
            </Paper>
        );
    }
}
