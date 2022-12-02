import {
    ADD_LOG,
    RESET_LOGS,
} from "../actionsCreator/loggerActions";

const initialState = () => ({
    log: JSON.stringify([]),
});

export default function appReducer(state = initialState(), action) {
    switch (action.type) {
        case ADD_LOG: {
            const {
                log,
            } = action;
            const _log = [...JSON.parse(state.log), JSON.parse(log)];
            return {
                ...state,
                log: JSON.stringify(_log),
            };
        }
        case RESET_LOGS:
            return initialState();
        default:
            return state;
    }
}
