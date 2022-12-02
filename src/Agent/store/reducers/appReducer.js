import { toast } from "react-toastify";
import {
    LOAD_INITIAL_STATE,
    LOAD_USER,
    LOAD_ACTIVE,
    LOAD_PROJECTS,
    CHANGE_DATE,
    RESET_APP,
    CHUNK_MODE,
} from "../actionsCreator/appActions";

const initialState = () => ({
    load: false,
    user: null,
    objects: [],
    lines: [],
    contentSets: [],
    date: moment()
        .format("YYYY-MM-DD"),
    chunkMode: false,
});

const chunkModeTitles = [
    "Обычный режим загрузки",
    "Режим медленной загрузки. Скорость передачи данных составит 1Мб",
];

export default function appReducer(state = initialState(), action) {
    switch (action.type) {
        case LOAD_INITIAL_STATE: {
            const { contentSets } = action;
            return {
                ...state,
                contentSets,
            };
        }
        case CHUNK_MODE: {
            const chunkMode = !state.chunkMode;
            const msg = chunkModeTitles[Number(chunkMode)];
            if (!chunkMode) {
                toast.info(msg, {
                    position: "top-left",
                    autoClose: 3000,
                });
            } else {
                toast.warning(msg, {
                    position: "top-left",
                    autoClose: 3000,
                });
            }
            return {
                ...state,
                chunkMode,
            };
        }
        case LOAD_USER:
            return {
                ...state,
                user: action.user,
            };
        case LOAD_ACTIVE:
            return {
                ...state,
                load: action.load,
            };
        case CHANGE_DATE:
            return {
                ...state,
                date: action.date,
            };
        case LOAD_PROJECTS: {
            const { objects } = action;
            const lines = [];
            for (let i = 0; i < objects.length; i += 1) {
                lines.push(...objects[i].lines);
                for (let k = 0; k < objects[i].lines.length; k += 1) {
                    objects[i].lines[k].projectId = objects[i].id;
                    objects[i].lines[k].projectName = objects[i].name;
                }
            }
            return {
                ...state,
                objects,
                lines,
            };
        }
        case RESET_APP:
            return initialState();
        default:
            return state;
    }
}
