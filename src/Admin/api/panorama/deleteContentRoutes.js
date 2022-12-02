import { toast } from "react-toastify";
import { delData } from "../../../api";
import { GET_CONTENT_ROUTES_API_URL } from "../../constants";

const deleteContentRoutes = async (id, callback) => {
    try {
        const url = `${GET_CONTENT_ROUTES_API_URL}/${id}`;
        const result = await delData(url);
        if (result.success) {
            toast.success("Успешно удалено");
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

export default deleteContentRoutes;
