import { toast } from "react-toastify";
import { getData } from "../../api";
import { CONTENT_SETS_API } from "../contstants";

// Получение списка не загруженных до конца сетов
export const getContentSets = async (callback = () => null) => {
    try {
        const result = await getData({ mainUrl: CONTENT_SETS_API });
        if (!result.success) {
            console.error(result.message);
            toast.error(`Неизвестная ошибка ${result.message}`, { autoClose: 4000 });
        }
        callback(result.payload);
        return result.payload;
    } catch (err) {
        throw new Error(err);
    }
};
