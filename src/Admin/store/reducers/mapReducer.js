import {
    ADD_TO_EDIT,
    DELETE_FROM_EDIT,
    LOAD_MAP_CONFIG,
    SET_ACTIVE_MARKER,
    LOADING_MAP,
    RESET_EDIT_MODE,
    LOADING_SUBMIT, POLY_MODE,
} from "../../constants";
import { filterByGPS } from "../../common/utils";

const initialState = () => ({
    load: true,
    editMode: false,
    activeMarker: null,
    editMarkers: [],
    markers: [],
    bounds: null,
    center: [],
    zoom: 15,
    lineID: null,
    objectID: null,
    submitLoad: false,
    polyMode: false,
});

const mapReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_MAP_CONFIG: {
            const { content, line, contentType } = action;
            let center = [];
            const markers = [];
            const bounds = [];
            if (contentType !== "timelapse") {
                const items = filterByGPS(content);
                items.forEach((item, i) => {
                    const position = Object.values(item.gps);
                    markers.push({
                        ...item,
                        index: items.length - i,
                        position,
                    });
                    bounds.push(position);
                });
                if (markers?.length === 1) {
                    center = [...markers[0].position];
                } else {
                    center = Object.values(line.gps);
                }
            }
            return {
                ...state,
                markers,
                bounds: bounds.length > 1 ? bounds : null,
                center,
                load: false,
                lineID: line.id,
                objectID: line.projectId,
            };
        }
        case SET_ACTIVE_MARKER: return { ...state, activeMarker: action.marker };
        case LOADING_MAP: return { ...state, load: action.load };
        case ADD_TO_EDIT: {
            const { marker, coords } = action;
            const editMarkers = [...state.editMarkers];
            const isExistMarker = editMarkers.find((item) => item.id === marker.id);
            if (isExistMarker) {
                isExistMarker.coords = { ...coords };
            } else {
                editMarkers.push({ ...marker, coords });
            }
            return { ...state, editMarkers };
        }
        case DELETE_FROM_EDIT: {
            const editMarkers = state.editMarkers.filter((marker) => marker.id !== action.marker.id);
            return { ...state, editMarkers, load: false };
        }
        case RESET_EDIT_MODE: {
            return {
                ...state, editMarkers: [], activeMarker: null, markers: [...state.markers],
            };
        }
        case LOADING_SUBMIT: {
            return { ...state, submitLoad: action.submitLoad };
        }
        case POLY_MODE: {
            return { ...state, polyMode: !state.polyMode };
        }
        default:
            return state;
    }
};

export default mapReducer;
