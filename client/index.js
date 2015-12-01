import React from "react";
import {render} from "react-dom";
import App from "./components/App";

import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import {getData} from "./actions";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

render(<Provider store={store}><App /></Provider>, document.getElementById("root"));

store.dispatch(getData(123));
