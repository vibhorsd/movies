/**
* Created by pushanmitra on 04/11/15.
*/
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"
import request from "sync-request";
import AppConst from "../constants/"
var $ = require ('jquery');

var CHANGE_EVENT = 'change';

var movies = []; // collection of movies


class MovieStore extends EventEmitter {
    
    constructor(){
        super();
        this.movies = [];
        AppDispatcher.register((action)=> {
            console.log(" Dispatcher action Type : " + action.actionType)
            switch(action.actionType) {
                case "GET":
                var page = action.page;
                movies = this.update(page);
                console.log("Movies list: " + JSON.stringify(movies))
                //this.emitChange();
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
                //console.dir(movieList)
                self.movies = movieList;
                self.emitChange();
            },
            error: function(xhr, status, err) {
                console.error("/fetch", status, err.toString());
            }
        });
    }
    
    getAllMovie() {
        return this.movies;
    }
    emitChange() {
        this.emit(CHANGE_EVENT, this.movies);
    }
    /**
    * @param {function} callback
    */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }
    
}

var movieStoreObj = new MovieStore();
export default movieStoreObj;
