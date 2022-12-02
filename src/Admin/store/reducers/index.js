import { combineReducers } from "redux";

import generalReducer from "./generalReducer";
import usersReducer from "./usersReducer";
import companiesReducer from "./companiesReducer";
import objectsReducer from "./objectsReducer";
import currentCompanyReducer from "./currentCompanyReducer";
import currentObjectReducer from "./currentObjectReducer";
import currentLineReducer from "./currentLineReducer";
import promoReducer from "./promoReducer";
import contentReducer from "./contentReducer";
import routerReducer from "./routerReducer";
import mapReducer from "./mapReducer";
import panoramaReducer from "./panoramaReducer";

const reducers = combineReducers({
    general: generalReducer,
    users: usersReducer,
    companies: companiesReducer,
    promo: promoReducer,
    objects: objectsReducer,
    currentCompany: currentCompanyReducer,
    currentObject: currentObjectReducer,
    currentLine: currentLineReducer,
    content: contentReducer,
    map: mapReducer,
    router: routerReducer,
    panorama: panoramaReducer,
});

export default reducers;
