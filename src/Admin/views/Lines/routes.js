import React, { memo } from "react";
import { Switch, Route } from "react-router-dom";
import ContentView from "./LineContentView";
import ConfigurationView from "./LineConfigurationView";

const paths = {
    mainView: [
        "/admin/companies/:companyID/:objectID/:lineID",
        "/admin/objects/:objectID/:lineID",
    ],
    configurationView: [
        "/admin/companies/:companyID/:objectID/:lineID/configuration",
        "/admin/objects/:objectID/:lineID/configuration",
    ],
};

const Routes = (props) => {
    if (props.currentLine.id === -1) {
        return null;
    }

    return (
        <Switch>
            <Route>
                <Route
                    exact
                    path={paths.configurationView}>
                    <ConfigurationView {...props} />
                </Route>
                <ContentView {...props} />
            </Route>
        </Switch>
    );
};

export default memo(Routes);
