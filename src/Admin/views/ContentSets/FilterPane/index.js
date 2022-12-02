import React, { memo } from "react";
import * as PropTypes from "prop-types";
import StatusFilter from "./StatusFilter";
import ContentTypeFilter from "./ContentTypeFilter";
import LineFilter from "./LineFilter";
import UserFilter from "./UserFilter";
import DateToFilter from "./DateToFilter";
import DateFromFilter from "./DateFromFilter";
import "./style.css";

const FilterPane = (props) => {
    const {
        users,
        lines,
        filter,
        onFilterHandler,
    } = props;

    return (
        <div className="filter-pane">
            <div className="filter-pane__item">
                <StatusFilter
                    filter={filter.status}
                    onFilterHandler={onFilterHandler} />
                <ContentTypeFilter
                    filter={filter.contentType}
                    onFilterHandler={onFilterHandler} />
                <LineFilter
                    lines={lines}
                    filter={filter.lineId}
                    onFilterHandler={onFilterHandler} />
                <UserFilter
                    users={users}
                    filter={filter.userId}
                    onFilterHandler={onFilterHandler} />
                <DateFromFilter
                    maxDate={filter.dateTo}
                    date={filter.dateFrom}
                    onFilterHandler={onFilterHandler} />
                <DateToFilter
                    minDate={filter.dateFrom}
                    date={filter.dateTo}
                    onFilterHandler={onFilterHandler} />
            </div>
        </div>
    );
};

FilterPane.propTypes = {
    filter: PropTypes.shape({
        status: PropTypes.string.isRequired,
        contentType: PropTypes.string.isRequired,
        lineId: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        dateFrom: PropTypes.string.isRequired,
        dateTo: PropTypes.string.isRequired,
    }),
    onFilterHandler: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({})),
    lines: PropTypes.arrayOf(PropTypes.shape({})),
};

export default memo(FilterPane);
