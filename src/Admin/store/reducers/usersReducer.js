import { LOAD_USERS, LOAD_USERS_PAGINATION } from "Admin/constants";
import { arrayOrState } from "utils/helpers";

const initialState = () => ({
    users: [],
    pagination: {},
});

const usersReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_USERS: {
            return { ...state, users: action.users };
        }
        case LOAD_USERS_PAGINATION:
            return { ...state, pagination: action.pagination };
        default:
            return state;
    }
};

export default usersReducer;
