import React, { memo, useState, useCallback } from "react";
import * as PropTypes from "prop-types";
import Select, { Option } from "rc-select";
import { Button } from "reactstrap";

const initialValue = {
    key: 0,
    label: "Выбрать отрезок",
};

const dropdownMenuStyle = {
    maxHeight: "300px",
    overflowY: "visible",
};

function SelectLines(props) {
    const { lines, group, bindLines } = props;
    const [selected, setSelected] = useState([]);
    const [selectValue, setSelectValue] = useState(initialValue);
    const readyForBind = selected?.length > 0;

    const _lines = lines.filter((line) => line.groupId !== group.id && !line.groupId);
    const options = _lines.map((line) => ({ label: line.name, id: line.id }));

    const onChange = useCallback((value) => {
        const result = value.filter(({ key }) => key > 0).map(({ key }) => Number(key));
        setSelectValue(value);
        setSelected(result);
    }, []);

    const clearSelect = useCallback(() => {
        setSelectValue(initialValue);
        setSelected([])
    }, []);

    return (
        <React.Fragment>
            <Select
                animation="slide-up"
                dropdownMenuStyle={dropdownMenuStyle}
                onChange={onChange}
                optionFilterProp="label"
                optionLabelProp="label"
                labelInValue
                allowClear
                value={selectValue}
                placeholder="Выбрать отрезок"
                style={{ width: "100%" }}
                multiple>
                {options.map(({ id, label }) => (
                    <Option
                        key={id}
                        label={label}>
                        {label}
                    </Option>
                ))}
            </Select>
            <Button
                className="bind-lines-button"
                disabled={!readyForBind}
                onClick={() => bindLines(selected, clearSelect)}
                outline
                color={`${readyForBind ? "success" : "secondary"}`}>
                <i className="fa fa-plus" />
            </Button>
        </React.Fragment>
    );
}

SelectLines.propTypes = {
    bindLines: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
    group: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
};

export default memo(SelectLines);
