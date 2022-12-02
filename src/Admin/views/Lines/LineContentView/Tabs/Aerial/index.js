import React, { Fragment } from "react";
import * as PropTypes from "prop-types";
import AerialTab from "./AerialTab";
import GPSCorrect from "../../../../../components/Map/ReactLeaflet";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const Aerial = ({ children }) => (
    <Fragment>
        <ErrorBoundary>
            <GPSCorrect />
        </ErrorBoundary>
        <AerialTab>
            {children}
        </AerialTab>
    </Fragment>
);

Aerial.propTypes = {
    children: PropTypes.node,
};

export default Aerial;
