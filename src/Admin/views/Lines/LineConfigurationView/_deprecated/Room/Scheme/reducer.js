import { reconstructArray } from "./helpers";

export const CANVAS_DEFAULT_WIDTH = 800;
export const CANVAS_DEFAULT_HEIGHT = 300;
const MARKER_WIDTH = 25;
const MARKER_HEIGHT = 54;
const INITIAL_POSITION_X = MARKER_WIDTH + MARKER_WIDTH / 2;
const INITIAL_POSITION_Y = MARKER_HEIGHT + MARKER_HEIGHT / 2;

export const initialState = (state, exclude) => {
    const result = {
        gridActive: false,
        grabActive: false,
        showDefaultMarkers: true,
        showMarkers: true,
        schemeLoad: false,
        submitLoad: false,
        viewParams: {
            width: CANVAS_DEFAULT_WIDTH,
            height: CANVAS_DEFAULT_HEIGHT,
        },
        confirm: null,
        defaultMarkers: [],
        markers: [],
        initialPosition: {
            x: INITIAL_POSITION_X,
            y: INITIAL_POSITION_Y,
        },
    };
    if (exclude) {
        exclude.forEach((ex) => {
            Object.assign(result, {
                [ex]: state[ex],
            });
        });
    }
    return result;
};

const GRID_ACTIVE = "GRID_ACTIVE";
export const switchGrid = (gridActive) => ({ type: GRID_ACTIVE, gridActive });
const SHOW_DEFAULT_MARKERS = "SHOW_DEFAULT_MARKERS";
export const toggleShowDefaultMarkers = () => ({ type: SHOW_DEFAULT_MARKERS });
const SHOW_MARKERS = "SHOW_MARKERS";
export const toggleShowMarkers = () => ({ type: SHOW_MARKERS });
const SET_CONTENT_MARKERS = "SET_CONTENT_MARKERS";
export const setContentMarkers = (markers, linePoints) => ({ type: SET_CONTENT_MARKERS, markers, linePoints });
const SET_DEFAULT_MARKERS = "SET_DEFAULT_MARKERS";
export const setDefaultMarkers = (markers) => ({ type: SET_DEFAULT_MARKERS, markers });
const DELETE_DEFAULT_MARKER = "DELETE_DEFAULT_MARKER";
export const deleteDefaultMarkers = (markers, index) => ({ type: DELETE_DEFAULT_MARKER, markers, index });
const GRAB_ACTIVE = "GRAB_ACTIVE";
export const switchGrab = (grabActive) => ({ type: GRAB_ACTIVE, grabActive });
const SUBMIT_LOAD = "SUBMIT_LOAD";
export const setSubmitLoad = (submitLoad) => ({ type: SUBMIT_LOAD, submitLoad });
const SCHEME_LOAD = "SCHEME_LOAD";
export const setSchemeLoad = (schemeLoad) => ({ type: SCHEME_LOAD, schemeLoad });
const SET_VIEW_PARAMS = "SET_VIEW_PARAMS";
export const setViewParams = (viewParams) => ({ type: SET_VIEW_PARAMS, viewParams });
const SET_CONFIRM = "SET_CONFIRM";
export const setConfirm = (confirm) => ({ type: SET_CONFIRM, confirm });
const RESET_VIEW = "RESET_VIEW";
export const resetView = () => ({ type: RESET_VIEW });
const SET_INITIAL_POSITION = "SET_INITIAL_POSITION";
export const setInitialPosition = (initialPosition) => ({ type: SET_INITIAL_POSITION, initialPosition });

export default (state = initialState(), action) => {
    switch (action.type) {
        case SET_CONTENT_MARKERS: {
            if (action.markers?.length > 0 && action.linePoints && action.linePoints.defaultPoints) {
                const markers = [...action.markers];
                const { defaultPoints, points } = action.linePoints;
                markers.reverse();
                const croppedMarkers = markers.reduce((acc, cur, i) => {
                    if (defaultPoints[i]) {
                        let schemePoint;
                        if (points && points[cur.date] && points[cur.date][i]) {
                            schemePoint = { ...points[cur.date][i].schemePoint };
                        } else {
                            schemePoint = { ...defaultPoints[i].schemePoint };
                        }
                        const marker = {
                            ...cur,
                            schemePoint,
                            pointId: i + 1,
                        };
                        acc.push(marker);
                    }
                    return acc;
                }, []);
                return { ...state, markers: croppedMarkers };
            }
            return { ...state, markers: [] };
        }
        case SHOW_MARKERS: return { ...state, showMarkers: !state.showMarkers };
        case SET_INITIAL_POSITION: return { ...state, initialPosition: { ...action.initialPosition } };
        case SET_DEFAULT_MARKERS: return { ...state, defaultMarkers: action.markers };
        case DELETE_DEFAULT_MARKER: {
            const { markers, index } = action;
            const stateMarkers = [...state.markers];
            reconstructArray(stateMarkers, index);
            return { ...state, defaultMarkers: markers, markers: stateMarkers };
        }
        case SHOW_DEFAULT_MARKERS: return { ...state, showDefaultMarkers: !state.showDefaultMarkers };
        case GRID_ACTIVE: return { ...state, gridActive: action.gridActive };
        case GRAB_ACTIVE: return { ...state, grabActive: action.grabActive };
        case SUBMIT_LOAD: return { ...state, submitLoad: action.submitLoad };
        case SCHEME_LOAD: return { ...state, schemeLoad: action.schemeLoad };
        case SET_CONFIRM: return { ...state, confirm: action.confirm };
        case SET_VIEW_PARAMS: return { ...state, viewParams: { ...action.viewParams } };
        case RESET_VIEW: return initialState(state, ["viewParams", "markers", "defaultMarkers"]);
        default: return state;
    }
};
