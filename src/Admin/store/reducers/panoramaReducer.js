import {
    LOAD_PANORAMA_CONTENT_ROUTES,
    LOAD_CONTENT_LOOPS,
    CHANGE_PANORAMA_TAB,
    TOGGLE_PANORAMA_MOUSE_CONTROL,
} from "../../constants";

const initialState = () => ({
    contentLoops: [],
    loop: null,
    contentRoutes: null,
    panoramaTab: "map",
    mouseControl: false,
});

export default (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_CONTENT_LOOPS: {
            return {
                ...state,
                contentLoops: [...action.contentLoops],
                loop: action.contentLoops[0] || null,
            };
        }
        case CHANGE_PANORAMA_TAB: {
            return { ...state, panoramaTab: action.panoramaTab };
        }
        case TOGGLE_PANORAMA_MOUSE_CONTROL: {
            return { ...state, mouseControl: action.mouseControl };
        }
        case LOAD_PANORAMA_CONTENT_ROUTES: {
            return { ...state, contentRoutes: action.contentRoutes };
        }
        default:
            return state;
    }
};
