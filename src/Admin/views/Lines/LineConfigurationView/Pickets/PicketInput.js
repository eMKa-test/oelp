import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import {
    Row, Col, Input, Button,
} from "reactstrap";

function PicketInput(props) {
    const {
        picket, onChange, onSubmit, onCancel,
    } = props;
    const _onChange = useCallback(({ target: { value } }) => {
        onChange(value);
    }, [onChange]);

    if (!picket) {
        return null;
    }

    return (
        <Row className="PicketInput">
            <Col xs="12">
                <Input
                    defaultValue={picket?.name}
                    onChange={_onChange}
                    placeholder="Название пикета" />
            </Col>
            <Col className="mt-2">
                <Button
                    title="Отмена"
                    onClick={onCancel}
                    color="primary">
                    <i className="fa fa-ban" />
                </Button>
                <Button
                    title="Добавить"
                    onClick={onSubmit}
                    className="ml-2"
                    color="success">
                    <i className="fa fa-check" />
                </Button>
            </Col>
        </Row>
    );
}

PicketInput.propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    picket: PropTypes.shape({
        name: PropTypes.string,
    }),
};

export default memo(PicketInput);
