import { all } from "redux-saga/effects";
import {
    watcherInitialSate,
    watcherResetApp,
} from "./appSagas";
import {
    watcherAllRequests,
} from "./loggerSagas";
import {
    watcherResetUpload,
    watcherUploadStart,
    watcherUploadController,
    watcherRetryUpload,
} from "./uploadSagas";

const watchers = [
    watcherUploadStart(),
    watcherInitialSate(),
    watcherResetApp(),
    watcherResetUpload(),
    watcherAllRequests(),
    watcherUploadController(),
    watcherRetryUpload(),
];

const rootSaga = function* rootSaga() {
    yield all(watchers);
};

export default rootSaga;
