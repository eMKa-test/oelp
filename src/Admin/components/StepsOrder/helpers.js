import L from "leaflet";
import markerIcon from "./assets/arrowMarker.svg";
import markerActiveIcon from "./assets/activeArrowMarker.svg";
import markerEndIcon from "./assets/markerEnd.svg";

export const customIcon = (index, isActive, isDeadEnd) => {
    const activeClass = isActive ? "marker-arrow-index-description__active" : "marker-arrow-index-description";
    return L.divIcon({
        html: `
        <img
            style="width: 100%"
            src="${isDeadEnd ? markerEndIcon : isActive ? markerActiveIcon : markerIcon}"
            alt="markerIcon" />
        <p class="${activeClass}">
            ${index}
        </p>
    `,
        className: "marker-arrow-custom",
        iconSize: L.point(20, 50, true),
        iconAnchor: [10, 50],
        popupAnchor: [0, -50],
    });
};

export default null;
