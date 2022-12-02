import React, { useCallback, memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import {
    Nav, NavItem, NavLink, TabContent, TabPane, Spinner,
} from "reactstrap";
import { bindActionCreators } from "redux";
import { ADMIN_LINES_TABS } from "../../../constant";
import TabsHeader from "./TabsHeader";
import TabDropdown from "./TabDropdown";
import { changeContentType } from "../../../store/actionCreators/contentActions";

const ContentTabs = ({
    contentType,
    load,
    switchContentType,
}) => {
    const toggle = useCallback((tab) => () => {
        switchContentType(tab);
    }, []);

    return (
        <div className="mb-3 content-tab-container">
            <Nav tabs>
                {
                    ADMIN_LINES_TABS.map((tab) => {
                        const active = contentType === tab.to;
                        return (
                            <NavItem key={tab.to}>
                                <TabDropdown active={active}>
                                    <NavLink
                                        className={classNames("content-tab__link", {
                                            active,
                                        })}
                                        onClick={toggle(tab.to)}>
                                        {tab.name}
                                    </NavLink>
                                </TabDropdown>
                            </NavItem>
                        );
                    })
                }
                <TabsHeader />
            </Nav>
            <TabContent activeTab={contentType}>
                {ADMIN_LINES_TABS.map((tab) => (
                    <TabPane
                        key={tab.name}
                        tabId={tab.to}>
                        {contentType === tab.to && (
                            <tab.component>
                                <div
                                    className={`content-tab-loader ${load ? "tab-loader_show" : "tab-loader_hide"}`}>
                                    <Spinner color="primary" />
                                </div>
                            </tab.component>
                        )}
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
};

ContentTabs.propTypes = {
    contentType: PropTypes.string.isRequired,
    load: PropTypes.bool.isRequired,
    switchContentType: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
    load: store.content.load,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    switchContentType: changeContentType,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ContentTabs));
