export const STATUSES = [
    {
        id: "UPLOADING",
        name: "Загружается",
    },
    {
        id: "UPLOADED",
        name: "Загружен",
    },
    {
        id: "CONVERTING",
        name: "Конвертируется",
    },
    {
        id: "DONE",
        name: "Сделано",
    },
    {
        id: "PUBLISHED",
        name: "Опубликован",
    },
    {
        id: "FAILED",
        name: "Провалено",
    },
];

export const statusTypes = {
    ALL: "Все",
    UPLOADING: "Загружается",
    UPLOADED: "Загружен",
    CONVERTING: "Конвертируется",
    DONE: "Сделано",
    PUBLISHED: "Опубликован",
    FAILED: "Провалено",
};

export const fileStatusTypes = {
    ALL: "ВСЕ",
    UPLOADING: "Загружается",
    UPLOADED: "Загружен",
    CONVERTING: "Конвертируется",
    CONVERTED: "Сконвертировано",
    DONE: "Сделано",
    FAILED: "Провалено",
};

export const FILTER_STATUSES = [
    {
        title: statusTypes.ALL,
        value: "ALL",
    },
    {
        title: statusTypes.UPLOADING,
        value: "UPLOADING",
    },
    {
        title: statusTypes.UPLOADED,
        value: "UPLOADED",
    },
    {
        title: statusTypes.CONVERTING,
        value: "CONVERTING",
    },
    {
        title: statusTypes.DONE,
        value: "DONE",
    },
    {
        title: statusTypes.PUBLISHED,
        value: "PUBLISHED",
    },
    {
        title: statusTypes.FAILED,
        value: "FAILED",
    },
];

export const contentTypes = {
    ALL: "Все",
    IMAGE: "Фото",
    VIDEO: "Видео",
    PANORAMA: "Панорамы",
    AEROPANORAMA: "Аэропанорамы",
    AERIAL: "Аэросъёмка",
};

export const FILTER_CONTENT_TYPES = [
    {
        title: contentTypes.ALL,
        value: "ALL",
    },
    {
        title: contentTypes.IMAGE,
        value: "IMAGE",
    },
    {
        title: contentTypes.VIDEO,
        value: "VIDEO",
    },
    {
        title: contentTypes.PANORAMA,
        value: "PANORAMA",
    },
    {
        title: contentTypes.AEROPANORAMA,
        value: "AEROPANORAMA",
    },
    {
        title: contentTypes.AERIAL,
        value: "AERIAL",
    },
];

export const CONTENT_TYPES = [
    {
        id: "IMAGE",
        name: contentTypes.IMAGE,
    },
    {
        id: "VIDEO",
        name: contentTypes.VIDEO,
    },
    {
        id: "PANORAMA",
        name: contentTypes.PANORAMA,
    },
    {
        id: "AEROPANORAMA",
        name: contentTypes.AEROPANORAMA,
    },
    {
        id: "AERIAL",
        name: contentTypes.AERIAL,
    },
];

export const contentSetHeader = [
    {
        title: "Дата",
        class: "c-table__col sm",
    },
    {
        title: "Статус",
        class: "c-table__col sm",
    },
    {
        title: "Тип",
        class: "c-table__col sm",
    },
    {
        title: "Пользователь",
        class: "c-table__col sm",
    },
    {
        title: "Объект",
        class: "c-table__col lg",
    },
    {
        title: "Отрезок",
        class: "c-table__col lg",
    },
    {
        title: "Файлов",
        class: "c-table__col sm",
    },
];

export const getUrlParams = (filterValues) => {
    const urlParams = {};
    for (const [key, val] of Object.entries(filterValues)) {
        urlParams[key] = val === "ALL" ? "" : val;
    }
    return urlParams;
};

export default null;
