import {
    CHANGE_PANORAMA_TAB,
    GET_CONTENT_LOOPS,
    GET_PANORAMA_CONTENT_ROUTES, LOAD_CONTENT_LOOPS,
    LOAD_PANORAMA_CONTENT_ROUTES, TOGGLE_PANORAMA_MOUSE_CONTROL,
} from "../../constants";

export function getContentLoops({ lineId, contentType }) {
    return {
        type: GET_CONTENT_LOOPS,
        lineId,
        contentType,
    };
}

export function loadContentLoops(contentLoops) {
    return {
        type: LOAD_CONTENT_LOOPS,
        contentLoops,
    };
}

export function getContentRoutes({ lineId = "", date = "", contentType = "" }) {
    return {
        type: GET_PANORAMA_CONTENT_ROUTES,
        lineId,
        date,
        contentType,
    };
}

export function loadContentRoutes(contentRoutes) {
    return {
        type: LOAD_PANORAMA_CONTENT_ROUTES,
        contentRoutes,
    };
}

export function changePanoramaTab(panoramaTab) {
    return {
        type: CHANGE_PANORAMA_TAB,
        panoramaTab,
    };
}
export function togglePanoramaMouseControl(mouseControl) {
    return {
        type: TOGGLE_PANORAMA_MOUSE_CONTROL,
        mouseControl,
    };
}
