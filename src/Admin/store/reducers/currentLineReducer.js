import orderBy from "lodash/orderBy";
import moment from "moment";
import { objectOrState } from "../../../utils/helpers";
import {
    ADD_LINE_SCHEME,
    REMOVE_LINE_SCHEME,
    LOAD_LINE_BY_ID,
    LOAD_LINE_SCHEMES,
    CLEAR_MEMORY, LOAD_POINTS_LINE_SCHEME,
} from "../../constants";

const initialState = () => ({
    id: -1,
    name: "",
    gps: {
        lat: 0,
        long: 0,
    },
    schemes: [],
});

const currentLineReducer = (state = initialState(), action) => {
    switch (action.type) {
        case CLEAR_MEMORY:
            return initialState();
        case LOAD_LINE_BY_ID: {
            return objectOrState(action.line, state);
        }
        case LOAD_LINE_SCHEMES: {
            return {
                ...state,
                schemes: action.schemes,
            };
        }
        case ADD_LINE_SCHEME: {
            const arr = [...state.schemes, action.scheme];
            const schemes = orderBy(arr, (o) => moment(o.date), ["desc"]);
            return {
                ...state,
                schemes,
            };
        }
        case REMOVE_LINE_SCHEME: {
            const dates = state.schemes.filter((scheme) => scheme.id !== action.schemeId);
            const schemes = orderBy(dates, (o) => moment(o.date), ["desc"]);
            return {
                ...state,
                schemes,
            };
        }
        case LOAD_POINTS_LINE_SCHEME: {
            const {
                data: {
                    date,
                    points,
                },
            } = action;
            const schemes = [...state.schemes];
            schemes.forEach((scheme) => {
                if (scheme.date === date) {
                    scheme.points = [...points];
                }
            });
            return {
                ...state,
                schemes,
            };
        }
        default:
            return state;
    }
};

export default currentLineReducer;
