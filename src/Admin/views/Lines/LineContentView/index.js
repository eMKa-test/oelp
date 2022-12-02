import React, { memo } from "react";
import * as PropTypes from "prop-types";
import ContentTabs from "./ContentTabs";
import ErrorBoundary from "../../../common/ErrorBoundary";

const MainView = (props) => {
    if (props.currentLine.id > -1) {
        return (
            <ErrorBoundary>
                <ContentTabs {...props} />
            </ErrorBoundary>
        );
    }
};

MainView.propTypes = {
    currentLine: PropTypes.shape({
        id: PropTypes.number,
    }),
    uploadUrl: PropTypes.string,
};

export default memo(MainView);
