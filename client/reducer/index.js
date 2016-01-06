import Immutable from "immutable"
import { ACTIONS } from "../actions"

const STATE_KEYS = {
    MOVIES : "MOVIES",
    CURRENT_PAGE : "CURRENT_PAGE",
    TOTAL_PAGE : "TOTAL_PAGE",
    TITLES_ID_INDICES : "SEARCH_TITLES"
}

/**
* Structure of state
* @key : MOVIES : Map of movie json objects
* @key : CURRENT_PAGE : Current Page of application
* @key : TOTAL_PAGE : Total pages available
* @key : TITLES_ID_INDICES : Index set for quick searching
*/
const initialState = Immutable.Map({});


export default function reducer(state = initialState, action) {
    switch(action.type) {
        case "GET_DATA":
        return {
            data: action.data
        };
        case "GET_DATA_PENDING":
        return {
            data: null,
            pending: true
        };
        case ACTIONS.INIT :
        const movies = action.data.movies;
        const currentPage = action.data.currentPage;
        
        
        default:
        return state;
    }
}
