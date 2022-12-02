import { postData } from "./postData";
import { CONTENT_SETS_API } from "../contstants";

// Получение списка не загруженных до конца сетов
export const registerUploadContent = async (body) => {
    const res = await postData({
        url: `${CONTENT_SETS_API}`,
        body,
    });
    if (res.data.success) {
        return res.data.payload;
    }
    throw Error("No from register data");
};
