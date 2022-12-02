import isEmpty from "lodash/isEmpty";
import { convertCoordsFromImageScale } from "./helpers";

const LOAD_SCHEMES = "LOAD_SCHEMES";
export const loadSchemes = (dispatchFn, schemes) => dispatchFn(({
    type: LOAD_SCHEMES,
    schemes,
}));
const SELECT_SCHEME = "SELECT_SCHEME";
export const selectScheme = (dispatchFn, schemeId) => dispatchFn(({
    type: SELECT_SCHEME,
    schemeId,
}));
const CHANGE_MODE = "CHANGE_MODE";
export const changeMode = (dispatchFn, mode) => dispatchFn(({
    type: CHANGE_MODE,
    mode,
}));
const SET_DOTS = "SET_DOTS";
export const setDots = (dispatchFn, dots) => dispatchFn(({
    type: SET_DOTS,
    dots,
}));
const SET_DEFAULT_DOTS_COORDS = "SET_DEFAULT_DOTS_COORDS";
export const setDefaultDotsCoords = (dispatchFn, defaultCoords) => dispatchFn(({
    type: SET_DEFAULT_DOTS_COORDS,
    defaultCoords,
}));
const CHANGE_COORDS = "CHANGE_COORDS";
export const setDotCoords = (dispatchFn, dot) => dispatchFn(({
    type: CHANGE_COORDS,
    dot,
}));
const SET_VIEW_PARAMS = "SET_VIEW_PARAMS";
export const setViewParams = (dispatchFn, viewParams) => dispatchFn(({
    type: SET_VIEW_PARAMS,
    viewParams,
}));

export const initialState = () => ({
    schemes: [],
    selectedScheme: null,
    zoomMode: false,
    gridMode: false,
    dots: [],
    viewParams: {
        width: 0,
        height: 0,
    },
    defaultCoords: {
        x: 25,
        y: 25,
    },
});

export default (state, action) => {
    switch (action.type) {
        case LOAD_SCHEMES: {
            const { schemes } = action;
            let selectedScheme = null;
            const dots = [];
            if (!isEmpty(schemes)) {
                if (!state.selectedScheme || state.schemes.length < action.schemes.length) {
                    [selectedScheme] = schemes;
                } else {
                    selectedScheme = { ...state.selectedScheme };
                }
                if (state.viewParams?.width !== 0 && selectedScheme?.points) {
                    const res = selectedScheme.points.map((dot) => ({
                        ...dot,
                        schemePoint: convertCoordsFromImageScale(
                            selectedScheme.image,
                            state.viewParams,
                            dot.schemePoint,
                        ),
                    }));
                    dots.push(...res);
                }
            }
            return {
                ...state,
                schemes: action.schemes,
                selectedScheme,
                dots,
            };
        }
        case CHANGE_COORDS: {
            const { dot } = action;
            const dots = state.dots?.map((d) => {
                if (d.pointId === dot.pointId) {
                    d.schemePoint = dot.schemePoint;
                }
                return d;
            });
            return {
                ...state,
                dots,
            };
        }
        case CHANGE_MODE: {
            return {
                ...state,
                [action.mode]: !state[action.mode],
            };
        }
        case SET_VIEW_PARAMS: {
            const dots = [];
            if (state.selectedScheme?.points) {
                const res = state.selectedScheme.points.map((dot) => ({
                    ...dot,
                    schemePoint: convertCoordsFromImageScale(
                        state.selectedScheme.image,
                        action.viewParams,
                        dot.schemePoint,
                    ),
                }));
                dots.push(...res);
            }
            return {
                ...state,
                viewParams: { ...action.viewParams },
                dots,
            };
        }
        case SET_DEFAULT_DOTS_COORDS: {
            return {
                ...state,
                defaultCoords: action.defaultCoords,
            };
        }
        case SET_DOTS: {
            return {
                ...state,
                dots: [...action.dots],
            };
        }
        case SELECT_SCHEME: {
            const selectedScheme = state.schemes.find((el) => el.id === action.schemeId);
            const dots = [];
            if (selectedScheme.points) {
                dots.push(...selectedScheme.points);
            }
            return {
                ...state,
                selectedScheme,
                dots,
            };
        }
        default:
            return state;
    }
};
