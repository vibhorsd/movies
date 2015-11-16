import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import request from "sync-request";
import path from "path";
import App from "./components/App";
import AppConst from "./constants/"
import serverCache from "./server_cache"
import app_utl from "./app_utl"

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.get("/favicon.ico", (req, res) => res.send(""));
app.use(express.static(path.join(path.resolve(__dirname, './'), 'static')));


// Connecting server cache
serverCache.log("Connecting to server cache");
serverCache.connect().then(function(){
    console.log('[Connected]');
    serverCache.log("Server cache [Connected]");
    const port = process.env.PORT || 3000;
    app.listen(port);
    serverCache.log('Movie app server started @ port : ' + port);
    
},function(err){
    serverCache.error_log("Server cache connection Error:" + err);
});

var get_movies = function(pageNum) {
    console.log("Fetch movie list ......")
    var movies = [];
    var totalPages = 1;
    var cur_year = new Date().getFullYear();
    var movie_url = AppConst.IMDB_BASE_URL + "discover/movie?primary_release_year=" + cur_year + "&api_key=" + AppConst.IMDB_API_KEY + "&page=" + pageNum;
    //console.log("movie_url : " + movie_url)
    try {
        var resp = request('GET', movie_url);
        var movieBody = resp.body.toString('utf-8');
        if(movieBody){
            try {
                
                var movieData = JSON.parse(movieBody);
                //console.log("movieData : " + JSON.stringify(movieData))
                movies = movieData.results;
                totalPages = movieData.total_pages;
            } catch (err) {
                console.log("PARSE ERR : " + err)
            }
        }
    } catch (err) {
        console.log("GET ERR : " + err)
    }
    return {movies : movies, totalPages: totalPages}
}

app.get("/fetch", (req, res) => {
    //console.dir(req.params)
    var pageNum = req.param('page_num');
    var key = "page_" + pageNum;
    serverCache.getValue(key).then(function(movieList){
        //console.log("movieList : " + JSON.stringify(movieList))
        if(movieList == null){
            var movieInfo = get_movies(pageNum);
            movieList = movieInfo.movies;
            var promise = serverCache.addKey(key,movieList, AppConst.SERVER_CACHE_EXPIRY);
            for (var index in movieList) {
                var movie = movieList[index];
                //console.log(movie["id"] + " : " + movie["title"])
                var moviePromise = serverCache.addKey(movie["id"],movie, AppConst.SERVER_CACHE_EXPIRY);
            }
        }
        
        res.send(movieList)
    });
});
app.use((req, res) => {
    var key = "page_1";
    var totalPageKey = "total_pages";
    var totalPages = 1;
    serverCache.removeKey(key);
    serverCache.getValue(key).then(function(movieList){
        serverCache.getValue(totalPageKey).then(function(totalPages){
            if(movieList == null){
                var movieInfo = get_movies(1);
                movieList = movieInfo.movies;
                totalPages = movieInfo.totalPages;
                //console.log("totalPages : " + totalPages)
                var promise = serverCache.addKey(key,movieList, AppConst.SERVER_CACHE_EXPIRY);
                var totalPagePromise = serverCache.addKey(totalPageKey, totalPages, AppConst.SERVER_CACHE_EXPIRY);
                for (var index in movieList) {
                    var movie = movieList[index];
                    //console.log(movie["id"] + " : " + movie["title"])
                    var moviePromise = serverCache.addKey(movie["id"],movie, AppConst.SERVER_CACHE_EXPIRY);
                }
            }
            
            var markup = "<!DOCTYPE html>";
            markup += "<html>";
            markup += "<head>";
            markup += "<title>Movies app</title>";
            markup += "<link href='https://fonts.googleapis.com/css?";
            markup += "family=Roboto:400,300,500' rel='stylesheet' type='text/css'>";
            markup += "<link href=\"https://fonts.googleapis.com/icon?";
            markup += "family=Material+Icons\" rel=\"stylesheet\">";
            markup += "</head>";
            markup += "<body>";
            markup += "<div id=\"app\" class=\"container\">";
            // disabled server side rendering because of https://github.com/callemall/material-ui/issues/2119
            // following can be uncommented if this issue gets fixed
            // markup += ReactDOMServer.renderToString( < App allMovies={movieList} totalPages={totalPages} /> );
            markup += "</div>";
            markup += "<script id=\"movie-data\">" + JSON.stringify(movieList) + "</script>"
            markup += "<script id=\"total-pages-data\">" + totalPages + "</script>"
            markup += "<script src=\"bundle.js\"></script>";
            markup += "</body>";
            markup += "</html>";
            
            res.send(markup);
        });
    });
});
