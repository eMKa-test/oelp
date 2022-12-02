import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";

const DateToFilter = (props) => {
    const {
        onFilterHandler,
        date,
        minDate,
    } = props;

    const onChange = useCallback((ev) => {
        onFilterHandler({
            type: "dateTo",
            value: ev.target.value,
        });
    }, [onFilterHandler]);

    return (
        <div className="filter-wrapper">
            <span className="filter-title">
                по
            </span>
            <input
                value={date}
                type="date"
                min={moment(minDate)
                    .format("YYYY-MM-DD")}
                onChange={onChange}
                max={moment()
                    .format("YYYY-MM-DD")} />
        </div>
    );
};

DateToFilter.propTypes = {
    minDate: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onFilterHandler: PropTypes.func.isRequired,
};

export default memo(DateToFilter);
