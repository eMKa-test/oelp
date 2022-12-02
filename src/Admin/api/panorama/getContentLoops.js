import { getData } from "../../../api";
import { GET_CONTENT_LOOPS_API_URL } from "../../constants";

const getContentLoops = async (params) => {
    try {
        const result = await getData({
            mainUrl: GET_CONTENT_LOOPS_API_URL,
            params,
        });
        if (result.success) {
            return result.payload;
        }
    } catch (err) {
        throw new Error(err);
    }
};

export default getContentLoops;
