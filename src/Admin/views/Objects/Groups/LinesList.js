import React, { memo, useCallback } from "react";
import { Collapse, Row, Col } from "reactstrap";

function LinesList(props) {
    const { } = props;

    return (
        <Row>
            <Col className="LinesList">
                Список отрезков
            </Col>
        </Row>
    );
}

LinesList.propTypes = {};

export default memo(LinesList);
