import { eventChannel, END } from "redux-saga";
import delay from "lodash/delay";
import { uuidGenerator } from "../../common/helpers";
import { postData } from "../../api/postData";
import { FILE_SET_UPLOAD_API } from "../../contstants";

const CHUNK_SIZE = 1000000; // 1Mb
const MAX_RE_UPLOAD_CHUNK_ATTEMPT = 5; // 1Mb

export default (params, unsubscribe = () => {
}) => {
    return eventChannel((emitter) => {
        let chunkAttempts = 1;
        let offset = 0;
        const {
            file,
            fileId,
        } = params;
        const fileSize = file.size;
        const fileName = file.name.toLowerCase();
        const uid = uuidGenerator();
        const onProgress = (res) => {
            const progress = Math.round((res.loaded * 100) / res.total);
            emitter({ progress });
        };
        const onFailure = (error) => {
            emitter({ error });
        };
        const fr = new FileReader();
        let blob = file.slice(offset, CHUNK_SIZE);
        fr.readAsBinaryString(blob);
        fr.onload = (ev) => {
            const prevOffset = offset;
            offset += ev.target.result.length;
            const body = new FormData();
            body.append("uid", uid);
            body.append("fileId", fileId);
            body.append("fileName", fileName);
            body.append("data", ev.target.result);
            body.append("chunk", ev.target.result.length);
            body.append("chunkTotal", prevOffset);
            body.append("fileSize", fileSize);
            postData(
                {
                    url: FILE_SET_UPLOAD_API,
                    body,
                    onUploadProgress: () => onProgress({
                        total: fileSize,
                        loaded: offset,
                    }),
                },
            )
                .then((res) => {
                    if (res.data.success) {
                        if (offset < fileSize) {
                            if (chunkAttempts > 0) {
                                chunkAttempts = 0;
                            }
                            blob = file.slice(offset, offset + CHUNK_SIZE);
                            return fr.readAsBinaryString(blob);
                        }
                        emitter({ payload: res.data.payload });
                        emitter(END);
                    }
                })
                .catch((error) => {
                    if (error.message === "Network Error") {
                        offset -= ev.target.result.length;
                        if (chunkAttempts < MAX_RE_UPLOAD_CHUNK_ATTEMPT) {
                            chunkAttempts += 1;
                            return delay(() => {
                                blob = file.slice(prevOffset, prevOffset + CHUNK_SIZE);
                                return fr.readAsBinaryString(blob);
                            }, 1500);
                        }
                        emitter({
                            error,
                            networkError: true,
                        });
                        emitter(END);
                    } else {
                        onFailure(error);
                        emitter(END);
                    }
                });
        };
        return unsubscribe;
    });
};
