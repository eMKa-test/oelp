import { toast } from "react-toastify";
import axios from "axios";
import { ERROR, GET_LINE_SCHEME_API_URL } from "../../constants";

const deleteLineSchemes = async (schemeId) => {
    try {
        const url = `${GET_LINE_SCHEME_API_URL}${schemeId}`;
        const result = await axios.delete(url);
        if (result?.data?.success) {
            toast.success("Схема удалена");
        }
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
    } catch (err) {
        toast.error(ERROR.UNKNOWN, { autoClose: 4000 });
        throw Error(err);
    }
};

export default deleteLineSchemes;
