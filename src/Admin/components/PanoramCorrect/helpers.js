import M from "marzipano";

export const velocityAxisX = 0.7;
export const velocityAxisY = 0.5;
export const velocityZoom = 0.8;
export const frictionAxis = 2.5;
export const frictionZoom = 3;

export const controlConfig = [
    {
        id: "xMoveLeft",
        options: [65, "x", -velocityAxisX, frictionAxis],
    },
    {
        id: "xMoveRight",
        options: [68, "x", velocityAxisX, frictionAxis],
    },
    {
        id: "yMoveUp",
        options: [83, "y", velocityAxisY, frictionAxis],
    },
    {
        id: "yMoveDown",
        options: [87, "y", -velocityAxisY, frictionAxis],
    },
    {
        id: "zoomPlus",
        options: [69, "zoom", -velocityZoom, frictionZoom],
    },
    {
        id: "zoomMinus",
        options: [81, "zoom", velocityZoom, frictionZoom],
    },
];

export const mouseControlsIds = ["scrollZoom", "mouseViewDrag"];

export const CUBE_GEOMETRY_LEVELS = [
    { tileSize: 256, size: 256, fallbackOnly: true },
    { tileSize: 512, size: 512 },
    { tileSize: 512, size: 1024 },
    { tileSize: 512, size: 2048 },
    { tileSize: 512, size: 4096 },
    { tileSize: 512, size: 8192 },
];

export const getSourceAndGeometry = (pan) => {
    const tilesUrl = pan.src && pan.src.tiles ? pan.src.tiles : false;
    const baseDir = tilesUrl && tilesUrl.baseDir ? tilesUrl.baseDir : false;
    const tileUrl = (f, z, x, y) => {
        return `${baseDir}/f${f}_z${z}_x${y}_y${x}.jpg`;
    };

    let source, geometry, pinFirstLevel;
    if (tilesUrl && baseDir) {
        source = new M.ImageUrlSource(((tile) => {
            if (tile.z === 0) {
                const mapY = "lfrbud".indexOf(tile.face) / 6;
                return {
                    url: `${baseDir}/preview.jpg`,
                    rect: {
                        x: 0, y: mapY, width: 1, height: 1 / 6,
                    },
                };
            }
            return { url: tileUrl(tile.face, tile.z, tile.x, tile.y) };
        }));
        geometry = new M.CubeGeometry(CUBE_GEOMETRY_LEVELS);
        pinFirstLevel = true;
    } else {
        source = M.ImageUrlSource.fromString(pan.src.src);
        geometry = new M.EquirectGeometry([{ width: "512px" }]);
        pinFirstLevel = false;
    }
    return { geometry, source, pinFirstLevel };
};

export const arrayOrState = (payload, state = []) => {
    if (!(payload instanceof Array)) {
        return state;
    }
    return [...payload];
};

export const objectOrState = (payload, state = {}) => {
    if (typeof payload !== "object" || Object.is(payload, null) || payload instanceof Array) {
        return state;
    }
    return { ...payload };
};

export const substr = (text = "", lim = 200) => {
    if (text.length > lim) {
        return `${text.substr(0, lim)}...`;
    }
    return text;
};

export const substrClever = (text = "") => {
    const limit = Math.round(text.length * 0.2);
    const pass = Math.round(text.length * 0.4);
    const leftPart = text.substr(0, limit);
    const rightPart = text.substr(limit + pass, text.length);
    return `${leftPart}...${rightPart}`;
};

export function convertDetails(contentName) {
    switch (contentName) {
        case "IMAGE":
            return "Фото";
        case "PANORAMA":
            return "Панорам";
        case "VIDEO":
            return "Видео";
        case "AERIAL":
            return "Аэро";
        default:
            return "undefined";
    }
}

export function convertDate(date, type = "") {
    if (date !== undefined) {
        const months = [
            "Января", "Февраля", "Марта",
            "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября",
            "Октября", "Ноября", "Декабря",
        ];
        const x = date.split("-").reverse();
        if (type === "admin") {
            return x.join("/");
        }
        const currentMonth = months[Number(x[1] - 1)];
        x.splice(1, 1, currentMonth);
        return x.join(" ");
    }
    return null;
}

export function sortPans(valA, valB) {
    if (valA.pointId && valB.pointId) {
        return valA.pointId - valB.pointId;
    }
    return valA.id - valB.id;
}

// Панорамы
export function toRad(deg) {
    return deg * Math.PI / 180;
}

export function toDeg(rad) {
    return rad * 180 / Math.PI;
}

export function bearing({ gps: { long: lng1, lat: lat1 } }, { gps: { long: lng2, lat: lat2 } }) {
    const testLong1 = lng1 > 90 ? lng1 - 90 : lng1;
    const testLong2 = lng2 > 90 ? lng2 - 90 : lng2;
    const dLon = (testLong1 - testLong2);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = toDeg(Math.atan2(y, x));
    // TODO: вот тут надо начальную поправку внести и будет хорошо считать
    return (360 - ((brng + 360) % 360));
}

export function bearingSerega([lng1, lat1], [lng2, lat2]) {
    const correctLng1 = lng1 * Math.cos(lat1);
    const correctLng2 = lng2 * Math.cos(lat1);
    const siblingPoint = Math.acos(Math.abs(lat2 - lat1) / Math.sqrt((lat2 - lat1) * (lat2 - lat1) + (correctLng2 - correctLng1) * (correctLng2 - correctLng1)));
    if (correctLng2 < correctLng1) {
        return toRad(180 - siblingPoint);
    }
    return siblingPoint;
}

export function setRadiusPan({ gps: { long: lng1, lat: lat1 } }, { gps: { long: lng2, lat: lat2 } }) {
    const delta = ((lat2 - lat1) ** 2) + ((lng2 - lng1) ** 2);
    return Math.sqrt(delta);
}

export function getDistanceMarker([lng1, lat1], [lng2, lat2]) {
    const EARTH = 40000000 / 360;
    const correct = EARTH * Math.cos(toRad(lng1));
    const result = Math.sqrt((((lng2 - lng1) * EARTH) ** 2) + (((lat2 - lat1) * correct) ** 2));
    return Math.round(result);
}

export function uniqContent(arr, compareName) {
    const result = arr.reduce((acc, cur) => {
        if (!acc.find((el) => el[compareName] === cur[compareName])) {
            acc.push(cur);
        }
        return acc;
    }, []);
    return result;
}

export function toRoundNum(num) {
    return Number(Math.round(num));
}

export function convertToSphereAngle(yaw) {
    return toDeg(yaw) < 0 && toDeg(yaw) >= -180
        ? toRoundNum(360 + toDeg(yaw))
        : toRoundNum(toDeg(yaw));
}

export function convertRotate(val) {
    return val >= 0 && val <= 180 ? val : 360 + val;
}

export default {
    arrayOrState,
    objectOrState,
    substr,
    uniqContent,
    convertDate,
    substrClever,
    sortPans,
    bearing,
    bearingSerega,
    toDeg,
    toRad,
    setRadiusPan,
    getDistanceMarker,
    toRoundNum,
    convertToSphereAngle,
    convertRotate,
};
