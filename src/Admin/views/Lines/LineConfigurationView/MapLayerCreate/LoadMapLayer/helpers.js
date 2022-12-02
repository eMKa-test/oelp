import memoize from "lodash/memoize";

export const checkNumType = (array) => {
    return array.every((item) => typeof item === "number" && !isNaN(item));
};

export const nameFields = [
    "neLat", "neLong", "swLat", "swLong",
];

const uploadTypes = {
    scheme: "mapScheme",
    photo: "uploadMapLayer",
};

export const uploadType = memoize((type) => {
    return uploadTypes[type];
});

export default null;
