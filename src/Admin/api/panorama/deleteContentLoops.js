import { toast } from "react-toastify";
import { delData } from "../../../api";
import { GET_CONTENT_LOOPS_API_URL } from "../../constants";

const deleteContentLoops = async (id) => {
    try {
        const result = await delData(`${GET_CONTENT_LOOPS_API_URL}/${id}`);
        if (result.success) {
            toast.success("Успешно удалено");
            return result;
        }
        console.error(result.message);
        toast.error(`Ошибка, ${result.message}`, { autoClose: 4000 });
    } catch (err) {
        console.error(err);
        toast.error("Неизвестная ошибка", { autoClose: 4000 });
    }
};

export default deleteContentLoops;
