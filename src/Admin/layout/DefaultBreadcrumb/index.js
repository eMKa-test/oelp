import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { AppAsideToggler } from "@coreui/react";
import { routeConfig } from "./helpers";

const DefaultBreadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routeConfig);

    return (
        <div className="breadcrumb-wrapper">
            <div className="breadcrumb__container">
                {breadcrumbs.map(({ breadcrumb, match }) => {
                    return (
                        <span
                            className="breadcrumb-item"
                            key={match.url}>
                            <NavLink to={match.url}>{breadcrumb}</NavLink>
                        </span>
                    );
                })}
            </div>
            {/* <AppAsideToggler */}
            {/*    mobile */}
            {/*    title="Открыть правую панель"> */}
            {/*    <i className="fa fa-bars" /> */}
            {/* </AppAsideToggler> */}
        </div>
    );
};

export default memo(DefaultBreadcrumbs);
