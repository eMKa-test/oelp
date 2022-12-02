import React, { memo, useMemo } from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import AeroPanorama from "./AeroPanorama";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const AeroPanoramaTab = ({
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
                    <p>Ни одной аэропанорамы ещё не загружено</p>
                </Col>
            );
        }
        return map(content, (image, i) => (
            <Col
                key={image.id || i}
                xs="12"
                md="6"
                xl="4">
                <AeroPanorama
                    changePanId={changePanId}
                    image={image}
                    index={content.length - i} />
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

AeroPanoramaTab.propTypes = {
    content: PropTypes.arrayOf(PropTypes.shape({})),
    children: PropTypes.node.isRequired,
    changePanId: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
});

export default connect(mapStateToProps, null)(memo(AeroPanoramaTab));
