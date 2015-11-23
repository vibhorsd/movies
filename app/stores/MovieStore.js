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
                    window.movies.push(movieList[idx]);
                }
                self.currentPage = pageNum;
                self.emitChange({showLoading: false});
            },
            error: function(xhr, status, err) {
                console.error("/fetch", status, err.toString());
            }
        });
    }
    
    getAllMovie() {
        if (this.searchText) {
            var movies;
            movies = window.movies.filter((movie)=>{
                return (movie.title.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0)? true: false;
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
    
}

var movieStoreObj = new MovieStore();
export default movieStoreObj;
