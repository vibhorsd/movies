import React from "react";
import ReactDOM from "react-dom";
import Home from "./components/Home";

import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import {initData} from "./actions";

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware())(createStore);

const store = createStoreWithMiddleware(reducer);

ReactDOM.render(<Provider store={store}><Home /></Provider>, document.getElementById("app"));

store.dispatch(initData());
