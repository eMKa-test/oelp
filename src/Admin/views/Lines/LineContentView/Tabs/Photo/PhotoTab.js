import React, { memo, useMemo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import map from "lodash/map";
import { Col, Row } from "reactstrap";
import Photo from "./Photo";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const PhotoTab = ({
    children,
    content,
}) => {
    const renderImages = useMemo(() => {
        if (content.length === 0) {
            return (
                <Col
                    xs="12"
                    md="6"
                    xl="4">
                    <p>Ни одного фото ещё не загружено</p>
                </Col>
            );
        }
        return map(content, (image, i) => (
            <Col
                key={image.id || i}
                xs="12"
                sm="6"
                md="4"
                xl="3">
                <Photo
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

PhotoTab.propTypes = {
    content: PropTypes.arrayOf(PropTypes.shape({})),
    children: PropTypes.node.isRequired,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
});

export default connect(mapStateToProps, null)(memo(PhotoTab));
