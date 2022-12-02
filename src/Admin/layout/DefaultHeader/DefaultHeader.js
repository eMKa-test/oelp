import React, { memo, Fragment } from "react";
import { Nav, NavItem } from "reactstrap";
import * as PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import { AppSidebarToggler } from "@coreui/react";
import logo from "../../assets/icons/logo_2.0.svg";
import PersonPanel from "../../components/PersonPanel";
import { headerRoutes } from "../../routes";

const DefaultHeader = ({ operator }) => (
    <Fragment>
        <AppSidebarToggler
            className="d-lg-none"
            display="md"
            mobile />
        <Link
            className="AppSidebarToggler"
            to="/admin">
            <img
                src={logo}
                alt="" />
        </Link>
        <Nav
            className="d-md-down-none mr-auto"
            navbar>
            {headerRoutes.map((route) => route.name && (
                <NavItem
                    className="px-3"
                    key={route.name}>
                    <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={route.to}>
                        {route.name}
                    </NavLink>
                </NavItem>
            ))}
        </Nav>
        <div className="mr-2">
            <PersonPanel operator={operator} />
        </div>
    </Fragment>
);

DefaultHeader.propTypes = {
    operator: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default memo(DefaultHeader);
