import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    loadActive,
    loadInitialState,
    loadUser,
    loadProjects,
    GET_INITIAL_STATE,
    RESET_STATE,
    resetApp,
} from "../actionsCreator/appActions";
import { getContentSets, getAuth, getProjects } from "../../api";
import { declinationWord } from "../../common/helpers";

function* getContentSetsWorker() {
    try {
        const payload = yield call(getContentSets);
        if (payload.length) {
            const msg = `Есть не догруженный контент!
            ${declinationWord(payload.length, ["сет", "сета", "сетов"])}.
            `;
            toast.info(msg, {
                autoClose: 1500,
                position: "top-center",
            });
        }
        yield put(loadInitialState(payload));
    } catch (err) {
        warn("getContentSetsWorker", err);
    }
}

function* getProjectsWorker() {
    try {
        const payload = yield call(getProjects);
        yield put(loadProjects(payload));
    } catch (err) {
        warn("getProjectsWorker", err);
    }
}

function* getAuthWorker() {
    return yield call(getAuth);
}

function* getInitialSateWorker() {
    try {
        yield put(loadActive(true));
        const user = yield call(getAuthWorker);
        if (!user) {
            window.location.href = "/login?isAgent='false'";
        } else {
            yield put(loadUser(user));
            yield call(getProjectsWorker);
            yield call(getContentSetsWorker);
        }
    } catch (err) {
        warn("getInitialSate", err);
    } finally {
        yield put(loadActive(false));
    }
}

export function* watcherInitialSate() {
    try {
        yield takeLatest(GET_INITIAL_STATE, getInitialSateWorker);
    } catch (err) {
        warn("watcherInitialSate", err);
    }
}

function* resetWorker() {
    try {
        yield put(resetApp());
        yield call(getInitialSateWorker);
    } catch (err) {
        warn("watcherInitialSate", err);
    }
}

export function* watcherResetApp() {
    try {
        yield takeLatest(RESET_STATE, resetWorker);
    } catch (err) {
        warn("watcherResetApp", err);
    }
}
