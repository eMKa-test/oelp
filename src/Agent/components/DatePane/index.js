import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input } from "reactstrap";
import { changeDate } from "../../store/actionsCreator/appActions";
import "./style.css";

const DatePane = (props) => {
    const {
        date,
        handleChangeDate,
        loading,
    } = props;

    const onChangeDate = useCallback((e) => {
        const { value } = e.target;
        if (value) {
            return handleChangeDate(value);
        }
        e.preventDefault();
        return false;
    }, []);

    return (
        <div className="date-pane__wrapper">
            <Input
                max={moment()
                    .format("YYYY-MM-DD")}
                type="date"
                value={date}
                disabled={loading}
                onChange={onChangeDate} />
        </div>
    );
};

DatePane.propTypes = {
    date: PropTypes.string.isRequired,
    handleChangeDate: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    date: store.app.date,
    loading: store.upload.load,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleChangeDate: changeDate,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(DatePane));
