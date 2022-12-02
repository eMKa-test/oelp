import React, { memo, useMemo } from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import Panorama from "./Panorama";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const PanoramaTab = ({
    children,
    content,
    changePanId,
}) => {
    const renderImages = useMemo(() => {
        if (content.length === 0) {
            return (
                <Col
                    xs="12"
                    md="6"
                    xl="4">
                    <p>Ни одной панорамы еще не загружено</p>
                </Col>
            );
        }
        return map(content, (image, i) => (
            <Col
                key={image.id || i}
                xs="12"
                md="6"
                xl="4">
                <Panorama
                    changePanId={changePanId}
                    image={image}
                    index={content?.length - i} />
            </Col>
        ));
    }, [content]);

    return (
        <div
            style={{
                height: "100%",
                position: "relative",
            }}>
            {children}
            <ErrorBoundary>
                <Row className="mt-3">
                    {renderImages}
                </Row>
            </ErrorBoundary>
        </div>
    );
};

PanoramaTab.propTypes = {
    content: PropTypes.arrayOf(PropTypes.shape({})),
    children: PropTypes.node.isRequired,
    changePanId: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
});

export default connect(mapStateToProps, null)(memo(PanoramaTab));
