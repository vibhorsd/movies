/**
 * Created by pushanmitra on 18/11/15.
 */

import AppDispatcher from "../dispatcher/AppDispatcher";
import Const from "../constants"

class SearchMovieAction {
    search(input){
        AppDispatcher.dispatch({
            actionType:Const.ActionTypes.MOVIE_SEARCH,
            key: input
        });
    }
    clear(){
        AppDispatcher.dispatch({
            actionType:Const.ActionTypes.MOVIE_SEARCH_CLEAR
        });
    }
}

export default new SearchMovieAction();