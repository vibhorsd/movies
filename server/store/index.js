import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducer from "./server_reducer";
import AppConst from "../constants";
//import {connect} from "./server_actions";

const ACTIONS = AppConst.ACTIONS;
//const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const storeObject = createStore(reducer);

storeObject.dispatch({
    type : ACTIONS.INIT
});

//var connectAction = connect();

console.log("Store created");

export const store = storeObject;
export const storeDispatcher = (action) => {
    storeObject.dispatch(action);
    return storeObject.getState().promises[action.id];
};
