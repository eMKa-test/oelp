import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown,
} from "reactstrap";

const searchTypes = [
    {
        title: "везде",
        value: null,
    },
    {
        title: "компании",
        value: "companies",
    },
    {
        title: "объекты",
        value: "projects",
    },
    {
        title: "группы",
        value: "groups",
    },
    {
        title: "отрезки",
        value: "lines",
    },
    {
        title: "юзеры",
        value: "users",
    },
];

function SearchType(props) {
    const { searchType, onSelectSearchType } = props;
    const [open, setOpen] = useState(false);
    const selectedType = searchTypes.find(({ value }) => value === searchType);

    const toggle = useCallback(
        () => {
            setOpen(!open);
        },
        [open],
    );

    return (
        <InputGroupButtonDropdown
            addonType="append"
            isOpen={open}
            toggle={toggle}>
            <DropdownToggle caret>
                {selectedType.title}
            </DropdownToggle>
            <DropdownMenu>
                {searchTypes.map((type) => (
                    <DropdownItem
                        onClick={() => onSelectSearchType(type.value)}
                        key={type.title}
                        className={`search-type ${type.value === searchType ? "search-type_selected bg-primary" : ""}`}>
                        {type.title.toUpperCase()}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </InputGroupButtonDropdown>
    );
}

SearchType.propTypes = {
    searchType: PropTypes.string,
    onSelectSearchType: PropTypes.func,
};

export default memo(SearchType);
