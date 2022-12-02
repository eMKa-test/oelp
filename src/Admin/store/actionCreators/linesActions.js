import {
    GET_LINE_BY_ID,
    LOAD_LINE_BY_ID,
    PUT_LINE,
    LOAD_LINE_SCHEMES,
    GET_LINE_SCHEME,
    DELETE_LINE_SCHEME,
    UPLOAD_LINE_SCHEME,
    ADD_LINE_SCHEME,
    REMOVE_LINE_SCHEME,
    SET_POINTS_LINE_SCHEME,
    LOAD_POINTS_LINE_SCHEME,
} from "../../constants";

export function getLineByID({
    objectID,
    id,
}) {
    if (typeof objectID === "undefined" || typeof id === "undefined") {
        warn({
            id,
            objectID,
        }, "putLine");
        return null;
    }
    return {
        type: GET_LINE_BY_ID,
        objectID,
        id,
    };
}

export function loadLineByID(line) {
    return {
        type: LOAD_LINE_BY_ID,
        line,
    };
}

export function getLineSchemes(lineId) {
    return {
        type: GET_LINE_SCHEME,
        lineId,
    };
}

export function addLineSchemes(scheme) {
    return {
        type: ADD_LINE_SCHEME,
        scheme,
    };
}

export function removeLineSchemes(schemeId) {
    return {
        type: REMOVE_LINE_SCHEME,
        schemeId,
    };
}

export function setPointsLineScheme(points, callback = () => null) {
    return {
        type: SET_POINTS_LINE_SCHEME,
        points,
        callback,
    };
}

export function loadPointsLineScheme(data) {
    return {
        type: LOAD_POINTS_LINE_SCHEME,
        data,
    };
}

export function deleteLineScheme(schemeId, callback = () => null) {
    return {
        type: DELETE_LINE_SCHEME,
        schemeId,
        callback,
    };
}

export function uploadLineScheme({
    lineId,
    date,
    file,
    contentType,
    callback,
}) {
    return {
        type: UPLOAD_LINE_SCHEME,
        lineId,
        date,
        file,
        contentType,
        callback,
    };
}

export function loadLineSchemes(schemes) {
    return {
        type: LOAD_LINE_SCHEMES,
        schemes,
    };
}

export function putLine({
    objectID,
    updateObjects = false,
    line,
    params = {},
    callback,
}) {
    if (typeof line === "undefined" || typeof objectID === "undefined") {
        warn({
            line,
            objectID,
        }, "putLine");
        return null;
    }
    return {
        type: PUT_LINE,
        objectID,
        updateObjects,
        line,
        params,
        callback,
    };
}
