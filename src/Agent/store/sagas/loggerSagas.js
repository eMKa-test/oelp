import { put, takeEvery } from "redux-saga/effects";
import { UploadActions } from "../actionsCreator/uploadActions";
import { addLog } from "../actionsCreator/loggerActions";

export function* allRequestsWorker(params) {
    try {
        yield put(addLog(JSON.stringify(params.payload)));
    } catch (err) {
        warn("allRequestsWorker", err);
    }
}

export function* watcherAllRequests() {
    try {
        yield takeEvery([
            UploadActions.UPLOAD_SUCCESS,
            UploadActions.UPLOAD_FAILURE,
        ], allRequestsWorker);
    } catch (err) {
        warn("watcherAllRequests", err);
    }
}
