/**
* Created by pushanmitra on 04/11/15.
*/
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"
import request from "sync-request";
import AppConst from "../constants/"
var $ = require ('jquery');

var CHANGE_EVENT = 'change';

// var movies = []; // collection of movies


class MovieStore extends EventEmitter {
    
    constructor(){
        super();
        this.searchText = null;
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
                default:
                // no op
            }
            return true; // No errors. Needed by promise in Dispatcher.
        });
        
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
                self.emitChange({pageNumber:pageNum});
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
                return movie.title.match(new RegExp('^' + this.searchText.replace(/\W\s/g, ''), 'i'))})

            if (movies.length > 0) {
                return movies;
            }
            else {
                return window.movies;
            }
        }
        else
            return window.movies;
    }
    emitChange(change) {
        
        var movies = this.getAllMovie();
        change.movies = movies;
        if (this.searchText) {
            change.search = true;
        }
        this.emit(CHANGE_EVENT, change);
    }

    searchMovies(key){
        if (key.length > 0) {
            this.searchText = key;
        }
        else
            this.searchText = null;
        this.emitChange({});
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
