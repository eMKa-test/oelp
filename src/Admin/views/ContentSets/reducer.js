import moment from "moment";
import { CONTENT_TYPES, getUrlParams, STATUSES } from "./helpers";
import { CONTENT_SETS_PAGINATION_DEFAULT } from "../../constants";

const SET_LOADING = "SET_LOADING";
export const setLoading = (loading) => ({
    type: SET_LOADING,
    loading,
});
const LOAD_CONTENT_SETS = "LOAD_CONTENT_SETS";
export const loadContentSet = (contentSets) => ({
    type: LOAD_CONTENT_SETS,
    contentSets,
});
const SET_PAGINATION = "SET_PAGINATION";
export const setPagination = (pagination) => ({
    type: SET_PAGINATION,
    pagination,
});
const LOAD_USERS_PROJECTS_LINES = "LOAD_USERS_PROJECTS_LINES";
export const loadUsersProjectsLines = (users, projects, lines) => ({
    type: LOAD_USERS_PROJECTS_LINES,
    users,
    projects,
    lines,
});
const CHANGE_FILTER = "CHANGE_FILTER";
export const changeFilter = (filter) => ({
    type: CHANGE_FILTER,
    filter,
});

const initialFilter = () => ({
    status: "ALL",
    contentType: "ALL",
    dateFrom: moment()
        .subtract(14, "day")
        .format("YYYY-MM-DD"),
    dateTo: moment()
        .format("YYYY-MM-DD"),
    lineId: "ALL",
    userId: "ALL",
});

const initialArrays = {
    id: "ALL",
    name: "Все",
};

export const initialState = () => ({
    loading: true,
    users: [initialArrays],
    projects: [initialArrays],
    lines: [initialArrays],
    contentSets: [],
    statuses: STATUSES,
    contentTypes: CONTENT_TYPES,
    limit: CONTENT_SETS_PAGINATION_DEFAULT,
    pages: 0,
    total: 0,
    page: 1,
    filter: initialFilter(),
    urlParams: getUrlParams(initialFilter()),
});

export default (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case LOAD_USERS_PROJECTS_LINES: {
            const users = action.users.map((user) => ({
                id: user.id,
                name: user.name,
            }));
            const lines = action.lines.map((lines) => ({
                id: lines.id,
                name: lines.name,
            }));
            const projects = action.projects.map((project) => ({
                id: project.id,
                name: project.name,
            }));
            return {
                ...state,
                users: [...state.users, ...users],
                lines: [...state.lines, ...lines],
                projects: [...state.projects, ...projects],
            };
        }
        case LOAD_CONTENT_SETS:
            return {
                ...state,
                contentSets: [...action.contentSets],
            };
        case CHANGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...action.filter,
                },
                urlParams: getUrlParams(action.filter),
            };
        case
        SET_PAGINATION: {
            return { ...state, ...action.pagination };
        }
        default:
            return state;
    }
};
