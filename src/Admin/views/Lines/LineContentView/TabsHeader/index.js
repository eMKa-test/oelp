import React, { memo } from "react";
import ChangeDate from "./ChangeDate";
import ChangeGpsTmp from "./ChangeGpsTmp";
import "./style.css";

const TabsHeader = () => {
    return (
        <div className="tab-aside-panel__wrapper">
            <ChangeDate />
            <ChangeGpsTmp />
        </div>
    );
};

export default memo(TabsHeader);
