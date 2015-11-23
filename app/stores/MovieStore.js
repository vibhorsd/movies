/**
* Created by pushanmitra on 04/11/15.
*/
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"
import request from "sync-request";
import AppConst from "../constants/"
var $ = require ('jquery');

var CHANGE_EVENT = 'change';

class MovieStore extends EventEmitter {
    constructor(){
        super();
        this.searchText = null;
        this.movie;
        this.initial_count;
        this.searchCache = {};
        AppDispatcher.register((action)=> {
            switch(action.actionType) {
                case AppConst.ActionTypes.MOVIE_FETCH:
                var page = action.page;
                this.fetchMovieList(page);
                break;
                case AppConst.ActionTypes.MOVIE_SEARCH :
                var input = action.key;
                this.searchMovies(input);
                break;
                case AppConst.ActionTypes.MOVIE_SEARCH_CLEAR:
                this.searchMovies("");
                break;
                case "UPDATE_LIKE":
                var movie_id = action.movie_id;
                this.updateLike(movie_id);
                break;
                case "UPDATE_DISLIKE":
                var movie_id = action.movie_id;
                this.updateDislike(movie_id);
                break;
                case "FETCH_LIKES_DISLIKES":
                var movie_id = action.movie_id;
                this.fetchLikesDislikes(movie_id);
                break;
                default:
                // no op
            }
            return true; // No errors. Needed by promise in Dispatcher.
        });
        
    }
    
    set initial(obj){
        window.movies = obj.movies;
        this.totalPages = obj.totalPages;
        this.currentPage = obj.currentPage;
    }
    
    fetchMovieList(pageNum){
        var self = this;
        var url = "/fetch?page_num=" + pageNum;
        $.ajax({
            url: url,
            success: function(movieList) {
                for (var idx in movieList) {

                    // Adding it main store object
                    window.movies.push(movieList[idx]);

                    // Removing it from temp search @storage
                    var key = movieList.id + movieList[idx].title;
                    self.searchCache[key] = null;
                    delete  self.searchCache[key];

                }
                self.currentPage = pageNum;
                self.emitChange({showLoading: false});
            },
            error: function(xhr, status, err) {
                console.error("/fetch", status, err.toString());
            }
        });
    }

    updateLike(movie_id) {
        var self = this;
        var url = "/update/likes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(movie) {
		self.movie = movie;
                self.emitLikeChange();
            },
            error: function(xhr, status, err) {
                console.error("/update/likes", status, err.toString());
            }
        });
    }

    updateDislike(movie_id) {
        var self = this;
        var url = "/update/dislikes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(movie) {
                self.movie = movie;
                self.emitLikeChange();
            },
            error: function(xhr, status, err) {
                console.error("/update/dislikes", status, err.toString());
            }
        });
    }
    
    fetchLikesDislikes(movie_id) {
        var self = this;
        var url = "/fetch/likes/dislikes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(value) {
                self.initial_count = value;
	        self.emitInitialCount();
            },
            error: function(xhr, status, err) {
                console.error("/fetch/likes/dislikes", status, err.toString());
            }
        });
    }

    searchRemote(exists) {
        console.log("searching");
        var url = "/search_movie";
        $.post(url,{
            keyword:this.searchText,
            exclude:exists
        } ,function(result){

            //console.dir(result);
            if (result.length > 0) {
                for (var idx in result) {
                    var movie = result[idx];
                    this.searchCache[movie.id + movie.title] = movie;
                }
            }
            this.emitChange({showLoading:false}, false);
        }.bind(this));
    }

    _getSearchCacheMovies(key) {
        var allKeys = Object.keys(this.searchCache);
        //console.dir(allKeys);
        var selectedKeys = allKeys.filter((movie_key)=>{
            return (movie_key.toLowerCase().indexOf(key.toLowerCase()) >= 0)? true: false;
        });
        //console.dir(selectedKeys);

        var searchResult = [];
        var titles = [];
        for(var idx in selectedKeys){
            var id = selectedKeys[idx];
            searchResult.push(this.searchCache[id]);
            titles.push(this.searchCache[id].title);
        }

        return {results: searchResult, titles:titles};

    }

    getAllMovie(searchRemote) {
        if (this.searchText) {
            var movies;
            var titleInMovies = [];
            movies = window.movies.filter((movie)=>{
                return (movie.title.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0)? true: false;
            });
            movies.forEach(function(movie){
                titleInMovies.push(movie.title);
            });

            var searchResultInCache = this._getSearchCacheMovies(this.searchText);

            if (searchRemote && this.searchText.length === 1) {
                this.searchRemote(searchResultInCache.titles.concat(titleInMovies));
            }
            return movies.concat(searchResultInCache.results);
        }
        else {
            return window.movies;
        }
    }

    emitChange(change, searchRemote) {
        var movies = this.getAllMovie(searchRemote);
        change.allMovies = movies;
        change.search = !!this.searchText;
        change.totalPages = this.totalPages;
        change.currentPage = this.currentPage;
        this.emit(CHANGE_EVENT, change);
    }

    emitLikeChange() {
	this.emit(CHANGE_EVENT, this.movie);
    }
    
    emitInitialCount() {
	this.emit('event_count', this.initial_count);
    }

    searchMovies(key){
        var showLoading = false;
        if (key.length > 0) {
            this.searchText = key;
            if (this.searchText.length == 1) {
                showLoading = true;
            }
        }
        else {
            this.searchText = null;
        }
        this.emitChange({showLoading:showLoading}, true);
    }
    /**
    * @param {function} callback
    */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }
    
    addSearchListner(callback){
        this.on(AppConst.StoreEvents.MOVIE_SEARCH, callback);
    }

    addLikeListener(callback) {
	this.on(CHANGE_EVENT, callback);
    }    

    addInitialCountListener(callback) {
	this.on('event_count', callback);
    }
}

var movieStoreObj = new MovieStore();
export default movieStoreObj;
