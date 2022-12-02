import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import Select, { Option, OptGroup } from "rc-select";
import { bindActionCreators } from "redux";
import { selectLine } from "../../store/actionsCreator/appActions";
import SearchIcon from "../../assets/searchIcon.svg";
import "./style.css";

export const dropdownMenuStyle = {
    maxHeight: "300px",
    overflowY: "visible",
    overflowX: "hidden",
};

const SelectPane = (props) => {
    const {
        objects,
        setLine,
        load,
        selectedLines,
        loading,
    } = props;
    const [value, setValue] = useState([]);

    useEffect(() => {
        const result = selectedLines.map((l) => ({
            key: l.id,
            label: l.name,
        }));
        setValue(result);
    }, [selectedLines]);

    const onChange = useCallback((val) => {
        setLine(val);
    }, []);

    return (
        <div className="select-projects__wrapper">
            <div className="flex-center search-icon">
                <img
                    src={SearchIcon}
                    alt="search-icon" />
            </div>
            <Select
                disabled={loading || load}
                value={value}
                onChange={onChange}
                className="rc-select-customize"
                animation="slide-up"
                dropdownMenuStyle={dropdownMenuStyle}
                optionFilterProp="label"
                optionLabelProp="label"
                labelInValue
                allowClear
                multiple
                placeholder="Выберите отрезок"
                loading={load}
                notFoundContent="Не найдено совпадений">
                {objects.map((o) => (
                    <OptGroup
                        label={o.name}
                        title={o.name}
                        key={o.id}>
                        {o.lines.length ? o.lines.map((l) => (
                            <Option
                                label={l.name}
                                title={l.name}
                                key={l.id}
                                value={l.id}>
                                &#10012;
                                &nbsp;
                                {l.name}
                            </Option>
                        )) : (
                            <Option
                                key={0}
                                disabled>
                                Нет отрезков
                            </Option>
                        )}
                    </OptGroup>
                ))}
            </Select>
        </div>
    );
};

SelectPane.propTypes = {
    setLine: PropTypes.func.isRequired,
    load: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    objects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
    selectedLines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
};

const mapStateToProps = (store) => ({
    objects: store.app.objects,
    load: store.upload.load,
    selectedLines: store.app.selectedLines,
    loading: store.upload.load,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLine: selectLine,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(SelectPane));
