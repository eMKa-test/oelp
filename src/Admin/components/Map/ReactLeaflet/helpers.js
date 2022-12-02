import L from "leaflet";

export const customIcon = (index, icon) => {
    const classname = typeof index === "number" ? "marker-index-show" : "marker-index-hide";
    return L.divIcon({
        html: `
        <img
            style="width: 100%"
            src="${icon}"
            alt="markerIcon" />
        <p class="admin-marker-index-description ${classname}">
            ${index}
        </p>
    `,
        className: "marker-custom",
        iconSize: L.point(50, 50, true),
        iconAnchor: [25, 49],
    });
};

export default null;
