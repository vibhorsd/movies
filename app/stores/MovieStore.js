/**
* Created by pushanmitra on 04/11/15.
*/
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"

var CHANGE_EVENT = 'change';

var movies = {}; // collection of movies

class MovieStore extends EventEmitter {
    
    constructor(){
        super();
        AppDispatcher.register((action)=> {
            
            console.log("Dispatcher action....");
            console.dir(action)
            // add more cases for other actionTypes, like TODO_UPDATE, etc.
            //var curMovies = movies;
            //movies = curMovies.concat(action.movies);
            movires = action.movies;
            MovieStore.emitChange();
            
            return true; // No errors. Needed by promise in Dispatcher.
        });
        
    }
    getAll() {
        return movies;
    }
    emitChange() {
        this.emit(CHANGE_EVENT);
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
