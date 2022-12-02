import React, { memo, Fragment } from "react";
import { AppSidebarHeader, AppSidebarNav } from "@coreui/react";
import { useRouteMatch } from "react-router-dom";

const promoTitles = {
    promo: "Промо",
    stream: "Стримы",
};

const Promo = () => {
    const { params: { promoType } } = useRouteMatch(["/admin/companies/:companyId/:promoType"]);

    return (
        <AppSidebarHeader>{promoTitles[promoType]}</AppSidebarHeader>
    );
};

Promo.propTypes = {};

export default memo(Promo);
