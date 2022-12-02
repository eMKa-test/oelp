import React, { memo, Fragment } from "react";
import { AppSidebarHeader, AppSidebarNav } from "@coreui/react";
import { useSelector } from "react-redux";

const Objects = () => {
    const { projects: objects } = useSelector((store) => store.companies);

    const items = objects.map((obj) => ({
        name: obj.name,
        url: `/admin/objects/${obj.id}`,
        icon: "icon-grid",
    }));

    return (
        <Fragment>
            <AppSidebarHeader>Объекты</AppSidebarHeader>
            <AppSidebarNav
                navConfig={{
                    items,
                }} />
        </Fragment>
    );
};

export default memo(Objects);
