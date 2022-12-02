import React, { memo, useMemo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Button, FormGroup, Label, Input,
} from "reactstrap";
import { resetEditMode, togglePolyMode } from "../../../../store/actionCreators/mapActions";
import "./style.css";

const ControlPanel = (props) => {
    const {
        polyMode, cancelEdit, submitMarkers, togglePolyLinesMode, editMarkers, activeMarker,
    } = props;
    const disabled = useMemo(() => editMarkers.length === 0, [editMarkers]);

    return (
        <div className="control-panel">
            <FormGroup
                check
                className="my-1 bind-markers">
                <Label
                    htmlFor="polyMode"
                    className="cursor-pointer">
                    <Input
                        id="polyMode"
                        onChange={togglePolyLinesMode}
                        type="checkbox"
                        value={polyMode} />
                    Соединить
                </Label>
            </FormGroup>
            <div className="mb-2 submit">
                <Button
                    outline
                    disabled={disabled && !activeMarker}
                    color="danger"
                    className="mr-2 cancel"
                    onClick={cancelEdit}
                    title="Отменить изменения">
                    <i className="fa fa-ban" />
                </Button>
                <Button
                    disabled={disabled}
                    color="success"
                    onClick={submitMarkers}
                    title="Сохранить изменения">
                    <i className="fa fa-check" />
                </Button>
            </div>
        </div>
    );
};

ControlPanel.propTypes = {
    cancelEdit: PropTypes.func.isRequired,
    submitMarkers: PropTypes.func.isRequired,
    togglePolyLinesMode: PropTypes.func.isRequired,
    polyMode: PropTypes.bool.isRequired,
    editMarkers: PropTypes.array.isRequired,
    activeMarker: PropTypes.shape({}),
};

const mapStateToProps = (store) => ({
    polyMode: store.map.polyMode,
    editMarkers: store.map.editMarkers,
    activeMarker: store.map.activeMarker,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    resetEdit: resetEditMode,
    togglePolyLinesMode: togglePolyMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ControlPanel));
