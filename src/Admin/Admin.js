import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Modal from "react-modal";
import Layout from "./layout";
import { ROUTER_ROOT } from "./constants";
import useHistoryChanges from "./common/hooks/useHistoryChanges";

Modal.setAppElement("#root");

const Admin = () => {
    useHistoryChanges();

    return (
        <Switch>
            <Route
                path={ROUTER_ROOT}
                component={Layout} />
            <Redirect
                from="/"
                to="/admin" />
        </Switch>
    );
};

export default Admin;
