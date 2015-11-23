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
                this.emitChange({showLoading:false}, false);
            }
        }.bind(this));
    }

    _getSearchCacheMovies(key) {
        var allKeys = Object.keys(this.searchCache);

        var selectedKeys = allKeys.filter((movie_key)=>{
            return movie_key.match(new RegExp('^' + key.replace(/\W\s/g, ''), 'i'));
        });

        var searchResult = [];
        var titles = [];
        for(var id in selectedKeys){
            searchResult.push(this.searchCache[id]);
            keys.push(this.searchCache[id].title);
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

            if (searchRemote) {
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
    
    searchMovies(key){
        if (key.length > 0) {
            this.searchText = key;
        }
        else {
            this.searchText = null;
        }
        this.emitChange({showLoading:true}, true);
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
