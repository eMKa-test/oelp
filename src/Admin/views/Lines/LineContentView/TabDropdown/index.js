import React, { memo, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import memoize from "lodash/memoize";
import {
    ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu,
} from "reactstrap";
import UpdateSet from "./UpdateSet";
import ContentLoop from "./ContentLoop";
import UpdatePointsSet from "./UpdatePointsSet";
import "./style.css";

const rulesDropdownFields = memoize((type) => {
    const dropDowns = [UpdatePointsSet];
    if (["panorama", "aeropanorama"].includes(type)) {
        dropDowns.push(UpdateSet, ContentLoop);
    }
    return dropDowns;
});

const TabsDropdown = ({
    children,
    active,
    contentType,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <ButtonGroup>
            {children}
            {active && (
                <ButtonDropdown
                    className="content-tab__dropdown-button"
                    isOpen={open}
                    toggle={() => setOpen(!open)}>
                    <DropdownToggle
                        color="light"
                        caret />
                    <DropdownMenu>
                        {rulesDropdownFields(contentType)
                            .map((Component, i) => (
                                <Component key={String(i)} />
                            ))}
                    </DropdownMenu>
                </ButtonDropdown>
            )}
        </ButtonGroup>
    );
};

TabsDropdown.propTypes = {
    children: PropTypes.element.isRequired,
    active: PropTypes.bool.isRequired,
    contentType: PropTypes.string.isRequired,
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
});

export default connect(mapStateToProps)(memo(TabsDropdown));
