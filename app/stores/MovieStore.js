/**
 * Created by pushanmitra on 04/11/15.
 */
import AppDispatcher from "../dispatcher/AppDispatcher"
import EventEmitter  from "events"

class MovieStore extends EventEmitter {

}

var movieStoreObj = new MovieStore();
export default movieStoreObj;
