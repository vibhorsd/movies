/**
* Created by pushanmitra on 04/11/15.
*/
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"
import request from "sync-request";
import AppConst from "../constants/"
var $ = require ('jquery');

var CHANGE_EVENT = 'change';
var EVENT = 'event';
// var movies = []; // collection of movies


class MovieStore extends EventEmitter {
    constructor(){
        super();
        this.searchText = null;
        this.movie;
        this.initial_count;
        AppDispatcher.register((action)=> {
            console.log(" Dispatcher action Type : " + action.actionType)
            switch(action.actionType) {
                case "GET":
                var page = action.page;
                this.update(page);
                // console.log("Movies list: " + JSON.stringify(movies))
                //this.emitChange();
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
    
    update(pageNum){
        var self = this;
        console.log("ajax call to update")
        var url = "/fetch?page_num=" + pageNum;
        $.ajax({
            url: url,
            success: function(movieList) {
                console.log("succes & setstate : " )
                console.dir(movieList);
                for (var idx in movieList) {
                    window.movies.push(movieList[idx]);
                }
                console.dir(window.movies);
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
        console.log("ajax call to update Like")
        var url = "/update/likes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(movie) {
                console.log("succes");
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
        console.log("ajax call to update disLike")
        var url = "/update/dislikes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(movie) {
                console.log("succes");
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
        console.log("ajax call to display Like dislike");
        var url = "/fetch/likes/dislikes?movie_id=" + movie_id;
        $.ajax({
            url: url,
            success: function(value) {
                console.log("succes");
                self.initial_count = value;
	        self.emitInitialCount();
            },
            error: function(xhr, status, err) {
                console.error("/fetch/likes/dislikes", status, err.toString());
            }
        });
    }

    getAllMovie() {
        if (this.searchText) {
            var movies;
            movies = window.movies.filter((movie)=>{
                return movie.title.match(new RegExp('^' + this.searchText.replace(/\W\s/g, ''), 'i'))
            });
            return movies;
        }
        else
        return window.movies;
    }

    emitChange(change) {
        var movies = this.getAllMovie();
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
        if (key.length > 0) {
            this.searchText = key;
        }
        else
        this.searchText = null;
        this.emitChange({showLoading:true});
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
