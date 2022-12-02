import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from "reactstrap";

const UserFilter = (props) => {
    const {
        onFilterHandler,
        filter,
        users,
    } = props;
    const [open, setOpen] = useState(false);
    const userName = users.find((line) => String(line.id) === filter)?.name || "Все";

    const onFilter = useCallback((value) => () => {
        onFilterHandler({
            type: "userId",
            value,
        });
    }, [onFilterHandler]);

    return (
        <div className="filter-wrapper">
            <span className="filter-title">
                пользователь
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
                    title={userName}
                    caret>
                    <span className="dropdown-title">
                        {userName}
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    {users.map((user, i) => (
                        <DropdownItem
                            active={filter === String(user.id)}
                            onClick={onFilter(String(user.id))}
                            key={String(i)}>
                            {user.name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

UserFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    onFilterHandler: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string.isRequired,
    })),
};

export default memo(UserFilter);
