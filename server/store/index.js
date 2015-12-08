import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducer from "./server_reducer";
import AppConst from "../constants"

const ACTIONS = AppConst.ACTIONS;
//const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStore(reducer);

store.dispatch({
    type : ACTIONS.INIT
});

console.log("Store created");

export default store;
