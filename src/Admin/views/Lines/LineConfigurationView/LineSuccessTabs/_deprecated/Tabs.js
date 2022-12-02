import React from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "reactstrap";

const availableTabs = {
    AERIAL: "Аэросьемка",
    TIMELAPSE: "Таймлапс",
    PANORAMA: "Просмотр",
    IMAGE: "Фото",
    VIDEO: "Видео",
    AEROPANORAMA: "Аэро",
};

const classes = [
    "rounded-0",
    "border-white",
];

const style = {
    flex: 1,
};

function TabsConfig({
    onClick,
    tabs,
}) {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-stretch">
            {Object.entries(availableTabs)
                .map(([key, val]) => {
                    const active = tabs.includes(key);
                    return (
                        <Button
                            key={String(key)}
                            className={classnames(classes)}
                            color={`${active ? "primary" : "light"}`}
                            style={style}
                            onClick={onClick(key, tabs)}>
                            {val}
                        </Button>
                    );
                })}
        </div>
    );
}

TabsConfig.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClick: PropTypes.func.isRequired,
    lineID: PropTypes.number.isRequired,
};

export default React.memo(TabsConfig);
