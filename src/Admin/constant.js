import PhotoTab from "./views/Lines/LineContentView/Tabs/Photo";
import VideoTab from "./views/Lines/LineContentView/Tabs/Video";
import PanoramaTab from "./views/Lines/LineContentView/Tabs/Panorama";
import AerialTab from "./views/Lines/LineContentView/Tabs/Aerial";
import TimelapseTab from "./views/Lines/LineContentView/Tabs/Timelapse";
import AeroPanoramaTab from "./views/Lines/LineContentView/Tabs/AeroPanorama";

export const ADMIN_LINES_TABS = [
    {
        name: "Фото",
        to: "image",
        component: PhotoTab,
    },
    {
        name: "Видео",
        to: "video",
        component: VideoTab,
    },
    {
        name: "Панорамы",
        to: "panorama",
        component: PanoramaTab,
    },
    {
        name: "Аэропанорамы",
        to: "aeropanorama",
        component: AeroPanoramaTab,
    },
    {
        name: "Аэросъемка",
        to: "aerial",
        component: AerialTab,
    },
    {
        name: "Таймлапс",
        to: "timelapse",
        component: TimelapseTab,
    },
];

export const CLIENT_TABS = [
    {
        id: 1,
        uuid: "1_aerial",
        value: "aerial",
        name: "Аэро",
    },
    {
        id: 2,
        uuid: "2_timelapse",
        value: "timelapse",
        name: "Таймлапс",
    },
    {
        id: 3,
        uuid: "3_panorama",
        value: "panorama",
        name: "Просмотр",
    },
    {
        id: 4,
        uuid: "4_image",
        value: "image",
        name: "Фото",
    },
    {
        id: 5,
        uuid: "5_video",
        value: "video",
        name: "Видео",
    },
];

export const PROJECTS_WITH_TIMELAPSE = [
    {
        projectId: 1,
        lines: ["1"],
    },
    {
        projectId: 6,
        lines: ["25", "26"],
    },
];

export default {
    CLIENT_TABS,
    PROJECTS_WITH_TIMELAPSE,
};
