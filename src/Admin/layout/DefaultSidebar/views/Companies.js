import React, { memo, Fragment } from "react";
import * as PropTypes from "prop-types";
import { AppSidebarHeader, AppSidebarNav } from "@coreui/react";
import { useSelector } from "react-redux";

const Companies = () => {
    const { companies } = useSelector((store) => store.companies);

    const items = companies.map((comp) => ({
        name: comp.name,
        url: `/admin/companies/${comp.id}`,
        icon: "icon-grid",
    }));

    return (
        <Fragment>
            <AppSidebarHeader>Компании</AppSidebarHeader>
            <AppSidebarNav
                navConfig={{
                    items,
                }} />
        </Fragment>
    );
};

Companies.propTypes = {};

export default memo(Companies);
