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
	    actionType: AppConst.ActionTypes.UPDATE_MOVIE_LIKE,
            movie_id: movie_id
        });
    }
    updateDislike(movie_id) {
        AppDispatcher.dispatch({
	    actionType: AppConst.ActionTypes.UPDATE_MOVIE_DISLIKE,
            movie_id: movie_id
        });
    }
    fetchLikesDislikes(movie_id) {
	AppDispatcher.dispatch({
	    actionType: AppConst.ActionTypes.FETCH_LIKES_DISLIKES,
            movie_id: movie_id
        });
    }
}
var FetchActionObj = new FetchAction();
export default FetchActionObj;
