import {
    LOADING_CONTENT,
    LOAD_CONTENT,
    GET_CONTENT,
    CHANGE_CONTENT_TYPE,
    LOAD_CONTENT_DATES,
    CHANGE_DATE_FROM,
    GET_CONTENT_DATES,
    LOAD_CONTENT_WITH_PAGINATION,
    GET_CONTENT_WITH_PAGINATION,
    LOADING_CONTENT_WITH_PAGINATION,
    SET_UPLOAD_URL,
    SET_DATE_FROM,
    SET_PAGINATION,
    CLEAR_CONTENT_MEMORY,
    GET_INITIAL_CONTENT,
    UPDATE_CONTENT,
    SET_GPS_TMP,
    GET_GPS_TMP,
    POST_GPS_TMP,
    DELETE_GPS_TMP,
} from "../../constants";

export function getInitialContent({
    objectID,
    lineID,
    contentType,
}) {
    return {
        type: GET_INITIAL_CONTENT,
        objectID,
        lineID,
        contentType,
    };
}

export function setLoading(load) {
    return {
        type: LOADING_CONTENT,
        load,
    };
}

export function setLoadingContentWithPagination(loadPagination) {
    return {
        type: LOADING_CONTENT_WITH_PAGINATION,
        loadPagination,
    };
}

export function getContent({
    objectID,
    lineID,
    contentType,
    dateFrom,
}) {
    return {
        type: GET_CONTENT,
        objectID,
        lineID,
        contentType,
        dateFrom,
    };
}

export function loadContent(content) {
    return {
        type: LOAD_CONTENT,
        content,
    };
}

export function loadContentWithPagination(content, pagination) {
    return {
        type: LOAD_CONTENT_WITH_PAGINATION,
        content,
        pagination,
    };
}

export function updateContent(dateFrom = "", callback) {
    return {
        type: UPDATE_CONTENT,
        dateFrom,
        callback,
    };
}

export function getDates({
    objectID = 0,
    lineID = 0,
    contentType = "",
}) {
    return {
        type: GET_CONTENT_DATES,
        objectID,
        lineID,
        contentType,
    };
}

export function loadDates(dates) {
    return {
        type: LOAD_CONTENT_DATES,
        dates,
    };
}

export function changeDateFrom(dateFrom) {
    return {
        type: CHANGE_DATE_FROM,
        dateFrom,
    };
}

export function setDateFrom(dateFrom) {
    return {
        type: SET_DATE_FROM,
        dateFrom,
    };
}

export function changeContentType(contentType) {
    return {
        type: CHANGE_CONTENT_TYPE,
        contentType,
    };
}

export function setUploadUrl(uploadUrl) {
    return {
        type: SET_UPLOAD_URL,
        uploadUrl,
    };
}

export function getGpsTmp({
    lineID,
    contentType,
}) {
    return {
        type: GET_GPS_TMP,
        lineId: lineID,
        contentType,
    };
}

export function setGpsTmp(gpsTmp) {
    return {
        type: SET_GPS_TMP,
        gpsTmp,
    };
}

export function postGpsTmp({
    date,
    lineId,
    contentType,
    callback,
}) {
    return {
        type: POST_GPS_TMP,
        date,
        lineId,
        contentType,
        callback,
    };
}

export function deleteGpsTmp({
    id,
    callback,
}) {
    return {
        type: DELETE_GPS_TMP,
        id,
        callback,
    };
}

export function clearContentMemory() {
    return {
        type: CLEAR_CONTENT_MEMORY,
    };
}
