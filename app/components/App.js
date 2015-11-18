import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import ReactPaginate from "react-paginate";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");
import InlineCss from "react-inline-css";
import {AppBar} from "material-ui";
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
        this.backup = null;
        this.state = {allMovies : props.allMovies, pageNum : parseInt(props.totalPages)};
        
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
        MovieStore.addSearchListner(this._onSearch.bind(this));
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    _onChange(movies) {
        console.log("_onChange...");
        this.backup = null;
        this.setState({allMovies: movies});
    }

    _onSearch(value) {
        console.info("Key reach App: " + value);
        if(value.length > 0) {
            var newObj = {}
            for (var key in this.state.allMovies) {
                var obj = this.state.allMovies[key];
                if (obj.title && obj.title === value) {
                    newObj[key] = obj;
                }
            }

            if (Object.keys(newObj).length > 0) {
                this.backup = this.state.allMovies;
                this.setState({allMovies: newObj});
            }
        }
        else {
            console.log("Will re render through backup");
            if (this.backup) {
                this.setState({allMovies: this.backup});
            }

        }
    }
    
    fetchMovie(pageNumber) {
        console.log("fetchMovie ")
        var pageNumber = pageNumber.selected + 1;
        MovieFetchAction.fetch(pageNumber);
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
        console.log("App render")
        var logo = "/images/logo.png";
        return (
            <InlineCss stylesheet={`
                    #react-paginate ul {
                        display: inline-block;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    #react-paginate li {
                        padding: 5px;
                        display: inline-block;
                    }
                    
                    #react-paginate .break a {
                        cursor: default;
                    }
                    `}>
                    <AppBar
                        title="World of Movies"
                        style={{margin: "0 0 5px 0"}}
                        iconElementLeft={
                            <div>
                            <SearchBar suggestions={this._getMovieTitles()}/>
                            </div>
                        }
                        iconElementRight={<div id="react-paginate" >
                            <ReactPaginate previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={<li className="break"><a href="">...</a></li>}
                                pageNum={this.state.pageNum}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={2}
                                clickCallback={this.fetchMovie}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"} >
                                
                            </ReactPaginate>
                        </div>}
                        />
                    < Home allMovies={this.state.allMovies} />
                
            </InlineCss>);
        }
        
    }
    