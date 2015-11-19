import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import MovieStore from "./stores/MovieStore"

var movies_str = document.getElementById("movie-data").innerHTML;
var totalPages = document.getElementById("total-pages-data").innerHTML;
MovieStore.initial = {
    movies: JSON.parse(movies_str),
    totalPages: totalPages,
    currentPage: 1
}
ReactDOM.render(<App allMovies={null} totalPages={totalPages}/>, document.getElementById("app"));
