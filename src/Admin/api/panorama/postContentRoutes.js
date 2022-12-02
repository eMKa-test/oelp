import { toast } from "react-toastify";
import { postData } from "../../../api";
import { GET_CONTENT_ROUTES_API_URL } from "../../constants";

const postContentRoutes = async (body, callback) => {
    try {
        const result = await postData({
            mainUrl: GET_CONTENT_ROUTES_API_URL,
            body,
        });
        if (result.success) {
            toast.success("Изменения сохранены");
            callback(result.payload);
        } else {
            console.error(result.message);
            toast.error(`Ошибка, ${result.message}`, { autoClose: 4000 });
        }
    } catch (err) {
        console.error(err);
        toast.error("Неизвестная ошибка", { autoClose: 4000 });
    }
};

export default postContentRoutes;
