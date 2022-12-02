import { put, call, takeEvery } from "redux-saga/effects";
import {
    GET_CONTENT_LOOPS,
    GET_PANORAMA_CONTENT_ROUTES,
} from "../../constants";
import {
    loadContentLoops,
    loadContentRoutes,
} from "../actionCreators/panoramaActions";
import { getContentRoutes, getContentLoops } from "../../api/panorama";

export function* getContentRoutesWorker(action) {
    try {
        const {
            lineId,
            date,
            contentType,
        } = action;
        if (date) {
            const payload = yield call(getContentRoutes, {
                lineId,
                date,
                contentType,
            });
            yield put(loadContentRoutes(payload));
        }
    } catch (err) {
        console.warn("getPanoramaConfigWorker", err);
    }
}

export function* watchGetContentRoutes() {
    try {
        yield takeEvery(GET_PANORAMA_CONTENT_ROUTES, getContentRoutesWorker);
    } catch (e) {
        console.warn("watchGetContentRoutes", e);
    }
}

export function* getContentLoopsWorker(action) {
    try {
        const {
            lineId,
            contentType,
        } = action;
        const payload = yield call(getContentLoops, {
            lineId,
            contentType,
        });
        yield put(loadContentLoops(payload));
    } catch (err) {
        console.warn("getContentLoopsWorker", err);
    }
}

export function* watchGetContentLoops() {
    try {
        yield takeEvery(GET_CONTENT_LOOPS, getContentLoopsWorker);
    } catch (e) {
        console.warn("watchGetContentLoops", e);
    }
}

export default null;
