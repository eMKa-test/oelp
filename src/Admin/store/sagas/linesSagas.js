import {
    call, put, takeLatest, select,
} from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    OBJECTS_API_URL,
    PUT_LINE,
    GET_LINE_BY_ID,
    GET_OBJECT_BY_ID,
    GET_LINE_SCHEME,
    DELETE_LINE_SCHEME,
    UPLOAD_LINE_SCHEME,
    SET_POINTS_LINE_SCHEME,
} from "../../constants";
import { getData, postData, delData } from "../../../api";
import {
    fetchLineSchemes, uploadLineScheme, deleteLineSchemes, updateLineSchemePoints,
} from "../../api/lineScheme";
import { getObjects } from "../actionCreators/objectsActions";
import {
    loadLineByID,
    loadLineSchemes,
    getLineSchemes,
    addLineSchemes,
    removeLineSchemes,
    loadPointsLineScheme,
} from "../actionCreators/linesActions";

function* updateLineSchemePointsWorker({ points }) {
    try {
        const res = yield call(updateLineSchemePoints, points);
        yield put(loadPointsLineScheme(res));
    } catch (e) {
        warn(e, "saga: updateLineSchemePointsWorker");
    }
}

export function* watchUpdateLineSchemePoints() {
    yield takeLatest(SET_POINTS_LINE_SCHEME, updateLineSchemePointsWorker);
}

function* deleteLineSchemesWorker({
    schemeId,
    callback,
}) {
    try {
        yield call(deleteLineSchemes, schemeId);
        yield put(removeLineSchemes(schemeId));
        callback();
    } catch (e) {
        warn(e, "saga: deleteLineSchemesWorker");
    }
}

export function* watchDeleteLineSchemes() {
    yield takeLatest(DELETE_LINE_SCHEME, deleteLineSchemesWorker);
}

function* uploadLineSchemeWorker({
    lineId,
    date,
    file,
    contentType,
    callback,
}) {
    try {
        const scheme = yield call(uploadLineScheme, {
            lineId,
            date,
            file,
            contentType,
        });
        yield put(addLineSchemes(scheme));
        callback();
    } catch (e) {
        warn(e, "saga: uploadLineSchemeWorker");
    }
}

export function* watchUploadLineScheme() {
    try {
        yield takeLatest(UPLOAD_LINE_SCHEME, uploadLineSchemeWorker);
    } catch (e) {
        warn(e, "saga: watchUploadLineScheme");
    }
}

function* getLineSchemesWorker({ lineId }) {
    try {
        const contentType = yield select((store) => store.content.contentType);
        const lineSchemes = yield call(fetchLineSchemes, {
            lineId,
            contentType,
        });
        yield put(loadLineSchemes(lineSchemes));
    } catch (e) {
        warn(e, "saga: getLineSchemesWorker");
    }
}

export function* watchGetLineSchemes() {
    try {
        yield takeLatest(GET_LINE_SCHEME, getLineSchemesWorker);
    } catch (e) {
        warn(e, "saga: watchGetLineSchemes");
    }
}

function* getLineByID(action) {
    try {
        const data = yield call(getData, {
            mainUrl: `${OBJECTS_API_URL}/${action.objectID}/lines/${action.id}`,
        });
        yield put(loadLineByID(data.payload));
        yield put(getLineSchemes(action.id));
    } catch (e) {
        warn(e, "saga: getLineByID");
    }
}

export function* watchGetLineByID() {
    try {
        yield takeLatest(GET_LINE_BY_ID, getLineByID);
    } catch (e) {
        // ...
    }
}

function* putLine(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${OBJECTS_API_URL}/${action.objectID}/lines/${action.line.id || ""}`,
            body: action.line,
            params: action.params,
        });
        if (action.updateObjects) {
            yield put(getObjects({ limit: 9999999 }));
        }
        if (!action.line.id) {
            yield put({
                type: GET_OBJECT_BY_ID,
                id: action.objectID,
            });
        } else {
            yield put(loadLineByID(data.payload));
        }
        if (typeof action.callback === "function") {
            action.callback();
        }
        toast.success("Изменения сохранены");
    } catch (e) {
        if (e.response.status === 409) {
            toast.error("Данное имя отрезка уже существует. Выберите другое имя", { autoClose: 4000 });
        } else {
            toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
        }
        warn(e, "saga: putLine");
    }
}

export function* watchPutLine() {
    try {
        yield takeLatest(PUT_LINE, putLine);
    } catch (e) {
        // ..
    }
}
