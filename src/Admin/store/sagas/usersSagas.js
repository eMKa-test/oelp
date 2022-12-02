import { call, put, takeLatest } from "redux-saga/effects";

import {
    USERS_API_URL, GET_USERS, PUT_USER, LOAD_USERS_PAGINATION,
} from "Admin/constants";

import { getData, postData } from "api";
import { loadUsers } from "Admin/store/actionCreators/usersActions";
import { toast } from "react-toastify";

function* getUsers({ params = {} }) {
    const data = yield call(getData, {
        mainUrl: USERS_API_URL,
        params: { limit: 50, ...params },
    });
    yield put({
        type: LOAD_USERS_PAGINATION,
        pagination: data.pagination,
    });
    yield put(loadUsers(data));
}

export function* watchGetUsers() {
    try {
        yield takeLatest(GET_USERS, getUsers);
    } catch (e) {
        // ...
    }
}

function* putUser(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${USERS_API_URL}/${action.user.id || ""}`,
            body: action.user,
            params: {
                limit: 50,
                ...action.params,
            },
        });
        yield put(loadUsers(data));
        toast.success("Пользователь создан");
        if (action.callback) {
            action.callback();
        }
    } catch (e) {
        if (e?.response?.status === 409) {
            toast.error("Пользователь с такой почтой уже создан", { autoClose: 4000 });
        } else {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        }
    }
}

export function* watchPutUser() {
    try {
        yield takeLatest(PUT_USER, putUser);
    } catch (e) {
        // ...
    }
}
