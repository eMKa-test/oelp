import React, { memo } from "react";
import { Row, Col } from "reactstrap";
import LoadScheme from "./LoadScheme";
import Scheme from "./Scheme";
import "./style.css";

const Room = () => (
    <Row>
        <Col xs={12}>
            <div className="line__configuration">
                <LoadScheme />
                <Scheme />
            </div>
        </Col>
    </Row>
);

export default memo(Room);
