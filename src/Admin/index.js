import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "@coreui/icons/css/all.css";
import "rc-pagination/assets/index.css";
import "rc-select/assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "react-dragula/dist/dragula.min.css";
import "../assets/fonts/Fontello/fontello-1.css";
import "../assets/fonts/Fontello/fontello-2.css";
import "../assets/fonts/Fontello/fontello-3.css";
import "../assets/fonts/Fontello/fontello-4.css";
import "../assets/fonts/Roboto/Roboto.css";
import "../style/style.css";

import "../style/site-loader.css";
import "./coreui.css";

import "./styles.css";
import localStorage from "redux-persist/lib/storage";
import store, { persistor } from "./store";
import { GET_OPERATOR } from "./constants";

import Admin from "./Admin";

const onBeforeLift = () => {
    store.dispatch({
        type: GET_OPERATOR,
    });
};

document.documentElement.className += "ontouchstart" in document.documentElement ? "touch" : "no-touch";

const App = () => {
    React.useEffect(() => {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (!key.includes(__APP_VERSION__)) {
                localStorage.removeItem(key);
            }
        }
        document.querySelector(".spinner__wrapper").style.opacity = 0;
        document.querySelector(".spinner__wrapper").style.visibility = "hidden";
    }, []);

    return (
        <React.Fragment>
            <ToastContainer
                autoClose={2000}
                hideProgressBar
                draggable={false} />
            <Provider store={store}>
                <PersistGate
                    loading={null}
                    onBeforeLift={onBeforeLift}
                    persistor={persistor}>
                    <BrowserRouter>
                        <Admin />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </React.Fragment>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
