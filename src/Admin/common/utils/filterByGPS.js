export default (array) => {
    if (!Array.isArray(array)) {
        throw Error("Wrong type argument");
    }
    return array.filter((item) => item.gps && typeof item.gps.lat === "number" && typeof item.gps.long === "number");
};
