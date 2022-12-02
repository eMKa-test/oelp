import { combineReducers } from "redux";
import app from "./appReducer";
import upload from "./uploadReducer";
import logs from "./loggerReducer";

export default combineReducers({
    app,
    upload,
    logs,
});
