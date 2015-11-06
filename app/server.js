import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import request from "sync-request";
import path from "path";
import App from "./components/App";
import AppConst from "./constants/"

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.get("/favicon.ico", (req, res) => res.send(""));

var get_movies = function() {
    var movies = [];
    var cur_year = new Date().getFullYear();
    var movie_url = AppConst.IMDB_BASE_URL + "discover/movie?primary_release_year=" + cur_year + "&api_key=" + AppConst.IMDB_API_KEY;
    
    try {
        var resp = request('GET', movie_url);
        var movieBody = resp.body.toString('utf-8');
        if(movieBody){
            try {
                
                var movieData = JSON.parse(movieBody);
                //console.log("movieData : " + JSON.stringify(movieData))
                movies = movieData.results;
                
            } catch (err) {
                console.log("PARSE ERR : " + err)
            }
        }
    } catch (err) {
        console.log("GET ERR : " + err)
    }
    return movies
}

app.use((req, res) => {
    var movies = get_movies();
    //console.log("Movies : " + JSON.stringify(movies))
    
    var markup = "<!DOCTYPE html>";
    markup += "<html>";
    markup += "<head>";
    markup += "<title>Movies app</title>";
    markup += "<link href='https://fonts.googleapis.com/css?";
    markup += "family=Roboto:400,300,500' rel='stylesheet' type='text/css'>";
    markup += "</head>";
    markup += "<body>";
    markup += "<div id=\"app\" class=\"container\">";
    markup += ReactDOMServer.renderToString( < App allMovies={movies} /> );
    markup += "</div>";
    markup += "<script id=\"movie-data\">" + JSON.stringify(movies) + "</script>"
    markup += "<script src=\"bundle.js\"></script>";
    markup += "</body>";
    markup += "</html>";
    
    res.send(markup);
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Movie app server started @ port : ' + port);
