import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import request from "sync-request";
import path from "path";
import App from "./components/App";
import AppConst from "./constants/"
import serverCache from "./server_cache"
import app_utl from "./app_utl"
var bodyParser = require('body-parser');

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(function(req, res, next) {
    GLOBAL.navigator = {
        userAgent: req.headers['user-agent']
    };
    next();
});

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.get("/favicon.ico", (req, res) => res.send(""));
app.use(express.static(path.join(path.resolve(__dirname, './'), 'static')));


// Connecting server cache
serverCache.log("Connecting to server cache");
serverCache.connect().then(function(){
    console.log('[Connected]');
    serverCache.log("Server cache [Connected]");
    const port = process.env.PORT || 3000;
    serverCache.cleanCache().then(function(){
        app.listen(port);
        serverCache.log('Movie app server started @ port : ' + port);
    });
},function(err){
    serverCache.error_log("Server cache connection Error:" + err);
});


var get_movies = function(pageNum) {
    console.log("Fetch movie list ......")
    var movies = [];
    var totalPages = 1;
    var cur_year = new Date().getFullYear();
    var movie_url = AppConst.IMDB_BASE_URL + "discover/movie?certification_country=US&certification.lte=PG-13&primary_release_year=" + cur_year + "&api_key=" + AppConst.IMDB_API_KEY + "&page=" + pageNum;
    try {
        var resp = request('GET', movie_url);
        var movieBody = resp.body.toString('utf-8');
        if(movieBody){
            try {
                var movieData = JSON.parse(movieBody);
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
    var pageNum = req.param('page_num');
    var key = "page_" + pageNum;
    
    serverCache.getValue(key).then(function(movieList){
        if(movieList == null){
            var movieInfo = get_movies(pageNum);
            movieList = movieInfo.movies;
            var promise = serverCache.addKey(key,movieList, AppConst.SERVER_CACHE_EXPIRY);
            for (var index in movieList) {
                var movie = movieList[index];
                //console.log(movie["id"] + " : " + movie["title"])
                //var moviePromise = serverCache.addKey(movie["id"],movie, AppConst.SERVER_CACHE_EXPIRY);
                serverCache.addMovie(movie, AppConst.SERVER_CACHE_EXPIRY);
            }
        }        
        res.send(movieList)
    });
});

app.get("/update/likes", (req, res) => {
    var key = req.param('movie_id');
    serverCache.getValue(key).then(function (movie) {
        if ("likes" in movie) {
	    var value = movie["likes"];
            var inc  = value + 1;
	    movie["likes"] = inc;
	    var promise = serverCache.addKey(key,movie, AppConst.SERVER_CACHE_EXPIRY);
	} else {
	    movie["likes"] = 1;
	    var promise = serverCache.addKey(key,movie, AppConst.SERVER_CACHE_EXPIRY);
	}
	
	res.send(movie);
    });
});

app.get("/update/dislikes", (req, res) => {
    var key = req.param('movie_id');
    serverCache.getValue(key).then(function (movie) {
        if ("dislikes" in movie) {
	    var value = movie["dislikes"];
            var inc  = value + 1;
	    movie["dislikes"] = inc;
	    var promise = serverCache.addKey(key,movie, AppConst.SERVER_CACHE_EXPIRY);
	} else {
	    movie["dislikes"] = 1;
	    var promise = serverCache.addKey(key,movie, AppConst.SERVER_CACHE_EXPIRY);
	}
	
	res.send(movie);
    });
});

app.get("/fetch/likes/dislikes", (req, res) => {
    var key = req.param('movie_id');
    var count = {likes: 0,dislikes: 0};
    serverCache.getValue(key).then(function (movie) {
        if ("likes" in movie) {
	    count.likes = movie["likes"];
	} 
        if ("dislikes" in movie) {
	    count.dislikes = movie["dislikes"];
	}
	res.send(count);
    });

});
app.post("/search_movie", (req, res) =>{
    //console.log("***** Search **");
    //console.dir(req.body);
    var excludeMovies = req.body.exclude;
    var searchTitle = req.body.keyword.toLowerCase();
    //console.log("***** search:" + searchTitle);
    if (searchTitle) {
        serverCache.searchMovie(searchTitle).then(function(results){
            //console.dir(results);
            var keys = [];
            if (results.length > 0) {
                //console.dir(results);
                results.forEach(function(searchResult){
                    if (excludeMovies.indexOf(searchResult.title) === -1) {
                        keys.push(searchResult.id);
                    }

                });
                //console.dir(keys);
                if (keys.length > 0) {
                    serverCache.getKeys(keys).then(function(resultsNew){
                        app_utl.logger.info("Search: Sending total:" + resultsNew.length+ ", search:" + searchTitle);
                        res.send(resultsNew);
                    }).fail(function(err){
                        app_utl.logger.error("Search: get Keys error:" + err + ", search :" + searchTitle);
                    });
                }
                else {
                    app_utl.logger.info("Search: No new key:" + searchTitle);
                    res.send([]);
                }
            }
            else {
                app_utl.logger.info("Search: Empty search:" + searchTitle);
                res.send([]);
            }


        }).fail(function(){
            app_utl.logger.error("Search: search_movie error:" + err + ", search:" + searchTitle);
            res.send([]);
        });

    }
    else {
        res.send([]);
    }
});

app.use((req, res) => {
    var key = "page_1";
    var totalPageKey = "total_pages";
    var totalPages = 1;
    serverCache.getValue(key).then(function(movieList){
        serverCache.getValue(totalPageKey).then(function(totalPages){
            if(movieList == null){
                var movieInfo = get_movies(1);
                movieList = movieInfo.movies;
                totalPages = movieInfo.totalPages;
                var promise = serverCache.addKey(key,movieList, AppConst.SERVER_CACHE_EXPIRY);
                var totalPagePromise = serverCache.addKey(totalPageKey, totalPages, AppConst.SERVER_CACHE_EXPIRY);
                for (var index in movieList) {
                    var movie = movieList[index];
                    //console.log(movie["id"] + " : " + movie["title"])
                    //var moviePromise = serverCache.addKey(movie["id"],movie, AppConst.SERVER_CACHE_EXPIRY);
                    serverCache.addMovie(movie, AppConst.SERVER_CACHE_EXPIRY);
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
            markup += ReactDOMServer.renderToString( < App allMovies={movieList} totalPages={totalPages} /> );
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
