export const initialState = (state, exclude) => {
    const result = {
        selectedObjectId: null,
        load: true,
        loadFetch: false,
        objects: [],
        lines: [],
        selectedLines: [],
        objectToMove: null,
        draggingLineObject: null,
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

const SET_LOAD_FETCH = "SET_LOAD_FETCH";
export const setLoadFetch = (loadFetch) => ({ type: SET_LOAD_FETCH, loadFetch });
const LOAD_OBJECTS = "LOAD_OBJECTS";
export const loadObjects = (objects) => ({ type: LOAD_OBJECTS, objects });
const SELECT_OBJECT = "SELECT_OBJECT";
export const selectObject = (index) => ({ type: SELECT_OBJECT, index });
const SET_DRAGGING_LINE = "SET_DRAGGING_LINE";
export const setDraggingLine = (draggingLineObject) => ({ type: SET_DRAGGING_LINE, draggingLineObject });
const SET_SELECTED_LINES = "SET_SELECTED_LINES";
export const setSelectedLines = (lineId) => ({ type: SET_SELECTED_LINES, lineId });
const SET_OBJECT_TO_MOVE = "SET_OBJECT_TO_MOVE";
export const setObjectToMove = (objectId) => ({ type: SET_OBJECT_TO_MOVE, objectId });
const RESET_SELECT_MODE = "RESET_SELECT_MODE";
export const cancelSelectMode = () => ({ type: RESET_SELECT_MODE });
const RESET_DRAGGING_LINE = "RESET_DRAGGING_LINE";
export const resetDraggingLine = (draggingLineObject) => ({ type: RESET_DRAGGING_LINE, draggingLineObject });
const RESET = "RESET";
export const reset = () => ({ type: RESET });

export default (state, action) => {
    switch (action.type) {
        case SET_DRAGGING_LINE: {
            return { ...state, draggingLineObject: action.draggingLineObject };
        }
        case RESET_SELECT_MODE: {
            return { ...state, selectedLines: [], objectToMove: null };
        }
        case RESET_DRAGGING_LINE: {
            return { ...state, draggingLineObject: null };
        }
        case SET_OBJECT_TO_MOVE: {
            const { objectId } = action;
            const objectToMove = state.selectedObjectId !== objectId ? objectId : state.objectToMove;
            return { ...state, objectToMove };
        }
        case SET_SELECTED_LINES: {
            const { lineId } = action;
            const selectedLines = [...state.selectedLines];
            const matchIndex = state.selectedLines.findIndex((id) => id === lineId);
            if (matchIndex >= 0) {
                selectedLines.splice(matchIndex, 1);
            } else {
                selectedLines.push(lineId);
            }
            return { ...state, selectedLines };
        }
        case LOAD_OBJECTS: {
            const { objects } = action;
            let lines = [];
            if (state.selectedObjectId) {
                const selectedObject = objects.find((o) => o.id === state.selectedObjectId);
                if (selectedObject) {
                    lines = [...selectedObject.lines];
                }
            }
            return {
                ...state, objects: [...objects], load: false, lines,
            };
        }
        case SET_LOAD_FETCH: {
            return { ...state, loadFetch: action.loadFetch };
        }
        case SELECT_OBJECT: {
            const { index } = action;
            const selected = state.objects[index];
            return { ...state, lines: [...selected.lines], selectedObjectId: selected.id };
        }
        case RESET: return initialState(state, ["selectedObjectId", "objects"]);
        default: return state;
    }
};
