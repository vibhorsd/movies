import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

var movies_str = document.getElementById("movie-data").innerHTML;
var movies = JSON.parse(movies_str)
ReactDOM.render(<App allMovies={movies}/>, document.getElementById("app"));
