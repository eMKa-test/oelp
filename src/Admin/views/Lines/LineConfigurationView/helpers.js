import LineSuccessTabs from "./LineSuccessTabs";
import AgentLineScheme from "./AgentLineScheme";
import RoomScheme from "./RoomScheme";
import MapLayerCreate from "./MapLayerCreate";
import Pickets from "./Pickets";

const contentTypes = [
    "image",
    "video",
    "panorama",
    "aeropanorama",
    "aerial",
    "timelapse",
];

export const configurationViewTabs = [
    {
        title: "Настройка вкладок",
        to: "lineSuccessTabs",
        contentTypes,
        Component: LineSuccessTabs,
    },
    {
        title: "Схема для оператора",
        to: "agentLineScheme",
        contentTypes,
        Component: AgentLineScheme,
    },
    {
        title: "Схема помещения",
        to: "room",
        contentTypes: ["panorama"],
        Component: RoomScheme,
    },
    {
        title: "Слои для карты",
        to: "mapLayerCreate",
        contentTypes,
        Component: MapLayerCreate,
    },
    {
        title: "Пикеты",
        to: "pickets",
        contentTypes,
        Component: Pickets,
    },
];

export default null;
