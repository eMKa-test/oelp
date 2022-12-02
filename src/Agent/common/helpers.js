import memoize from "lodash/memoize";
import imgIcon from "../assets/imgIcon.svg";
import videoIcon from "../assets/videoIcon.svg";
import srtIcon from "../assets/srtIcon.svg";

export const promoTypes = [
    {
        name: "Промо",
        type: "PROMO",
        accept: "video/*",
    },
    {
        name: "Стримы",
        type: "STREAM",
        accept: "video/*",
    },
];

export const contentTypes = [
    {
        name: "Аэросъёмка",
        type: "AERIAL",
    },
    {
        type: "AEROPANORAMA",
        name: "Аэропанорамы",
        accept: "image/jpeg",
    },
    {
        type: "IMAGE",
        name: "Фото",
        accept: "image/jpeg",
    },
    {
        type: "VIDEO",
        name: "Видео",
        accept: "video/*",
    },
    {
        type: "PANORAMA",
        name: "Панорамы",
        accept: "image/jpeg",
    },
];

const accepts = {
    IMAGE: "image/jpeg",
    VIDEO: "video/*",
    PANORAMA: "image/jpeg",
    AEROPANORAMA: "image/jpeg",
};

export const contentTypesTranslate = {
    IMAGE: "Фото",
    VIDEO: "Видео",
    PANORAMA: "Панорама",
    AEROPANORAMA: "Аэропанорама",
    AERIAL: "Аэросъемка",
};

export const CHUNK_SIZE = 1000000; // 1Mb

const iconTypes = {
    image: imgIcon,
    video: videoIcon,
    srt: srtIcon,
};

export const getIcon = memoize((type) => {
    const result = type.split("/")[0];
    if (!result) {
        return iconTypes.srt;
    }
    return iconTypes[result];
});

export const getArrayFromObject = (object) => {
    const result = [];
    for (const [key, body] of Object.entries(object)) {
        for (const [k, v] of Object.entries(body)) {
            result.push(v);
        }
    }
    return result;
};

export const getContentAccept = memoize((type) => accepts[type]);

export const formatBytes = (bytes, dm = 2) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const k = 1024,
        sizes = ["Бит", "КБ", "МБ", "ГБ", "ТБ", "ПБ"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
};

const TEXT_LIMIT = 60;

export const formatTitle = (text, TEXT_LENGTH_LIMIT = TEXT_LIMIT) => {
    if (text.length < 60) {
        return text;
    }
    const splited = text.split(".");
    return `${splited[0].slice(0, TEXT_LENGTH_LIMIT / 4)}....${text.slice(-15)}`;
};

export function declinationWord(number, titles = ["штука", "штуки", "штук"]) {
    const cases = [2, 0, 1, 1, 1, 2];
    const result = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    return `${number} ${result}`;
}

export const uuidGenerator = () => (
    [1e7] + -1e3 + -4e3 + -8e3 + -1e11)
    .replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

export const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
};

export default null;
