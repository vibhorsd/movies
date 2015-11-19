import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import ReactPaginate from "react-paginate";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");
import InlineCss from "react-inline-css";
import {Paper, AppBar, FlatButton, CircularProgress} from "material-ui";
import Waypoint from "react-waypoint";

var $ = require ('jquery');

import SearchBar from "./SearchBar"

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
        this.backup = null;
        this.searchKey = null;
        this.state = {allMovies : props.allMovies, totalPages : parseInt(props.totalPages), currentPage: 1, showLoading: false};
        
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
        MovieStore.addSearchListner(this._onSearch.bind(this));
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    _onChange(movies, pageNum) {
        this.backup = null;
        this.setState({allMovies: movies, currentPage: pageNum, showLoading: false});
    }
    
    _onSearch(value) {
        console.info("Key reach App: " + value + ", serach key:" + this.searchKey);
        if(value.length > 0) {
            var newObj = {}
            if (this.searchKey === value)
            {
                console.info("Wrong");
                return;
            }

            var storeMovie = (movies) => {
                for (var key in movies) {
                    var obj = movies[key];
                    if (obj.title && obj.title.match(new RegExp('^' + value.replace(/\W\s/g, ''), 'i'))) {
                        newObj[key] = obj;
                    }
                }
                if (Object.keys(newObj).length > 0) {

                    this.setState({allMovies: newObj});
                }
            };

            if (this.searchKey && this.searchKey.length < value.length) {
                storeMovie(this.state.allMovies);
            }
            else {
                var movies = MovieStore.getAllMovie();
                storeMovie(movies);
            }
            this.searchKey = value;

        }
        else {
            console.log("Clear");
            this.searchKey = null;
            this.setState({allMovies:MovieStore.getAllMovie()});
            /*if (this.backup) {
                this.setState({allMovies: this.backup});
            }*/
            
        }
    }

    
    fetchMovie(pageNumber) {
        console.log("fetchMovie ")
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
    /**
    * render
    * @return {XML} markup
    */
    render() {
        var logo = "/images/logo.png";
        return (
            <Paper zDepth={0}>
                <AppBar
                    title="World of Movies"
                    style={{margin: "0 0 5px 0"}}
                    iconElementLeft={
                        <div>
                            <SearchBar suggestions={this._getMovieTitles()}/>
                        </div>
                    }/>
                    <Home allMovies={this.state.allMovies}/>
                    <Waypoint
                        onEnter={this.boundWaypointEnter}
                        onLeave={this.boundWaypointExit}
                        threshold={0.1}/>
                    {this.state.showLoading?(
                        <div style={{textAlign: "center"}}>
                            <CircularProgress mode="indeterminate" size={0.5}/>
                        </div>
                    ):null}
                </Paper>
            );
        }
        
    }
    