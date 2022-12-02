export const initialState = () => ({
    lines: [],
    limit: 50,
    pages: 0,
    total: 0,
    page: 1,
    isNewLine: false,
});

const OPEN_NEWLINE_MODAL = "OPEN_NEWLINE_MODAL";
export const setOpenNewLine = (isNewLine) => ({
    type: OPEN_NEWLINE_MODAL,
    isNewLine
});
const SET_PAGINATION = "SET_PAGINATION";
export const setPagination = (...args) => ({ type: SET_PAGINATION, ...args });

export const reducer = (state, action) => {
    switch (action.type) {
        case SET_PAGINATION: {
            const {
                type,
                ...args
            } = action;
            return { ...state, ...args[0] };
        }
        case OPEN_NEWLINE_MODAL: {
            return {
                ...state,
                isNewLine: action.isNewLine
            };
        }
        default:
            return state;
    }
};

export default null;
