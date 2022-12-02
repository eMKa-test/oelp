import { toast } from "react-toastify";
import { postData } from "../../../api";
import { ERROR, GET_LINE_SCHEME_API_URL } from "../../constants";

const updateLineSchemePoints = async ({
    lineId,
    contentType,
    date,
    points,
}) => {
    try {
        const result = await postData({
            mainUrl: GET_LINE_SCHEME_API_URL,
            body: {
                lineId,
                contentType,
                date,
                points,
            },
        });
        if (result.success) {
            toast.success("Точки обновлены");
            return result.payload;
        }
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
        return null;
    } catch (err) {
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
        throw Error(err);
    }
};

export default updateLineSchemePoints;
