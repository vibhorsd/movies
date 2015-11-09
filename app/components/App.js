import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import ReactPaginate from "react-paginate";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");
import InlineCss from "react-inline-css";

injectTapEventPlugin();
function getMovieState() {
    return {
        allMovies: MovieStore.getAll()
    };
}
/**
* Application component
*/
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {allMovies : props.allMovies, pageNum : 100}
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    _onChange() {
        console.log("page change")
        this.allMovies = getMovieState();
        this.setState();
    }
    /**
    * render
    * @return {XML} markup
    */
    render() {
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
                    <div id="react-paginate" >
                        <ReactPaginate previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={<li className="break"><a href="">...</a></li>}
                            pageNum={this.state.pageNum}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            clickCallback={this._onChange}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} >
                            
                        </ReactPaginate>
                    </div>
                    < Home allMovies={this.state.allMovies} />
                
            </InlineCss>);
        }
        
    }
    