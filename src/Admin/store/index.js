import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import get from "lodash/get";
import sagaMiddlewareFactory from "redux-saga";

import reducers from "Admin/store/reducers";
import rootSaga from "Admin/store/sagas";

const setTransform = createTransform(
    (inboundState) => {
        return {
            ...inboundState,
            contentType: get(inboundState, "contentType"),
            load: true,
            loadPagination: true,
        };
    },
    (outboundState) => {
        return outboundState;
    },
    {
        whitelist: ["content"],
    },
);

const persistConfig = {
    key: `Sfera_Admin:${__APP_VERSION__}`,
    storage: localStorage,
    whiteList: [],
    blacklist: [
        "navigation",
        "router",
        "routes",
        "general",
        "map",
        "panorama",
        // "objects",
        // "users",
        // "currentObject",
        // "currentLine",
        // "general",
    ],
    transforms: [setTransform],
};

const persistedReducers = persistReducer(persistConfig, reducers);

const sagaMiddleware = sagaMiddlewareFactory();

// eslint-disable-next-line
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(persistedReducers, composeEnhancers(applyMiddleware(sagaMiddleware)));
const persistor = persistStore(store);

export { persistor };
export default store;

sagaMiddleware.run(rootSaga);
