import {
    UPLOAD_ACTIVE,
    ADD_FOR_REGISTER_CONTENT,
    REMOVE_FOR_REGISTER_CONTENT,
    RESET_UPLOAD,
    ADD_OLD_FILES,
    UploadActions,
    ADD_ALL_UPLOAD_FILES,
    UPLOAD_PHASES,
    UPLOAD_PHASE,
    SET_PROGRESS,
    CHANGE_ALL_UPLOAD_FILES,
    UPLOADING_FILE, NETWORK_ERROR,
} from "../actionsCreator/uploadActions";
import { renameFile } from "../../common/helpers";

const initialState = () => ({
    load: false,
    progress: 0,
    networkError: false,
    globalProgress: 0,
    uploadFilesCount: 0,
    allUploadFilesCount: 0,
    uploadingFile: {},
    sets: {},
    oldFiles: [],
    uploadFiles: [],
    successFiles: [],
    failureFiles: [],
    uploadPhase: UPLOAD_PHASES.INITIAL,
});

export default (state = initialState(), action) => {
    switch (action.type) {
        case SET_PROGRESS: {
            const globalProgress = ((state.successFiles.length * 100) + action.progress) / state.uploadFilesCount;
            return {
                ...state,
                progress: action.progress,
                globalProgress: parseFloat(globalProgress.toFixed(1)),
            };
        }
        case UploadActions.UPLOAD_SUCCESS: {
            const file = {
                payload: action.payload,
                time: action.time,
            };
            const successFiles = [...state.successFiles, file];
            return {
                ...state,
                successFiles,
            };
        }
        case UploadActions.UPLOAD_FAILURE: {
            const file = {
                payload: action.payload.payload,
                time: action.time,
            };
            const failureFiles = [...state.failureFiles, file];
            return {
                ...state,
                failureFiles,
                uploadFilesCount: state.uploadFilesCount - 1,
            };
        }
        case UPLOAD_ACTIVE:
            return {
                ...state,
                load: action.load,
            };
        case UPLOADING_FILE:
            return {
                ...state,
                uploadingFile: action.uploadingFile,
            };
        case UPLOAD_PHASE:
            return {
                ...state,
                uploadPhase: action.uploadPhase,
            };
        case ADD_OLD_FILES: {
            const oldFiles = action.oldFiles.map((el) => ({
                ...el,
                file: renameFile(el.file, el.file.name.toLowerCase()),
            }));
            return {
                ...state,
                oldFiles,
            };
        }
        case ADD_FOR_REGISTER_CONTENT: {
            const {
                files,
                lineId,
                projectId,
                contentType,
            } = action;
            let sets = {};
            const uid = `${contentType}_${projectId}_${lineId}`;
            sets = {
                ...state.sets,
                [uid]: {
                    lineId,
                    contentType,
                    files: state.sets?.[uid]?.files
                        ? [
                            ...state.sets?.[uid]?.files,
                            ...files,
                        ]
                        : [...files],
                },
            };
            return {
                ...state,
                sets,
            };
        }
        case REMOVE_FOR_REGISTER_CONTENT: {
            const {
                lineId,
                projectId,
                contentType,
            } = action;
            const sets = { ...state.sets };
            const uid = `${contentType}_${projectId}_${lineId}`;
            delete sets[uid];
            return {
                ...state,
                sets,
            };
        }
        case ADD_ALL_UPLOAD_FILES: {
            const { files } = action;
            return {
                ...state,
                uploadFiles: [...files],
                uploadFilesCount: files.length,
                allUploadFilesCount: files.length,
            };
        }
        case CHANGE_ALL_UPLOAD_FILES: {
            const { isFail } = action;
            let uploadFiles = [...state.uploadFiles];
            if (isFail) {
                const file = {
                    ...action.file,
                    isFail: true,
                };
                uploadFiles.push(file);
            } else {
                uploadFiles = state.uploadFiles.filter((f) => action.file.fileId !== f.fileId);
            }
            return {
                ...state,
                uploadFiles,
            };
        }
        case NETWORK_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        case RESET_UPLOAD:
            return initialState();
        default:
            return state;
    }
};
