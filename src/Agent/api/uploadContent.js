import { FILE_SET_UPLOAD_API } from "../contstants";
import { postData } from "./postData";

export const uploadContent = (params, onUploadProgress, cancelFn) => {
    const {
        file,
        fileId,
    } = params;
    const body = new FormData();
    body.append("file", file);
    body.append("fileId", fileId);
    return postData(
        {
            url: FILE_SET_UPLOAD_API,
            body,
            onUploadProgress,
            cancelFn,
        },
    );
};
