import React, { memo, Fragment } from "react";
import { useSelector } from "react-redux";
import { AppSidebarHeader, AppSidebarNav } from "@coreui/react";
import { useParams } from "react-router-dom";

const ObjectsContent = () => {
    const params = useParams();
    const object = useSelector((store) => store.currentObject);
    const url = params.companyId ? `/admin/companies/${params.companyId}/${object.id}` : `/admin/objects/${object.id}/`;

    const items = object.lines.map((line) => ({
        name: line.name,
        url: `${url}/${line.id}`,
        icon: "icon-arrow-right",
    }));

    if (!object.name) {
        return null;
    }

    return (
        <Fragment>
            <AppSidebarHeader>
                Объект
                {" "}
                &#171;
                {object.name}
                &#187;
            </AppSidebarHeader>
            {items.length === 0 ? (
                <span>Отрезков нет</span>
            ) : (
                <AppSidebarNav
                    navConfig={{
                        items,
                    }} />
            )}
        </Fragment>
    );
};

ObjectsContent.propTypes = {};

export default memo(ObjectsContent);
