import {
    call, put, all, takeLatest, takeEvery, fork,
} from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    COMPANIES_API_URL,
    GET_COMPANIES,
    PUT_COMPANIES,
    DELETE_COMPANIES,
    GET_COMPANIES_BY_ID,
    OBJECTS_API_URL,
    LOAD_COMPANIES_PAGINATION,
    LOAD_OBJECTS_PAGINATION,
    LOADING_COMPANIES,
    GET_ALL_PROJECTS,
    OBJECTS_PAGINATION_DEFAULT,
} from "../../constants";

import {
    loadCompanies, loadCompaniesByID, loadAllProjects, getAllProjects,
} from "../actionCreators/companiesActions";
import { loadObjects } from "../actionCreators/objectsActions";
import { getData, postData, delData } from "../../../api";

function* getCompanies({ params = {} }) {
    try {
        yield put({
            type: LOADING_COMPANIES,
            loading: true,
        });
        const data = yield call(getData, {
            mainUrl: COMPANIES_API_URL,
            params: { limit: 50, ...params },
        });
        yield fork(getProjectsWorker);
        yield all([
            put(loadCompanies(data.payload)),
            put({
                type: LOAD_COMPANIES_PAGINATION,
                pagination: data.pagination,
            }),
        ]);
    } catch (e) {
        warn(e, "saga: getCompanies");
    } finally {
        yield put({
            type: LOADING_COMPANIES,
            loading: false,
        });
    }
}

export function* watchGetCompanies() {
    try {
        yield takeLatest(GET_COMPANIES, getCompanies);
    } catch (e) {
        // ...
    }
}

function* getProjectsWorker() {
    try {
        const projects = yield call(getData, {
            mainUrl: OBJECTS_API_URL,
            params: { limit: 99999 },
        });
        yield put(loadAllProjects(projects.payload));
    } catch (e) {
        warn(e, "saga: getProjectsWorker");
    }
}

export function* watchGetProjects() {
    try {
        yield takeLatest(GET_ALL_PROJECTS, getProjectsWorker);
    } catch (e) {
        // ...
    }
}

function* getCompaniesByID({
    id,
    params = {},
}) {
    try {
        yield put({
            type: LOADING_COMPANIES,
            loading: true,
        });
        const data = yield call(getData, {
            mainUrl: OBJECTS_API_URL,
            params: {
                companyId: id,
                limit: OBJECTS_PAGINATION_DEFAULT,
                ...params,
            },
        });
        const dataCompany = yield call(getData, {
            mainUrl: `${COMPANIES_API_URL}/${id}`,
        });
        const objectFromCompanies = data?.payload?.length > 0 ? [...data.payload] : [];
        yield all([
            put(loadObjects(objectFromCompanies)),
            put({
                type: LOAD_OBJECTS_PAGINATION,
                pagination: data.pagination,
            }),
            put(loadCompaniesByID(dataCompany.payload)),
        ]);
    } catch (e) {
        warn(e, "saga: getCompaniesByID");
    } finally {
        yield put({
            type: LOADING_COMPANIES,
            loading: false,
        });
    }
}

export function* watchGetCompaniesByID() {
    yield takeEvery(GET_COMPANIES_BY_ID, getCompaniesByID);
}

function* putCompanies(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${COMPANIES_API_URL}/${action.company.id || ""}`,
            body: action.company,
        });
        if (typeof action.company.id !== "undefined") {
            yield put(loadCompaniesByID(data.payload));
        } else {
            yield put(loadCompanies(data.payload));
        }
        toast.success("Изменения сохранены");
    } catch (e) {
        if (e.response.status === 409) {
            toast.error("Данное имя компании уже существует. Выберите другое имя", { autoClose: 4000 });
        } else {
            toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
        }
        warn(e, "saga: putCompanies");
    }
}

export function* watchPutCompanies() {
    try {
        yield takeLatest(PUT_COMPANIES, putCompanies);
    } catch (e) {
        warn(e, "saga: watchPutCompanies");
    }
}

function* deleteCompanies({ id }) {
    try {
        const data = yield call(delData, `${COMPANIES_API_URL}/${id}`);
        yield put(loadCompanies(data.payload));
        toast.success("Компания удалена");
    } catch (e) {
        toast.error("Ошибка при удалении компании", { autoClose: 4000 });
        warn(e, "saga: deleteCompanies");
    }
}

export function* watchDeleteCompanies() {
    yield takeLatest(DELETE_COMPANIES, deleteCompanies);
}
