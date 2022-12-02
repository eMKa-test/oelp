import {
    call, put, takeLatest, select, fork,
} from "redux-saga/effects";
import { toast } from "react-toastify";
import { getData, postData, delData } from "../../../api";
import {
    GET_CONTENT,
    GET_CONTENT_DATES,
    SET_DATE_FROM,
    GET_CONTENT_API_URL,
    GET_CONTENT_DATES_API_URL,
    CHANGE_CONTENT_TYPE,
    UPDATE_CONTENT,
    GET_INITIAL_CONTENT,
    GET_CONTENT_GPS_TMP,
    GET_GPS_TMP,
    POST_GPS_TMP,
    DELETE_GPS_TMP,
    DELETE_CONTENT_GPS_TMP,
} from "../../constants";
import {
    setLoading, loadDates, loadContent, changeDateFrom,
    setUploadUrl, setGpsTmp,
} from "../actionCreators/contentActions";
import { loadMap } from "../actionCreators/mapActions";
import { fetchLineSchemes } from "../../api/lineScheme";
import { changePanoramaTab } from "../actionCreators/panoramaActions";
import { getLineSchemes, loadLineSchemes } from "../actionCreators/linesActions";

function* getInitialContentWorker({
    objectID,
    lineID,
    contentType,
}) {
    try {
        let { dateFrom } = yield call(getDatesWorker, {
            objectID,
            lineID,
            contentType,
        });
        if (!dateFrom) {
            dateFrom = "";
        }
        const url = `/admin/api/projects/${objectID}/lines/${lineID}/content/${contentType}`;
        yield put(setUploadUrl(url));
        yield fork(getContentWorker, {
            objectID,
            lineID,
            contentType,
            dateFrom,
        });
    } catch (e) {
        warn(e, "saga: getInitialContentWorker");
    }
}

export function* watchGetInitialContent() {
    try {
        yield takeLatest(GET_INITIAL_CONTENT, getInitialContentWorker);
    } catch (e) {
        warn(e, "watcher: watchGetInitialContent");
    }
}

function* getGpsTmpContentWorker({
    lineId,
    contentType,
}) {
    try {
        const { payload } = yield call(getData, {
            mainUrl: GET_CONTENT_GPS_TMP,
            params: {
                contentType,
                lineId,
            },
        });
        yield put(setGpsTmp(payload[0]));
    } catch (e) {
        warn(e, "watcher: getGpsTmpContentWorker");
    }
}

export function* watchGetGpsTmpContentWorker() {
    try {
        yield takeLatest(GET_GPS_TMP, getGpsTmpContentWorker);
    } catch (e) {
        warn(e, "watcher: watchGetContent");
    }
}

function* postGpsTmpWorker({
    date,
    lineId,
    contentType,
    callback,
}) {
    try {
        const { payload } = yield call(postData, {
            mainUrl: GET_CONTENT_GPS_TMP,
            body: {
                date,
                lineId,
                contentType,
            },
        });
        yield put(setGpsTmp(payload[0]));
        toast.success("Сохранено");
        if (typeof callback === "function") {
            callback(true);
        }
    } catch (e) {
        warn(e, "watcher: postGpsTmpWorker");
        if (typeof callback === "function") {
            callback(false);
        }
    }
}

export function* watchPostGpsTmpWorker() {
    try {
        yield takeLatest(POST_GPS_TMP, postGpsTmpWorker);
    } catch (e) {
        toast.error("Ошибка", { autoClose: 4000 });
        warn(e, "watcher: watchPostGpsTmpWorker");
    }
}

function* deleteGpsTmpWorker({
    id,
    callback,
}) {
    try {
        yield call(delData, DELETE_CONTENT_GPS_TMP(id));
        yield put(setGpsTmp(null));
        toast.success("Удалено");
        if (typeof callback === "function") {
            callback();
        }
    } catch (e) {
        toast.error("Ошибка", { autoClose: 4000 });
        warn(e, "watcher: deleteGpsTmpWorker");
    }
}

export function* watchDeleteGpsTmpWorker() {
    try {
        yield takeLatest(DELETE_GPS_TMP, deleteGpsTmpWorker);
    } catch (e) {
        warn(e, "watcher: deleteGpsTmpWorker");
    }
}

function* getContentWorker({
    objectID,
    lineID,
    contentType,
    dateFrom = "",
}) {
    if (!dateFrom) {
        yield put(loadContent([]));
        yield put(setLoading(false));
        return [];
    }
    yield put(setLoading(true));
    const { payload: content } = yield call(getData, {
        mainUrl: GET_CONTENT_API_URL(objectID, lineID, contentType),
        params: { dateFrom },
    });
    yield put(loadContent(content));
    yield put(setLoading(false));
    return content;
}

export function* watchGetContent() {
    try {
        yield takeLatest(GET_CONTENT, getContentWorker);
    } catch (e) {
        warn(e, "watcher: watchGetContent");
    }
}

function* changeContentTypeWorker({ contentType }) {
    try {
        yield put(loadMap(true));
        yield put(setLoading(true));
        yield put(changePanoramaTab("map"));
        const {
            objectID,
            lineID,
        } = yield select((state) => state.router);
        const url = `/admin/api/projects/${objectID}/lines/${lineID}/content/${contentType}`;
        yield put(setUploadUrl(url));
        let { dateFrom } = yield call(getDatesWorker, {
            objectID,
            lineID,
            contentType,
        });
        if (!dateFrom) {
            dateFrom = "";
        }
        yield fork(getContentWorker, {
            objectID,
            lineID,
            contentType,
            dateFrom,
        });
        yield put(getLineSchemes(lineID));
    } catch (e) {
        warn(e, "saga: changeContentTypeWorker");
    }
}

export function* watchChangeContentType() {
    try {
        yield takeLatest(CHANGE_CONTENT_TYPE, changeContentTypeWorker);
    } catch (e) {
        warn(e, "watcher: watchChangeContentType");
    }
}

function* changeDateFromWorker({ dateFrom }) {
    try {
        yield put(changeDateFrom(dateFrom));
        const {
            objectID,
            lineID,
        } = yield select((state) => state.router);
        const { contentType } = yield select((state) => state.content);
        yield call(getContentWorker, {
            objectID,
            lineID,
            contentType,
            dateFrom,
        });
    } catch (e) {
        warn(e, "saga: changeDateFromWorker");
    }
}

export function* watchChangeDateFrom() {
    try {
        yield takeLatest(SET_DATE_FROM, changeDateFromWorker);
    } catch (e) {
        warn(e, "watcher: watchChangeDateFrom");
    }
}

function* getDatesWorker({
    objectID,
    lineID,
    contentType = "",
    dateFrom = "",
}) {
    const { payload: dates } = yield call(getData, {
        mainUrl: GET_CONTENT_DATES_API_URL(objectID, lineID, contentType),
    });
    yield put(loadDates(dates));
    let newDate = dateFrom;
    if (!dates.includes(dateFrom)) {
        [newDate] = dates;
    }
    yield put(changeDateFrom(newDate));
    return {
        dateFrom: newDate,
        dates,
    };
}

export function* watchGetDates() {
    try {
        yield takeLatest(GET_CONTENT_DATES, getDatesWorker);
    } catch (e) {
        warn(e, "watcher: watchGetDates");
    }
}

function* updateContentWorker({
    dateFrom: currentDate = "",
    callback,
}) {
    try {
        let date = currentDate;
        const {
            objectID,
            lineID,
        } = yield select((state) => state.router);
        const {
            contentType,
        } = yield select((state) => state.content);
        const {
            dateFrom,
            dates,
        } = yield call(getDatesWorker, {
            objectID,
            lineID,
            contentType,
            dateFrom: date,
        });
        if (!date) {
            date = dateFrom;
        } else if (dates?.length > 0 && !dates.includes(date)) {
            [date] = dates;
        }
        yield fork(getContentWorker, {
            objectID,
            lineID,
            contentType,
            dateFrom: date,
        });
        if (typeof callback === "function") {
            callback();
        }
    } catch (e) {
        console.warn(e);
        warn(e, "saga: updateContentWorker");
    }
}

export function* watchUpdateContent() {
    try {
        yield takeLatest(UPDATE_CONTENT, updateContentWorker);
    } catch (e) {
        warn(e, "watcher: watchChangePagination");
    }
}
