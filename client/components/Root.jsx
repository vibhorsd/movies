import React from "react";
import {Provider} from "react-redux";
import App from "./App";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducer from "../reducer";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class Root extends React.Component {
    render() {
        return(
            <Provider store={store}><App /></Provider>
        );
    }
}
