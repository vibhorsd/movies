import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import ReactPaginate from "react-paginate";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");
import InlineCss from "react-inline-css";
import {Paper, AppBar, FlatButton} from "material-ui";
import Waypoint from "react-waypoint";

var $ = require ('jquery');

injectTapEventPlugin();
/*function getMovieState() {
//var ml = MovieStore.getAll();
//console.dir(ml);
return {
allMovies: MovieStore.getAll()
};
}*/
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
        this.state = {allMovies : props.allMovies, totalPages : parseInt(props.totalPages), currentPage: 1};
        
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    _onChange(movies, pageNum) {
        console.log("_onChange...");
        console.dir(movies);
        this.setState({allMovies: movies, currentPage: pageNum});
    }
    
    fetchMovie(pageNumber) {
        console.log("fetchMovie ")
        var pageNumber = pageNumber.selected + 1;
        MovieFetchAction.fetch(pageNumber);
    }
    loadNextPage() {
        if (this.state.currentPage < this.state.totalPages) {
            var nextPage = this.state.currentPage + 1;
            MovieFetchAction.fetch(nextPage);
        }
    }
    waypointEnter() {
        this.loadNextPage();
    }
    waypointExit() {
    }
    /**
    * render
    * @return {XML} markup
    */
    render() {
        console.log("App render")
        var logo = "/images/logo.png";
        return (
            <Paper zDepth={0}>
            <Home allMovies={this.state.allMovies}/>
            <Waypoint
            onEnter={this.boundWaypointEnter}
            onLeave={this.boundWaypointExit}
            threshold={0.2}/>
            </Paper>
        );
    }
    
}
