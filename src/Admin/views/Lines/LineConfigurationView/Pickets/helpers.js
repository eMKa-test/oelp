import L from "leaflet";
import picketIcon from "../../../../assets/mapIcon/picketIcon.svg";
import picketIconNew from "../../../../assets/mapIcon/picketIconNew.svg";
import picketIconEdit from "../../../../assets/mapIcon/picketIconEdit.svg";

const defaultCenter = [59, 28];

export const icon = L.icon({
    iconUrl: picketIcon,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [0, -23],
    popupAnchor: [0, -60],
});

export const iconNew = L.icon({
    iconUrl: picketIconNew,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [0, -23],
    popupAnchor: [0, -60],
});

export const iconEdit = L.icon({
    iconUrl: picketIconEdit,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [0, -23],
    popupAnchor: [0, -60],
});

export const getInitialView = (pickets, lineGps) => {
    const view = { zoom: 12, center: lineGps ? Object.values(lineGps) : defaultCenter };
    if (pickets?.length > 1) {
        const bounds = [];
        pickets.forEach((pick) => {
            if (pick.gps) {
                bounds.push(Object.values(pick.gps));
            }
        });
        Object.assign(view, { bounds });
    }
    return view;
};

export default null;
