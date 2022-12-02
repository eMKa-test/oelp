import { call, put, takeLatest } from "redux-saga/effects";

import { getData } from "api";

import { USERS_API_URL, GET_OPERATOR } from "Admin/constants";

import { loadOperator } from "Admin/store/actionCreators/generalActions";

function* getOperator() {
    try {
        const data = yield call(getData, {
            mainUrl: `${USERS_API_URL}/my`,
            params: {},
        });
        yield put(loadOperator(data));
    } catch (err) {
        console.warn("Err", err);
        yield put(loadOperator({}));
    }
}

export function* watchGetOperator() {
    try {
        yield takeLatest(GET_OPERATOR, getOperator);
    } catch (e) {
        // ...
    }
}
