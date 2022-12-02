import { SET_ROUTER_PARAMS } from "../../constants";

const initialState = () => ({
    companyID: null,
    objectID: null,
    lineID: null,
    lineConfig: null,
    url: "",
});

const companiesReducer = (state = initialState(), action) => {
    switch (action.type) {
        case SET_ROUTER_PARAMS: {
            return { ...state, ...action.params };
        }
        default:
            return state;
    }
};

export default companiesReducer;
