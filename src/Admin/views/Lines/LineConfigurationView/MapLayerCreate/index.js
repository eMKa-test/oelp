import React, { memo } from "react";
import { Row, Col } from "reactstrap";
import LoadMapLayer from "./LoadMapLayer";
import "./style.css";

const MapLayerCreate = () => (
    <Row>
        <Col
            xs={12}>
            <div className="map-layer-create">
                <LoadMapLayer />
            </div>
        </Col>
    </Row>
);

export default memo(MapLayerCreate);
