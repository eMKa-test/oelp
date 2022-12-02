import React, { memo, Fragment } from "react";
import { AppSidebarHeader, AppSidebarNav } from "@coreui/react";
import { useSelector } from "react-redux";

const CompaniesContent = () => {
    const company = useSelector((store) => store.currentCompany);
    const { objects } = useSelector((store) => store.objects);

    const items = objects.map((obj) => ({
        name: obj.name,
        url: `/admin/companies/${company.id}/${obj.id}`,
        icon: "icon-grid",
    }));

    if (!company.name) {
        return null;
    }

    return (
        <Fragment>
            <AppSidebarHeader>
                Компания
                {" "}
                &#171;
                {company.name}
                &#187;
            </AppSidebarHeader>
            {items.length === 0 ? (
                <span>Объектов не создано</span>
            ) : (
                <AppSidebarNav
                    navConfig={{
                        items,
                    }} />
            )}
        </Fragment>
    );
};

CompaniesContent.propTypes = {};

export default memo(CompaniesContent);
