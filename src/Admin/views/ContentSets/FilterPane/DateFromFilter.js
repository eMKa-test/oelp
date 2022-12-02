import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";

const DateFrom = (props) => {
    const {
        onFilterHandler,
        date,
        maxDate,
    } = props;

    const onChange = useCallback((ev) => {
        onFilterHandler({
            type: "dateFrom",
            value: ev.target.value,
        });
    }, [onFilterHandler]);

    return (
        <div className="filter-wrapper">
            <span className="filter-title">
                с
            </span>
            <input
                value={date}
                type="date"
                max={moment(maxDate)
                    .format("YYYY-MM-DD")}
                onChange={onChange} />
        </div>
    );
};

DateFrom.propTypes = {
    date: PropTypes.string.isRequired,
    maxDate: PropTypes.string.isRequired,
    onFilterHandler: PropTypes.func.isRequired,
};

export default memo(DateFrom);
