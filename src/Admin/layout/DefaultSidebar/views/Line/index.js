import React, { memo, useMemo, Fragment } from "react";
import { useSelector } from "react-redux";
import { AppSidebarHeader } from "@coreui/react";
import PanoramaCorrectInfo from "./PanoramaCorrectInfo";
import GPSInfo from "./GPSInfo";
import "./style.css";

const Line = () => {
    const line = useSelector((store) => store.currentLine);
    const panoramaTab = useSelector((store) => store.panorama.panoramaTab);

    const renderInfo = useMemo(() => {
        switch (panoramaTab) {
            case "map":
                return <GPSInfo />;
            case "panorama":
                return <PanoramaCorrectInfo />;
            default:
                return "пока пусто";
        }
    }, [panoramaTab]);

    if (!line.name) {
        return null;
    }

    return (
        <Fragment>
            <AppSidebarHeader>
                Отрезок
                &#171;
                {line.name}
                &#187;
            </AppSidebarHeader>
            <div className="aside-wrapper">
                {renderInfo}
            </div>
        </Fragment>
    );
};

export default memo(Line);
