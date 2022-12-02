import {
    LOAD_COMPANIES, LOAD_COMPANIES_PAGINATION, LOADING_COMPANIES, LOAD_ALL_PROJECTS,
} from "Admin/constants";

const initialState = () => ({
    companies: [],
    projects: [],
    pagination: {},
    loading: false,
});

const companiesReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOADING_COMPANIES: {
            return { ...state, loading: action.loading };
        }
        case LOAD_COMPANIES:
            return { ...state, companies: action.companies };
        case LOAD_ALL_PROJECTS: {
            const { projects } = action;
            // const companiesWithProjects = [];
            // if (state.companies.length) {
            //     state.companies.forEach((comp) => {
            //         const company = {
            //             ...comp,
            //             projects: projects.filter((p) => p.companies[0] === comp.id),
            //         };
            //         companiesWithProjects.push(company);
            //     });
            // }
            return { ...state, projects };
        }
        case LOAD_COMPANIES_PAGINATION:
            return { ...state, pagination: action.pagination };
        default:
            return state;
    }
};

export default companiesReducer;
