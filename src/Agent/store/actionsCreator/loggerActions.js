export const ADD_LOG = "ADD_LOG";
export const addLog = (log, error) => ({
    type: ADD_LOG,
    log,
    error,
});

export const RESET_LOGS = "RESET_LOGS";
export const resetLogs = () => ({
    type: RESET_LOGS,
});
