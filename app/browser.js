import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

var moviesDef = [{
    "adult": false,
    "backdrop_path": "/dkMD5qlogeRMiEixC4YNPUvax2T.jpg",
    "genre_ids": [28, 12, 878, 53],
    "id": 135397,
    "original_language": "en",
    "original_title": "Jurassic World",
    "overview": "Twenty-two years after the events of Jurassic Park, Isla Nublar now features a fully functioning dinosaur theme park, Jurassic World, as originally envisioned by John Hammond.",
    "release_date": "2015-06-12",
    "poster_path": "/jjBgi2r5cRt36xF6iNUEhzscEcb.jpg",
    "popularity": 50.019738,
    "title": "Jurassic World",
    "video": false,
    "vote_average": 6.9,
    "vote_count": 2847
}, {
    "adult": false,
    "backdrop_path": "/3Kgu3ys6W6UZWWFty7rlTWgST63.jpg",
    "genre_ids": [28, 12, 878],
    "id": 166424,
    "original_language": "en",
    "original_title": "Fantastic Four",
    "overview": "Four young outsiders teleport to a dangerous universe, which alters their physical form in shocking ways. Their lives irrevocably upended, the team must learn to harness their daunting new abilities and work together to save Earth from a former friend turned enemy.",
    "release_date": "2015-08-07",
    "poster_path": "/g23cs30dCMiG4ldaoVNP1ucjs6.jpg",
    "popularity": 37.10629,
    "title": "Fantastic Four",
    "video": false,
    "vote_average": 4.6,
    "vote_count": 639
}, {
    "adult": false,
    "backdrop_path": "/3Kgu3ys6W6UZWWFty7rlTWgST63.jpg",
    "genre_ids": [28, 12, 878],
    "id": 166424,
    "original_language": "en",
    "original_title": "Fantastic Four",
    "overview": "Four young outsiders teleport to a dangerous universe, which alters their physical form in shocking ways. Their lives irrevocably upended, the team must learn to harness their daunting new abilities and work together to save Earth from a former friend turned enemy.",
    "release_date": "2015-08-07",
    "poster_path": "/g23cs30dCMiG4ldaoVNP1ucjs6.jpg",
    "popularity": 37.10629,
    "title": "Fantastic Four",
    "video": false,
    "vote_average": 4.6,
    "vote_count": 639
}];
var movies = [];
// React.render(<App />, document);
ReactDOM.render(<App allMovies={movies}/>, document.getElementById("app"));
