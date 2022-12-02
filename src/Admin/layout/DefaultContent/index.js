import React, { useCallback } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import DefaultBreadcrumbs from "../DefaultBreadcrumb";
import { routes } from "../../routes";

const DefaultContent = () => (
    <React.Fragment>
        <DefaultBreadcrumbs />
        <Container
            fluid
            className="pt-3 main-container">
            <React.Suspense fallback={<span />}>
                <Switch>
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}>
                            <route.component />
                        </Route>
                    ))}
                    <Redirect to="/admin" />
                </Switch>
            </React.Suspense>
        </Container>
    </React.Fragment>
);

export default DefaultContent;
