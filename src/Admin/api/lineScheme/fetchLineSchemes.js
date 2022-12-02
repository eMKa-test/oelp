import { getData } from "../../../api";
import { GET_LINE_SCHEME_API_URL } from "../../constants";

const fetchLineSchemes = async ({
    lineId,
    contentType,
}) => {
    try {
        const result = await getData({
            mainUrl: GET_LINE_SCHEME_API_URL,
            params: {
                lineId,
                contentType,
            },
        });
        if (result.success) {
            return result.payload;
        }
        return null;
    } catch (err) {
        throw Error(err);
    }
};

export default fetchLineSchemes;
