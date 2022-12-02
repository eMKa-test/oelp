import { toast } from "react-toastify";
import { getData } from "../../api";
import { GET_AUTH } from "../contstants";

// Получение списка не загруженных до конца сетов
export const getAuth = async () => {
    try {
        const result = await getData({ mainUrl: GET_AUTH });
        if (!result.success) {
            toast.error(`Неизвестная ошибка ${result.message}`, { autoClose: 4000 });
            return null;
        }
        return result.payload;
    } catch (err) {
        return null;
    }
};
