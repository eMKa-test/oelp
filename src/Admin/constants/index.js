export const ADMIN_API = "/admin/api";

export const ROUTER_ROOT = "/admin";

export const USERS_API_URL = `${ADMIN_API}/users`;
export const OBJECTS_API_URL = `${ADMIN_API}/projects`;
export const COMPANIES_API_URL = `${ADMIN_API}/companies`;
export const PROMO_API_URL = `${ADMIN_API}/companyContent`;
export const GET_CONTENT_API_URL = (objectID, lineID, contentType) => `${ADMIN_API}/projects/${objectID}/lines/${lineID}/content/${contentType}`;
export const GET_CONTENT_DATES_API_URL = (objectID, lineID, contentType) => `${ADMIN_API}/projects/${objectID}/lines/${lineID}/content/${contentType}/calendar`;
export const UPDATE_CONTENT_NORTH_API_URL = (lineID, contentType) => `${ADMIN_API}/lines/${lineID}/content/${contentType}/updateMagneticAngle`;
export const GET_CONTENT_LOOPS_API_URL = `${ADMIN_API}/contentLoops`;
export const GET_CONTENT_ROUTES_API_URL = `${ADMIN_API}/contentRoute`;
export const GET_CONTENT_GPS_TMP = `${ADMIN_API}/gpsTmpls`;
export const GET_SERVER_PROCESS_STATUS_API_URL = `${ADMIN_API}/processingStatus/`;
export const DELETE_CONTENT_GPS_TMP = (id) => `${ADMIN_API}/gpsTmpls/${id}`;
export const GET_LINE_SCHEME_API_URL = `${ADMIN_API}/lineSchemes/`;

export const GET_USERS = "GET_USERS";
export const LOAD_USERS = "LOAD_USERS";
export const PUT_USER = "PUT_USER";
export const LOAD_USERS_PAGINATION = "LOAD_USERS_PAGINATION";

export const CLEAR_MEMORY = "CLEAR_MEMORY";

export const LOAD_OPERATOR = "LOAD_OPERATOR";
export const GET_OPERATOR = "GET_OPERATOR";

export const GET_PANORAMA_CONTENT_ROUTES = "GET_PANORAMA_CONTENT_ROUTES";
export const LOAD_PANORAMA_CONTENT_ROUTES = "LOAD_PANORAMA_CONTENT_ROUTES";

export const CHANGE_PANORAMA_TAB = "CHANGE_PANORAMA_TAB";
export const TOGGLE_PANORAMA_MOUSE_CONTROL = "TOGGLE_PANORAMA_MOUSE_CONTROL";

export const GET_ALL_PROJECTS = "GET_ALL_PROJECTS";
export const LOAD_ALL_PROJECTS = "LOAD_ALL_PROJECTS";
export const GET_CONTENT_LOOPS = "GET_CONTENT_LOOPS";
export const LOAD_CONTENT_LOOPS = "LOAD_CONTENT_LOOPS";

export const GET_COMPANIES = "GET_COMPANIES";
export const LOAD_COMPANIES = "LOAD_COMPANIES";
export const LOAD_COMPANIES_PAGINATION = "LOAD_COMPANIES_PAGINATION";
export const PUT_COMPANIES = "PUT_COMPANIES";
export const DELETE_COMPANIES = "DELETE_COMPANIES";
export const GET_COMPANIES_BY_ID = "GET_COMPANIES_BY_ID";
export const LOAD_COMPANIES_BY_ID = "LOAD_COMPANIES_BY_ID";
export const LOADING_COMPANIES = "LOADING_COMPANIES";

export const GET_PROMO_BY_COMPANIES = "GET_PROMO_BY_COMPANIES";
export const LOAD_PROMO_BY_COMPANIES = "LOAD_PROMO_BY_COMPANIES";
export const PUT_PROMO = "PUT_PROMO";
export const DELETE_PROMO_BY_ID = "DELETE_PROMO_BY_ID";
export const CLEAR_PROMO = "CLEAR_PROMO";

export const GET_OBJECTS = "GET_OBJECTS";
export const GET_OBJECT_BY_ID = "GET_OBJECT_BY_ID";
export const LOAD_OBJECT_BY_ID = "LOAD_OBJECT_BY_ID";
export const LOAD_OBJECTS = "LOAD_OBJECTS";
export const LOADING_OBJECTS = "LOADING_OBJECTS";
export const LOAD_OBJECTS_PAGINATION = "LOAD_OBJECTS_PAGINATION";
export const PUT_OBJECT = "PUT_OBJECT";
export const DELETE_OBJECT = "DELETE_OBJECT";

export const GET_LINE_BY_ID = "GET_LINE_BY_ID";
export const LOAD_LINE_BY_ID = "LOAD_LINE_BY_ID";
export const PUT_LINE = "PUT_LINE";
export const LOAD_LINE_SCHEMES = "LOAD_LINE_SCHEMES";
export const GET_LINE_SCHEME = "GET_LINE_SCHEME";
export const DELETE_LINE_SCHEME = "DELETE_LINE_SCHEME";
export const UPLOAD_LINE_SCHEME = "UPLOAD_LINE_SCHEME";
export const ADD_LINE_SCHEME = "ADD_LINE_SCHEME";
export const REMOVE_LINE_SCHEME = "REMOVE_LINE_SCHEME";
export const SET_POINTS_LINE_SCHEME = "SET_POINTS_LINE_SCHEME";
export const LOAD_POINTS_LINE_SCHEME = "LOAD_POINTS_LINE_SCHEME";

export const MAIN_SLIDE_SPEED = 200;
export const GET_POINT_BY_ID = "GET_POINT_BY_ID";
export const LOAD_POINT_BY_ID = "LOAD_POINT_BY_ID";
export const PUT_POINT = "PUT_POINT";

export const GET_PROMO_FILTERS = "GET_PROMO_FILTERS";
export const LOAD_PROMO_FILTERS = "LOAD_PROMO_FILTERS";
export const POST_PROMO_FILTER = "POST_PROMO_FILTER";
export const PUT_PROMO_FILTER = "PUT_PROMO_FILTER";
export const DELETE_PROMO_FILTER = "DELETE_PROMO_FILTER";
export const GET_PROMO_FILTER_BY_ID = "GET_PROMO_FILTER_BY_ID";
export const LOAD_PROMO_FILTER_BY_ID = "LOAD_PROMO_FILTER_BY_ID";

/*
* Lines ab content
* */
export const GET_INITIAL_CONTENT = "GET_INITIAL_CONTENT";
export const LOADING_CONTENT = "LOADING_CONTENT";
export const LOADING_CONTENT_WITH_PAGINATION = "LOADING_CONTENT_WITH_PAGINATION";
export const GET_CONTENT = "GET_CONTENT";
export const LOAD_CONTENT = "LOAD_CONTENT";
export const GET_CONTENT_DATES = "GET_CONTENT_DATES";
export const LOAD_CONTENT_DATES = "LOAD_CONTENT_DATES";
export const CHANGE_DATE_FROM = "CHANGE_DATE_FROM";
export const CHANGE_CONTENT_TYPE = "CHANGE_CONTENT_TYPE";
export const GET_CONTENT_WITH_PAGINATION = "GET_CONTENT_WITH_PAGINATION";
export const LOAD_CONTENT_WITH_PAGINATION = "LOAD_CONTENT_WITH_PAGINATION";
export const SET_UPLOAD_URL = "SET_UPLOAD_URL";
export const SET_DATE_FROM = "SET_DATE_FROM";
export const SET_PAGINATION = "SET_PAGINATION";
export const UPDATE_CONTENT = "UPDATE_CONTENT";
export const CLEAR_CONTENT_MEMORY = "CLEAR_CONTENT_MEMORY";

/*
* Map
* */
export const SET_ACTIVE_MARKER = "SET_ACTIVE_MARKER";
export const ADD_TO_EDIT = "ADD_TO_EDIT";
export const DELETE_FROM_EDIT = "DELETE_FROM_EDIT";
export const LOAD_MAP_CONFIG = "LOAD_MAP_CONFIG";
export const LOADING_MAP = "LOADING_MAP";
export const RESET_EDIT_MODE = "RESET_EDIT_MODE";
export const UPDATE_MARKERS_POSITION = "UPDATE_MARKERS_POSITION";
export const LOADING_SUBMIT = "LOADING_SUBMIT";
export const POLY_MODE = "POLY_MODE";

/*
* Router
* */
export const SET_ROUTER_PARAMS = "SET_ROUTER_PARAMS";

/*
* GPS TMP
* */
export const SET_GPS_TMP = "SET_GPS_TMP";
export const GET_GPS_TMP = "GET_GPS_TMP";
export const POST_GPS_TMP = "POST_GPS_TMP";
export const DELETE_GPS_TMP = "DELETE_GPS_TMP";

export const GUEST_USER = {
    id: 0,
    email: "",
    name: "ГОСТЬ",
    kind: "",
};
export const ROUTES_TABS = [
    {
        id: 1,
        tabName: "АЭРО",
        name: "Аэро",
        to: "aeropanorama",
    },
    {
        id: 2,
        tabName: "АЭРОСЪЕМКА",
        name: "Аэросъёмка",
        to: "aerial",
    },
    {
        id: 3,
        tabName: "ТАЙМЛАПС",
        name: "Таймлапс",
        to: "timelapse",
    },
    {
        id: 4,
        tabName: "ПРОСМОТР",
        name: "Просмотр",
        to: "panorama",
    },
    {
        id: 5,
        tabName: "ФОТО",
        name: "Фото",
        to: "image",
    },
    {
        id: 6,
        tabName: "ВИДЕО",
        name: "Видео",
        to: "video",
    },
];

export const TOAST_MESSAGE = {
    REQUEST_SUCCESS: "Изменения успешно сохранены",
    ERROR_UNKNOWN: "Неизвестная ошибка. Попробуйте позже или обратитесь к кому-нибудь.",
};

export const ERROR = {
    UNKNOWN: "Не известно",
};

export const OBJECTS_PAGINATION_DEFAULT = 100;
export const CONTENT_SETS_PAGINATION_DEFAULT = 100;
