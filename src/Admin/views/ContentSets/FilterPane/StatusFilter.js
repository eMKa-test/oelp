import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from "reactstrap";
import { FILTER_STATUSES, statusTypes } from "../helpers";

const StatusFilter = (props) => {
    const {
        onFilterHandler,
        filter,
    } = props;
    const [open, setOpen] = useState(false);

    const onFilter = useCallback((value) => () => {
        onFilterHandler({
            type: "status",
            value,
        });
    }, [onFilterHandler]);

    return (
        <div className="filter-wrapper">
            <span className="filter-title">
                статус
            </span>
            {filter !== "ALL" && (
                <button
                    type="button"
                    onClick={onFilter("ALL")}
                    className="btn_like_div clear-filter">
                    <i className="fa fa-times" />
                </button>
            )}
            <Dropdown
                className="status__filter"
                isOpen={open}
                toggle={() => setOpen(!open)}>
                <DropdownToggle
                    title={statusTypes[filter]}
                    caret>
                    <span className="dropdown-title">
                        {statusTypes[filter]}
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    {FILTER_STATUSES.map((f, i) => (
                        <DropdownItem
                            active={filter === f.value}
                            onClick={onFilter(f.value)}
                            key={String(i)}>
                            {f.title}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

StatusFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    onFilterHandler: PropTypes.func.isRequired,
};

export default memo(StatusFilter);
