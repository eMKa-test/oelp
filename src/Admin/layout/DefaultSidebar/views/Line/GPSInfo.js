import React, { memo } from "react";

const GPSInfo = () => (
    <div className="gps-info__wrapper">
        <div className="title">
            Коррекция GPS
        </div>
        <div className="body">
            <ul className="info-list">
                <li className="text-warning">
                    Правый клик мыши на карте - показать координаты
                </li>
            </ul>
        </div>
    </div>
);

export default memo(GPSInfo);
