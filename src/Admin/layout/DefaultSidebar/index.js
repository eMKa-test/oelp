import React from "react";
import { Route, Switch } from "react-router-dom";
import {
    AppSidebar, AppSidebarHeader, AppSidebarNav, AppAsideToggler, AppSidebarMinimizer,
} from "@coreui/react";
import ErrorBoundary from "../../common/ErrorBoundary";
import { mainItems } from "./helpers";
import Companies from "./views/Companies";
import Objects from "./views/Objects";
import CompaniesContent from "./views/CompaniesContent";
import ObjectsContent from "./views/ObjectsContent";
import Line from "./views/Line";
import Promo from "./views/Promo";
import Empty from "./views/Empty";
import "./style.css";

const DefaultSidebar = () => {
    return (
        <AppSidebar
            fixed
            display="lg">
            <ErrorBoundary>
                <Switch>
                    <Route path={["/admin/companies/:companyId/:objectId/:lineId", "/admin/objects/:objectId/:lineId"]}>
                        <Line />
                    </Route>
                    <Route path={["/admin/companies/:companyId/stream", "/admin/companies/:companyId/promo"]}>
                        <Promo />
                    </Route>
                    <Route path={["/admin/companies/:companyId/:objectId", "/admin/objects/:objectId"]}>
                        <ObjectsContent />
                    </Route>
                    <Route path="/admin/companies/:companyId">
                        <CompaniesContent />
                    </Route>
                    <Route path="/admin/companies">
                        <Companies />
                    </Route>
                    <Route path="/admin/objects">
                        <Objects />
                    </Route>
                    <Route
                        path="/admin"
                        exact>
                        <AppSidebarHeader>Главная</AppSidebarHeader>
                        <AppSidebarNav navConfig={{ items: mainItems }} />
                    </Route>
                    <Route path="/admin/*">
                        <Empty />
                    </Route>
                </Switch>
            </ErrorBoundary>
            <AppSidebarMinimizer />
        </AppSidebar>
    );
};

export default DefaultSidebar;
