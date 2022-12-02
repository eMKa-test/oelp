import {
    GET_COMPANIES,
    LOAD_COMPANIES,
    PUT_COMPANIES,
    DELETE_COMPANIES,
    LOAD_COMPANIES_BY_ID,
    GET_COMPANIES_BY_ID,
} from "Admin/constants";
import { GET_ALL_PROJECTS, LOAD_ALL_PROJECTS } from "../../constants";

export function getCompaniesByID(id, params) {
    if (typeof id === "undefined") {
        warn({ id }, "getCompaniesByID");
        return null;
    }
    return {
        type: GET_COMPANIES_BY_ID,
        id,
        params,
    };
}

export function loadCompaniesByID(companies) {
    return {
        type: LOAD_COMPANIES_BY_ID,
        companies,
    };
}

export function getCompanies(params = {}) {
    return {
        type: GET_COMPANIES,
        params,
    };
}

export function loadCompanies(companies) {
    return {
        type: LOAD_COMPANIES,
        companies,
    };
}
export function loadAllProjects(projects) {
    return {
        type: LOAD_ALL_PROJECTS,
        projects,
    };
}

export function getAllProjects() {
    return {
        type: GET_ALL_PROJECTS,
    };
}

export function putCompanies({ company, params = {} }) {
    if (typeof company === "undefined") {
        warn({ company }, "putCompanies");
        return null;
    }
    return {
        type: PUT_COMPANIES,
        company,
        params,
    };
}

export function deleteCompanies(id) {
    if (typeof id === "undefined") {
        warn({ id }, "deleteCompanies");
        return null;
    }
    return {
        type: DELETE_COMPANIES,
        id,
    };
}
