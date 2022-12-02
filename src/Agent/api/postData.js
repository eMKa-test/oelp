import axios from "axios";

export const { CancelToken } = axios;

export function postData({
    url = "",
    onUploadProgress = () => null,
    body,
    cancelFn = () => null,
}) {
    const options = {
        cancelToken: new CancelToken((c) => {
            cancelFn(c);
        }),
        onUploadProgress,
        baseURL: `${window.location.origin}/`,
    };
    return axios.post(url, body, options);
}
