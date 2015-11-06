import React from "react";
import Home from "./Home";
import MovieStore from "../stores/MovieStore";
import MovieFetchAction from "../actions/FetchMovieAction";
let injectTapEventPlugin = require("react-tap-event-plugin");

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
        this.state = {allMovies : props.allMovies}
    }
    componentDidMount(){
        MovieStore.addChangeListener(this._onChange);
    }
    componentWillUnMount() {
        MovieStore.removeChangeListener(this._onChange);
    }
    /**
    * render
    * @return {XML} markup
    */
    render() {
        return ( < Home allMovies={this.state.allMovies} /> );
    }
    _onChange() {
        this.allMovies = getMovieState();
        this.setState();
    }
}
