import { toast } from "react-toastify";
import { postData } from "../../../api";
import { ERROR, GET_LINE_SCHEME_API_URL } from "../../constants";

const uploadLineScheme = async ({
    contentType,
    date,
    lineId,
    file,
}) => {
    try {
        const body = new FormData();
        body.append("file", file);
        body.append("contentType", contentType);
        body.append("date", date);
        body.append("lineId", lineId);
        const res = await postData({
            mainUrl: GET_LINE_SCHEME_API_URL,
            body,
        });
        if (res.success) {
            toast.success("Схема загружена");
            return res.payload;
        }
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
        return null;
    } catch (err) {
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
        throw Error(err);
    }
};

export default uploadLineScheme;
