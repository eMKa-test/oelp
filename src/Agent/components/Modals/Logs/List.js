import React, { memo } from "react";
import * as PropTypes from "prop-types";
import LogItem from "./LogItem";
import ErrorBoundary from "../../../../Admin/common/ErrorBoundary";

const LogsList = (props) => {
    const { log } = props;

    if (!log) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div className="logs-list__wrapper">
                {log.map((item, i) => (
                    <LogItem
                        item={item}
                        key={String(i)} />
                ))}
            </div>
        </ErrorBoundary>
    );
};

LogsList.propTypes = {
    log: PropTypes.arrayOf(PropTypes.shape({})),
};

export default memo(LogsList);
