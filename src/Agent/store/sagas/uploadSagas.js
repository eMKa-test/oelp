import {
    all, call, delay, put, select, take, takeLatest,
} from "redux-saga/effects";
import isEmpty from "lodash/isEmpty";
import {
    addAllUploadFiles,
    resetUpload,
    setProgress,
    setUploadActive,
    setUploadPhase,
    START_UPLOAD,
    UPLOAD_PHASES,
    uploadFailure,
    uploadSuccess,
    changeAllUploadFiles,
    setUploadingFile,
    RETRY_UPLOAD,
    START_UPLOAD_FILES,
    setNetworkError,
} from "../actionsCreator/uploadActions";
import { RESET_STATE } from "../actionsCreator/appActions";
import { registerUploadContent } from "../../api";
import uploadChanel from "../chanels/uploadChanel";
import chunkUploadChanel from "../chanels/chunksUploadChanel";
import { FILE_SET_UPLOAD_API } from "../../contstants";

function* uploadFile(file, index) {
    const body = { ...file };
    yield put(changeAllUploadFiles(file));
    const isChunkMode = yield select((store) => store.app.chunkMode);
    const channel = yield call(isChunkMode ? chunkUploadChanel : uploadChanel, body);
    try {
        while (true) {
            const {
                progress = 0,
                error,
                networkError,
                payload,
            } = yield take(channel);
            if (error) {
                yield put(uploadFailure({
                    error: {
                        status: error?.response?.status,
                        statusText: error?.response?.data?.error,
                        request: JSON.stringify({
                            body: file,
                            url: FILE_SET_UPLOAD_API,
                        }),
                    },
                    payload: file,
                }));
                if (networkError) {
                    yield put(setNetworkError(true));
                    return networkError;
                }
                yield put(changeAllUploadFiles(file, true));
            }
            if (payload) {
                yield put(uploadSuccess(file));
            }
            yield put(setProgress(progress));
        }
    } catch (err) {
        warn("uploadFile", err);
    }
}

function* uploadControllerWorker({ files }) {
    try {
        yield delay(500);
        yield put(setUploadPhase(UPLOAD_PHASES.UPLOADING));
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            yield put(setUploadingFile(file));
            const result = yield call(uploadFile, file, i);
            if (result?.networkError) {
                break;
            }
        }
        yield put(setUploadPhase(UPLOAD_PHASES.DONE));
        yield put(setUploadingFile({}));
    } catch (err) {
        warn("uploadControllerWorker", err);
    }
}

export function* watcherUploadController() {
    try {
        yield takeLatest(START_UPLOAD_FILES, uploadControllerWorker);
    } catch (err) {
        warn("watcherUploadController", err);
    }
}

function* registerUploads({ sets }) {
    yield put(setUploadPhase(UPLOAD_PHASES.REGISTERING));
    const date = yield select((store) => store.app.date);
    const bodies = [];
    const filesForUpload = [];
    Object.values(sets)
        .forEach(({
            contentType,
            lineId,
            files,
        }) => {
            filesForUpload.push(...files);
            bodies.push({
                date,
                contentType,
                lineId,
                files: files.map((file) => ({ name: file.name.toLowerCase() })),
            });
        });
    const registered = yield all(bodies.map((body) => call(registerUploadContent, body)));
    return registered.reduce((acc, cur) => {
        const files = [];
        cur.files.forEach((f) => {
            const matchFile = filesForUpload.find((s) => s.name === f.name);
            if (matchFile) {
                const file = {
                    file: matchFile,
                    fileId: f.id,
                    date: cur.date,
                    contentType: cur.contentType,
                    lineId: cur.lineId,
                    projectId: cur.projectId,
                };
                files.push(file);
            }
        });
        acc.push(...files);
        return acc;
    }, []);
}

function* uploadStartWorker() {
    try {
        yield put(setUploadActive(true));
        const {
            oldFiles,
            sets,
        } = yield select((store) => store.upload);
        const uploadFiles = [...oldFiles];
        if (!isEmpty(sets)) {
            const files = yield call(registerUploads, { sets });
            uploadFiles.push(...files);
        }
        if (!isEmpty(uploadFiles)) {
            yield put(addAllUploadFiles(uploadFiles));
            yield put({
                type: START_UPLOAD_FILES,
                files: uploadFiles,
            });
        } else {
            yield put(setUploadActive(false));
        }
    } catch (err) {
        if (err.message === "Network Error") {
            yield put(setNetworkError(true));
            yield put(setUploadPhase(UPLOAD_PHASES.DONE));
        }
        warn("uploadStartWorker", err);
    }
}

export function* watcherUploadStart() {
    try {
        yield takeLatest(START_UPLOAD, uploadStartWorker);
    } catch (err) {
        warn("watcherUploadStart", err);
    }
}

function* retryUploadWorker() {
    try {
        yield put(setUploadActive(true));
        const files = yield select((store) => store.upload.uploadFiles);
        yield put({
            type: START_UPLOAD_FILES,
            files,
        });
    } catch (err) {
        warn("resetWorker", err);
    }
}

export function* watcherRetryUpload() {
    try {
        yield takeLatest(RETRY_UPLOAD, retryUploadWorker);
    } catch (err) {
        warn("watcherRetryUpload", err);
    }
}

function* resetWorker() {
    try {
        yield put(resetUpload());
    } catch (err) {
        warn("resetWorker", err);
    }
}

export function* watcherResetUpload() {
    try {
        yield takeLatest(RESET_STATE, resetWorker);
    } catch (err) {
        warn("watcherResetApp", err);
    }
}
