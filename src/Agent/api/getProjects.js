import { toast } from "react-toastify";
import { getData } from "../../api";
import { GET_PROJECTS_API } from "../contstants";

// Получение списка не загруженных до конца сетов
export const getProjects = async () => {
    try {
        const result = await getData({ mainUrl: GET_PROJECTS_API });
        if (!result.success) {
            toast.error(`Неизвестная ошибка ${result.message}`, { autoClose: 4000 });
        }
        return result.payload;
    } catch (err) {
        throw new Error(err);
    }
};
