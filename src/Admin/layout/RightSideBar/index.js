import React, { memo, useCallback } from "react";
import { Switch, Route } from "react-router-dom";
import { AppAside, AppAsideToggler } from "@coreui/react";
import TransferLines from "./views/TransferLines";
import Empty from "../DefaultSidebar/views/Empty";

const RightSideBar = () => {
    return (
        <AppAside
            fixed>
            <div className="aside-wrapper aside__right">
                <div className="mobile-toggle">
                    <AppAsideToggler
                        mobile
                        title="Открыть правую панель">
                        <i className="fa fa-bars" />
                    </AppAsideToggler>
                </div>
                <Switch>
                    <Route
                        exact
                        path={["/admin/companies/:companyId/:objectId", "/admin/objects/:objectId"]}>
                        <TransferLines />
                    </Route>
                    <Route path="/admin/*">
                        <Empty />
                    </Route>
                </Switch>
            </div>
        </AppAside>
    );
};

RightSideBar.propTypes = {};

export default memo(RightSideBar);
