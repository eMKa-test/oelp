export const GET_INITIAL_STATE = "GET_INITIAL_STATE";
export const LOAD_INITIAL_STATE = "LOAD_INITIAL_STATE";
export const LOAD_ACTIVE = "LOAD_ACTIVE";
export const LOAD_USER = "LOAD_USER";
export const LOAD_PROJECTS = "LOAD_PROJECTS";
export const CHANGE_DATE = "CHANGE_DATE";

export const RESET_APP = "RESET_APP";
export const RESET_STATE = "RESET_STATE";

export const CHUNK_MODE = "CHUNK_MODE";
export const toggleUploadChunk = () => ({
    type: CHUNK_MODE,
});

export const setChunkMode = (chunkMode) => ({
    type: CHUNK_MODE,
    chunkMode,
});

export const resetState = () => ({
    type: RESET_STATE,
});

export const getInitialState = () => ({
    type: GET_INITIAL_STATE,
});

export const loadInitialState = (contentSets) => ({
    type: LOAD_INITIAL_STATE,
    contentSets,
});

export const loadUser = (user) => ({
    type: LOAD_USER,
    user,
});

export const loadActive = (load) => ({
    type: LOAD_ACTIVE,
    load,
});

export const loadProjects = (objects) => ({
    type: LOAD_PROJECTS,
    objects,
});

export const changeDate = (date) => ({
    type: CHANGE_DATE,
    date,
});

export const resetApp = () => ({
    type: RESET_APP,
});
