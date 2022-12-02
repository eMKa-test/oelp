import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Button, Col, Spinner } from "reactstrap";

const BindMarkers = ({
    submitLoad,
    disabledControl,
    onSave,
}) => (
    <Col
        xs={12}
        className="row_control">
        <Button
            title="Сохранить изменённое расположение маркеров контента (синие)"
            disabled={submitLoad || disabledControl}
            className="w-100 control__button button button-save"
            color={submitLoad ? "light" : "success"}
            onClick={() => onSave(false)}>
            {submitLoad ? (
                <Spinner
                    className="save-btn__loader"
                    size="sm" />
            ) : null}
            <i className="fa fa-check text-light" />
        </Button>
    </Col>
);

BindMarkers.propTypes = {
    submitLoad: PropTypes.bool.isRequired,
    disabledControl: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default memo(BindMarkers);
