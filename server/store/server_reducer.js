import ServerState from "./ServerState";
import AppConst from "../constants";

const ACTIONS = AppConst.ACTIONS;

const stateObj = {
    cache : new ServerState(),
    promises : {}
};

const clearPromise = (promise, state, id) => {
    promise.then((value) => {
        state.promises[id] = null;
    }).catch(() => {
        state.promises[id] = null;
    })
}

const addPromise = (state, id, promise) => {
    if (id) {
        state.promises[id] = promise;
        clearPromise(promise, state, id);
    }
}

export default function reducer (state = stateObj, action) {
    switch(action.type) {
        case ACTIONS.INIT:
        return state;
        case ACTIONS.CONNECT:
        addPromise(state, action.id, state.cache.connect());
        return state;
        case ACTIONS.FETCH:
        addPromise(state, action.id, state.cache.page(action.pageNum));
        return state;
        case ACTIONS.SEARCH:
        return state;
        case ACTIONS.FETCH_LIKES_DISLIKES:
        return state;
        case ACTIONS.LIKE:
        return state;
        case ACTIONS.DISLIKE:
        return state;
        case ACTIONS.CLAER_ACTION:
        if (action.id) {
            state[action.id] = null;
        }
        return state;
        default:
        return state;
    }
}
