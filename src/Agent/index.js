import React, { Fragment, useEffect } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import Layout from "./layout";
import store from "./store";
import cacheImages from "./common/cacheImages";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import "rc-select/assets/index.css";
import "./style.css";

const Agent = () => {
    useEffect(() => {
        cacheImages();
    }, []);

    return (
        <Fragment>
            <ToastContainer
                autoClose={2000}
                hideProgressBar
                draggable={false}/>
            <Provider store={store}>
                <Router>
                    <Layout/>
                </Router>
            </Provider>
        </Fragment>
    );
};

render(
    <Agent/>,
    document.getElementById("root"),
);
