import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducer from "./server_reducer"

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

console.log("Store created");

export default store;
