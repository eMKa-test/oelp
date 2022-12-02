import {
    LOAD_OBJECTS, LOAD_OBJECTS_PAGINATION, LOADING_OBJECTS,
} from "../../constants";

const initialState = () => ({
    objects: [],
    pagination: {},
    loading: false,
});

const objectsReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOADING_OBJECTS:
            return {
                ...state,
                loading: action.loading,
            };
        case LOAD_OBJECTS: {
            return {
                ...state,
                objects: action.objects,
            };
        }
        case LOAD_OBJECTS_PAGINATION:
            return {
                ...state,
                pagination: action.pagination,
            };
        default:
            return state;
    }
};

export default objectsReducer;
