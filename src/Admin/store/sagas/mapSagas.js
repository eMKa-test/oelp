import {
    put, all, call, take, select, takeLatest,
} from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    LOAD_CONTENT,
    UPDATE_MARKERS_POSITION,
} from "../../constants";
import {
    loadMapConfig, loadMap, resetEditMode, loadSubmit,
} from "../actionCreators/mapActions";
import { fetchData } from "../../../api";

function* updateMarkersPosition({ contentType, callbackAction }) {
    try {
        yield put(loadSubmit(true));
        const { editMarkers, lineID, objectID } = yield select((store) => store.map);
        const fetches = editMarkers.map((marker) => {
            const item = { ...marker };
            delete item.coords;
            return fetchData({
                method: "put",
                url: `/admin/api/projects/${objectID}/lines/${lineID}/content/${contentType}/${marker.id}`,
                body: {
                    ...item,
                    gps: {
                        lat: marker.coords.lat,
                        long: marker.coords.lng,
                    },
                },
            });
        });
        yield all(fetches);
        toast.success("Изменения сохранены");
        yield put(resetEditMode());
        if (typeof callbackAction === "function") {
            yield call(callbackAction);
        }
    } catch (err) {
        toast.error("Ошибка", { autoClose: 4000 });
        console.warn("updateMarkersPosition", err);
    } finally {
        yield put(loadSubmit(false));
    }
}

export function* watchUpdateMarkersPosition() {
    try {
        yield takeLatest(UPDATE_MARKERS_POSITION, updateMarkersPosition);
    } catch (err) {
        console.warn("watchUpdateMarkersPosition", err);
    }
}

export function* watchMapGetContent() {
    try {
        while (true) {
            const { content } = yield take(LOAD_CONTENT);
            // yield put(loadMap(true));
            const line = yield select((store) => store.currentLine);
            const { contentType } = yield select((store) => store.content);
            yield put(loadMapConfig(content, line, contentType));
        }
    } catch (e) {
        console.warn("watchMapGetContent", e);
    }
}

export default null;
