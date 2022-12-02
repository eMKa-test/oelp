import {
    ADD_TO_EDIT,
    DELETE_FROM_EDIT,
    LOAD_MAP_CONFIG,
    SET_ACTIVE_MARKER,
    LOADING_MAP,
    RESET_EDIT_MODE,
    UPDATE_MARKERS_POSITION,
    LOADING_SUBMIT,
    POLY_MODE,
} from "../../constants";

export function loadMap(load) {
    return {
        type: LOADING_MAP,
        load,
    };
}

export function setActiveMarker(marker) {
    return {
        type: SET_ACTIVE_MARKER,
        marker,
    };
}
export function loadMapConfig(content, line, contentType) {
    return {
        type: LOAD_MAP_CONFIG,
        content,
        line,
        contentType,
    };
}
export function addToEdit(marker, coords) {
    return {
        type: ADD_TO_EDIT,
        marker,
        coords,
    };
}

export function deleteFromEdit(marker) {
    return {
        type: DELETE_FROM_EDIT,
        marker,
    };
}

export function resetEditMode() {
    return {
        type: RESET_EDIT_MODE,
    };
}

export function updateMarkersPosition(contentType, callbackAction) {
    return {
        type: UPDATE_MARKERS_POSITION,
        contentType,
        callbackAction,
    };
}

export function loadSubmit(submitLoad) {
    return {
        type: LOADING_SUBMIT,
        submitLoad,
    };
}

export function togglePolyMode() {
    return {
        type: POLY_MODE,
    };
}
