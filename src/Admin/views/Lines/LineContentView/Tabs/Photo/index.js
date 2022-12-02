import React, { memo } from "react";
import * as PropTypes from "prop-types";
import GPSCorrect from "../../../../../components/Map/ReactLeaflet";
import PhotoTab from "./PhotoTab";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const Photo = ({ children }) => (
    <React.Fragment>
        <ErrorBoundary>
            <GPSCorrect />
        </ErrorBoundary>
        <PhotoTab>
            {children}
        </PhotoTab>
    </React.Fragment>
);

Photo.propTypes = {
    children: PropTypes.node,
};

export default memo(Photo);
