import React, {
    memo, useCallback, useState, useEffect, useRef,
} from "react";
import { Col, Row, InputGroup } from "reactstrap";
import Select, { Option, OptGroup } from "rc-select";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { useHistory } from "react-router";
import { getData } from "../../../../api";
import SearchType from "./SearchType";
import { initialOptions, dropdownMenuStyle } from "./helpers";
import "./style.css";

function Search() {
    const [options, setOptions] = useState(Object.values(initialOptions));
    const [searchType, setSearchType] = useState(null);
    const [loading, setLoading] = useState(false);
    const { push } = useHistory();
    const selectRef = useRef();

    useEffect(() => {
        let result;
        if (!searchType) {
            result = Object.values(initialOptions);
        } else {
            result = [initialOptions[searchType]];
        }
        setOptions(result);
    }, [searchType]);

    const searchFetch = debounce(useCallback((val) => {
        const url = "/admin/api/search/";
        const mainUrl = searchType ? url + searchType : url;
        getData({
            mainUrl,
            params: {
                query: val,
            },
        }).then((res) => {
            let newOptions;
            if (searchType) {
                newOptions = [...options];
                newOptions[0].options = [...res.payload];
            } else {
                const result = { ...initialOptions };
                for (const [type, opts] of Object.entries(res.payload)) {
                    result[type].options = [...opts];
                }
                newOptions = Object.values(result);
            }
            setOptions(newOptions);
            setLoading(false);
        })
            .catch((err) => {
                const msg = err.message || err.response.message;
                toast.error(`Ошибка запроса. ${msg}`, { autoClose: 4000 });
                setLoading(false);
            });
    }, [searchType, options]), 500);

    const onSearch = useCallback((text) => {
        setLoading(true);
        searchFetch(text);
    }, [searchType, options]);

    const onSelectSearchType = useCallback((val) => {
        setSearchType(val);
    }, []);

    const onSelect = useCallback((_value, { props: { testprop } }) => {
        let url;
        switch (testprop.type) {
            case "companies": url = `/admin/companies/${testprop.id}`;
                break;
            case "projects": url = `/admin/objects/${testprop.id}`;
                break;
            case "groups": url = `/admin/objects/${testprop.projectId}?groupId=${testprop.id}`;
                break;
            case "lines": url = `/admin/objects/${testprop.projectId}/${testprop.id}`;
                break;
            default: url = `/admin/users?userId=${testprop.id}`;
        }
        push(url);
    }, [searchType]);

    const resetHandler = useCallback(() => {
        const res = { ...initialOptions };
        for (const [key, val] of Object.entries(res)) {
            val.options = [];
        }
        setOptions(Object.values(res));
        const selectedValue = document.querySelector(".rc-select-selection-selected-value");
        if (selectedValue) {
            selectedValue.remove();
        }
    }, []);

    return (
        <Row className="search-panel mb-3">
            <Col
                xs="12"
                xl="4"
                lg="6">
                <InputGroup>
                    <Select
                        ref={selectRef}
                        onBlur={resetHandler}
                        onSearch={onSearch}
                        onSelect={onSelect}
                        className="rc-select-customize"
                        animation="slide-up"
                        dropdownMenuStyle={dropdownMenuStyle}
                        optionFilterProp="label"
                        optionLabelProp="label"
                        labelInValue
                        placeholder="Поиск"
                        loading={loading}
                        notFoundContent="Нет результата">
                        {options?.map((group) => (
                            <OptGroup
                                key={group.id}
                                title={group.title}
                                label={group.label}>
                                {group.options.map((opt) => (
                                    <Option
                                        key={opt.id}
                                        testprop={{ type: group.value, ...opt }}
                                        label={opt.label || opt.name}
                                        title={opt.title || opt.description}>
                                        {opt.label || opt.name}
                                        {opt?.description ? (
                                            <p className="rc-select__option-description">{opt?.description}</p>
                                        ) : null}
                                    </Option>
                                ))}
                            </OptGroup>
                        ))}
                    </Select>
                    <SearchType
                        onSelectSearchType={onSelectSearchType}
                        searchType={searchType} />
                </InputGroup>
            </Col>
        </Row>
    );
}

export default memo(Search);
