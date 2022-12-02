export const UPLOAD_ACTIVE = "UPLOAD_ACTIVE";
export const ADD_FOR_REGISTER_CONTENT = "ADD_FOR_REGISTER_CONTENT";
export const REMOVE_FOR_REGISTER_CONTENT = "REMOVE_FOR_REGISTER_CONTENT";
export const ADD_OLD_FILES = "ADD_OLD_FILES";
export const START_UPLOAD = "START_UPLOAD";
export const ADD_ALL_UPLOAD_FILES = "ADD_ALL_UPLOAD_FILES";
export const CHANGE_ALL_UPLOAD_FILES = "CHANGE_ALL_UPLOAD_FILES";

export const UPLOAD_PHASE = "UPLOAD_PHASE";
export const SET_PROGRESS = "SET_PROGRESS";
export const UPLOADING_FILE = "UPLOADING_FILE";
export const START_UPLOAD_FILES = "START_UPLOAD_FILES";
export const RETRY_UPLOAD = "RETRY_UPLOAD";
export const NETWORK_ERROR = "NETWORK_ERROR";

export const UPLOAD_PHASES = {
    INITIAL: "INITIAL",
    REGISTERING: "REGISTERING",
    UPLOADING: "UPLOADING",
    DONE: "DONE",
};

export const RESET_UPLOAD = "RESET_UPLOAD";

export const UploadActions = {
    UPLOAD_REQUEST: "UPLOAD_REQUEST",
    UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
    UPLOAD_FAILURE: "UPLOAD_FAILURE",
};

export const retryUpload = () => ({
    type: RETRY_UPLOAD,
});

export const setNetworkError = (networkError) => ({
    type: NETWORK_ERROR,
    networkError,
});

export const setUploadActive = (load) => ({
    type: UPLOAD_ACTIVE,
    load,
});

export const setUploadingFile = (uploadingFile) => ({
    type: UPLOADING_FILE,
    uploadingFile,
});

export const uploadSuccess = (payload = {}) => ({
    type: UploadActions.UPLOAD_SUCCESS,
    payload: {
        payload,
        time: new Date().getTime(),
    },
});

export const uploadFailure = ({
    error,
    payload,
}) => ({
    type: UploadActions.UPLOAD_FAILURE,
    payload: {
        payload,
        error,
        time: new Date().getTime(),
    },
});

export const setUploadPhase = (uploadPhase) => ({
    type: UPLOAD_PHASE,
    uploadPhase,
});

export const setProgress = (progress) => ({
    type: SET_PROGRESS,
    progress,
});

export const startUpload = () => ({
    type: START_UPLOAD,
});

export const addOldFiles = (oldFiles) => ({
    type: ADD_OLD_FILES,
    oldFiles,
});

export const addAllUploadFiles = (files) => ({
    type: ADD_ALL_UPLOAD_FILES,
    files,
});

export const changeAllUploadFiles = (file, isFail = false) => ({
    type: CHANGE_ALL_UPLOAD_FILES,
    file,
    isFail,
});

export const addUploadForRegister = ({
    lineId,
    projectId,
    contentType,
    files,
}) => ({
    type: ADD_FOR_REGISTER_CONTENT,
    lineId,
    projectId,
    contentType,
    files,
});

export const removeUploadForRegister = ({
    lineId,
    projectId,
    contentType,
    subType,
}) => ({
    type: REMOVE_FOR_REGISTER_CONTENT,
    lineId,
    projectId,
    contentType,
    subType,
});

export const resetUpload = () => ({
    type: RESET_UPLOAD,
});
