import React, { memo, useMemo } from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import Video from "./Video";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

const TimelapseTab = ({
    children,
    content,
}) => {
    const renderVideos = useMemo(() => {
        if (content.length === 0) {
            return (
                <Col
                    xs="12"
                    md="6"
                    xl="4">
                    <p>Ни одного видео ещё не загружено</p>
                </Col>
            );
        }
        return map(content, (video, i) => (
            <Col
                key={video.id || i}
                xs="12"
                sm="6"
                md="4"
                xl="3">
                <Video
                    video={video}
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
                <Row className="my-3">
                    {renderVideos}
                </Row>
            </ErrorBoundary>
        </div>
    );
};

TimelapseTab.propTypes = {
    content: PropTypes.arrayOf(PropTypes.shape({})),
    children: PropTypes.node.isRequired,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
});

export default connect(mapStateToProps, null)(memo(TimelapseTab));
