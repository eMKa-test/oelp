import {
    call, put, all, takeLatest,
} from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    OBJECTS_API_URL, GET_OBJECTS, PUT_OBJECT, GET_OBJECT_BY_ID,
    DELETE_OBJECT, LOAD_OBJECTS_PAGINATION, LOADING_OBJECTS, GET_COMPANIES_BY_ID,
} from "../../constants";

import { getData, postData, delData } from "../../../api";
import { loadObjects, loadObjectByID } from "../actionCreators/objectsActions";

function* getObjects({ params }) {
    try {
        yield put({
            type: LOADING_OBJECTS,
            loading: true,
        });
        const data = yield call(getData, {
            mainUrl: OBJECTS_API_URL,
            params: { limit: 50, ...params },
        });
        yield all([
            put(loadObjects(data.payload)),
            put({
                type: LOAD_OBJECTS_PAGINATION,
                pagination: data.pagination,
            }),
        ]);
    } catch (e) {
        warn(e, "saga: getObjects");
    } finally {
        yield put({
            type: LOADING_OBJECTS,
            loading: false,
        });
    }
}

export function* watchGetObjects() {
    try {
        yield takeLatest(GET_OBJECTS, getObjects);
    } catch (e) {
        // ...
    }
}

function* getObjectByID(action) {
    try {
        yield put({
            type: LOADING_OBJECTS,
            loading: true,
        });
        const data = yield call(getData, {
            mainUrl: `${OBJECTS_API_URL}/${action.id}`,
        });
        yield put(loadObjectByID(data.payload));
    } catch (e) {
        warn(e, "saga: getObjectByID");
    } finally {
        yield put({
            type: LOADING_OBJECTS,
            loading: false,
        });
    }
}

export function* watchGetObjectByID() {
    try {
        yield takeLatest(GET_OBJECT_BY_ID, getObjectByID);
    } catch (e) {
        // ..
    }
}

function* putObject(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${OBJECTS_API_URL}/${action.object.id || ""}`,
            body: action.object,
        });
        if (typeof action.object.id !== "undefined") {
            yield put(loadObjectByID(data.payload));
        } else if (action.object?.companyID) {
            yield put({
                type: GET_COMPANIES_BY_ID,
                id: action.object.companyID,
            });
        } else {
            yield put(loadObjects(data.payload));
        }
        toast.success("Изменения сохранены");
    } catch (e) {
        if (e.response.status === 409) {
            toast.error("Данное имя объекта уже существует. Выберите другое имя", { autoClose: 4000 });
        } else {
            toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
        }
        warn(e, "saga: putObject");
    }
}

export function* watchPutObject() {
    try {
        yield takeLatest(PUT_OBJECT, putObject);
    } catch (e) {
    }
}

function* deleteObject({
    id,
    companyID,
}) {
    try {
        const data = yield call(delData, `${OBJECTS_API_URL}/${id}`);
        if (companyID) {
            yield put({
                type: GET_COMPANIES_BY_ID,
                id: companyID,
            });
        } else {
            yield put(loadObjects(data.payload));
        }
        toast.success("Объект удален");
    } catch (e) {
        toast.error("Ошибка при удалении объекта", { autoClose: 4000 });
        warn(e, "saga: deleteCompanies");
    }
}

export function* watchDeleteObject() {
    try {
        yield takeLatest(DELETE_OBJECT, deleteObject);
    } catch (e) {
    }
}
