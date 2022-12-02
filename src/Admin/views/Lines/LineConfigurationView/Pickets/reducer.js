export const initialState = () => ({
    pickets: null,
    loading: false,
    openPickets: false,
});

const GET_PICKETS = "GET_PICKETS";
const LOADING = "LOADING";
const OPEN_PICKETS = "OPEN_PICKETS";

export default (state, action) => {
    switch (action.type) {
        case LOADING: {
            return { ...state, loading: action.loading };
        }
        case OPEN_PICKETS: {
            return { ...state, openPickets: action.openPickets };
        }
        case GET_PICKETS: {
            return { ...state, pickets: action.pickets, loading: false };
        }
        default: return state;
    }
};
