import {
    LOAD_CONTENT,
    LOADING_CONTENT,
    LOAD_CONTENT_DATES,
    CHANGE_DATE_FROM,
    CHANGE_CONTENT_TYPE,
    SET_UPLOAD_URL,
    CLEAR_CONTENT_MEMORY,
    SET_GPS_TMP,
} from "../../constants";

const initialState = () => ({
    load: true,
    loadPagination: true,
    content: [],
    dates: [],
    dateFrom: null,
    contentType: "image",
    uploadUrl: "",
    gpsTmp: null,
});

const currentCompanyReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_CONTENT: {
            return {
                ...state,
                content: [...action.content],
            };
        }
        case LOAD_CONTENT_DATES: {
            const dates = action.dates.map((date) => moment(date)
                .toString());
            return {
                ...state,
                dates,
            };
        }
        case CHANGE_DATE_FROM:
            return {
                ...state,
                dateFrom: action.dateFrom,
            };
        case SET_GPS_TMP:
            return {
                ...state,
                gpsTmp: action.gpsTmp,
            };
        case CHANGE_CONTENT_TYPE:
            return {
                ...state,
                contentType: action.contentType,
            };
        case LOADING_CONTENT:
            return {
                ...state,
                load: action.load,
            };
        case SET_UPLOAD_URL:
            return {
                ...state,
                uploadUrl: action.uploadUrl,
            };
        case CLEAR_CONTENT_MEMORY:
            return initialState();
        default:
            return state;
    }
};

export default currentCompanyReducer;
