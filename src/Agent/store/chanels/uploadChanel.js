import { eventChannel, END } from "redux-saga";
import { uploadContent } from "../../api";

export default (body, unsubscribe = () => {
}) => {
    return eventChannel((emitter) => {
        const onProgress = (ev) => {
            const progress = Math.round((ev.loaded * 100) / ev.total);
            emitter({ progress });
        };
        const onFailure = (error) => {
            emitter({ error });
        };
        uploadContent(body, onProgress)
            .then((res) => {
                if (res.data.success) {
                    emitter({ payload: res.data.payload });
                }
            })
            .catch((error) => {
                if (error.message === "Network Error") {
                    emitter({
                        error,
                        networkError: true,
                    });
                } else {
                    onFailure(error);
                }
            })
            .finally(() => emitter(END));
        return unsubscribe;
    });
};
