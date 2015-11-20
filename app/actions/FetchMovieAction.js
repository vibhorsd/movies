import AppDispatcher from "../dispatcher/AppDispatcher"
import AppConst from "../constants"

class FetchAction {
    fetch(page) {
        AppDispatcher.dispatch({
            actionType: AppConst.ActionTypes.MOVIE_FETCH,
            page: page
        });
    }
}
var FetchActionObj = new FetchAction();
export default FetchActionObj;
