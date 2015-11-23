import AppDispatcher from "../dispatcher/AppDispatcher"
import AppConst from "../constants"

class FetchAction {
    fetch(page) {
        AppDispatcher.dispatch({
            actionType: AppConst.ActionTypes.MOVIE_FETCH,
            page: page
        });
    }
    updateLike(movie_id) {
        AppDispatcher.dispatch({
	    actionType: "UPDATE_LIKE",
            movie_id: movie_id
        });
    }
    updateDislike(movie_id) {
        AppDispatcher.dispatch({
	    actionType: "UPDATE_DISLIKE",
            movie_id: movie_id
        });
    }
    fetchLikesDislikes(movie_id) {
	AppDispatcher.dispatch({
	    actionType: "FETCH_LIKES_DISLIKES",
            movie_id: movie_id
        });
    }
}
var FetchActionObj = new FetchAction();
export default FetchActionObj;
