import { getData } from "../../../api";
import { GET_CONTENT_ROUTES_API_URL } from "../../constants";

const getContentRoutes = async (params) => {
    try {
        const result = await getData({
            mainUrl: GET_CONTENT_ROUTES_API_URL,
            params,
        });
        if (result.success) {
            return result.payload;
        }
    } catch (err) {
        throw new Error(err);
    }
};

export default getContentRoutes;
