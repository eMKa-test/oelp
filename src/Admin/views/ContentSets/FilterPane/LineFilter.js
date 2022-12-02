import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from "reactstrap";

const LineFilter = (props) => {
    const {
        onFilterHandler,
        filter,
        lines,
    } = props;
    const [open, setOpen] = useState(false);
    const lineName = lines.find((line) => String(line.id) === filter)?.name || "Все";

    const onFilter = useCallback((value) => () => {
        onFilterHandler({
            type: "lineId",
            value,
        });
    }, [onFilterHandler]);

    return (
        <div className="filter-wrapper">
            <span className="filter-title">
                место
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
                className="line__filter"
                isOpen={open}
                toggle={() => setOpen(!open)}>
                <DropdownToggle
                    title={lineName}
                    caret>
                    <span className="dropdown-title">
                        {lineName}
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    {lines.map((line, i) => (
                        <DropdownItem
                            active={filter === String(line.id)}
                            onClick={onFilter(String(line.id))}
                            key={String(i)}>
                            {line.name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

LineFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    onFilterHandler: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string.isRequired,
    })),
};

export default memo(LineFilter);
