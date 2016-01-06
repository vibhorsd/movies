import React from "react";
import {render} from "react-dom";
import Root from "./components/Root";
import {Router, browserHistory} from "react-router";
import AppRoute from "./components/AppRoutes"



render(<Router history={browserHistory}>{AppRoute}</Router>, document.getElementById("root"));
