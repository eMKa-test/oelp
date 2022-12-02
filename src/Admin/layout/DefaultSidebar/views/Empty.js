import React, { Fragment, memo } from "react";
import { AppSidebarHeader } from "@coreui/react";
import { useRouteMatch } from "react-router-dom";

const types = {
    users: "Пользователи",
    stats: "Статистика",
    activity: "Активность",
};

const Empty = () => {
    const { params } = useRouteMatch("/admin/:dashType");

    return (
        <Fragment>
            <AppSidebarHeader>
                {types[params.dashType]}
            </AppSidebarHeader>
            <div className="aside-wrapper empty">
                Доп информация
            </div>
        </Fragment>
    );
};

export default memo(Empty);
