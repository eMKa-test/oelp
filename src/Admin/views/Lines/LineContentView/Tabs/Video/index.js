import React, { Fragment, memo } from "react";
import * as PropTypes from "prop-types";
import GPSCorrect from "../../../../../components/Map/ReactLeaflet";
import VideoTab from "./VideoTab";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const Video = ({ children }) => (
    <Fragment>
        <ErrorBoundary>
            <GPSCorrect />
        </ErrorBoundary>
        <VideoTab>
            {children}
        </VideoTab>
    </Fragment>
);

Video.propTypes = {
    children: PropTypes.node,
};

export default memo(Video);
