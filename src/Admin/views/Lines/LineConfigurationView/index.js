import React, {
    memo, useCallback, useState, useEffect, useMemo,
} from "react";
import * as PropTypes from "prop-types";
import {
    Nav, TabContent, TabPane, NavItem, NavLink,
} from "reactstrap";
import { connect } from "react-redux";
import { configurationViewTabs } from "./helpers";
import ErrorBoundary from "../../../common/ErrorBoundary";
import "./style.css";

const ConfigurationView = ({ contentType }) => {
    const [activeTab, setActiveTab] = useState(configurationViewTabs[0].to);

    useEffect(() => {
        return () => setActiveTab(configurationViewTabs[0].to);
    }, []);

    useEffect(() => {
        if (contentType !== "panorama" && activeTab === "room") {
            setActiveTab(configurationViewTabs[0].to);
        }
    }, [contentType, activeTab]);

    const onTab = useCallback((tab) => () => {
        setActiveTab(tab);
    }, []);

    const renderTabs = useMemo(() => {
        return configurationViewTabs.map((pane, i) => {
            return (
                <TabPane
                    key={String(i)}
                    tabId={pane.to}>
                    {activeTab === pane.to ? (
                        <ErrorBoundary>
                            <pane.Component />
                        </ErrorBoundary>
                    ) : null}
                </TabPane>
            );
        });
    }, [activeTab]);

    return (
        <div className="configuration__wrapper mb-5">
            <Nav tabs>
                {configurationViewTabs.map((tab, i) => {
                    if (tab.contentTypes.includes(contentType)) {
                        return (
                            <NavItem key={String(i)}>
                                <NavLink
                                    className={`config-tab__link ${activeTab === tab.to ? "active" : ""}`}
                                    onClick={onTab(tab.to)}>
                                    {tab.title}
                                </NavLink>
                            </NavItem>
                        );
                    }
                })}
            </Nav>
            <TabContent activeTab={activeTab}>
                {renderTabs}
            </TabContent>
        </div>
    );
};

ConfigurationView.propTypes = {
    contentType: PropTypes.string.isRequired,
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
});

export default connect(mapStateToProps, null)(memo(ConfigurationView));
