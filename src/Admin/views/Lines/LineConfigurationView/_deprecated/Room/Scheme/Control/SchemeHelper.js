import React, { Fragment, memo } from "react";
import * as PropTypes from "prop-types";
import { Button, Col } from "reactstrap";

const SchemeHelper = (props) => {
    const {
        gridActive,
        grabActive,
        toggleGrabMode,
        toggleGridMode,
        disabledControl,
        toggleShowDefaultMarkers,
        showDefaultMarkers,
        showMarkers,
        toggleShowMarkers,
    } = props;

    return (
        <Fragment>
            <Col
                xs={12}
                className="row_control">
                <Button
                    disabled={disabledControl}
                    outline
                    active={gridActive}
                    color={gridActive ? "warning" : "dark"}
                    title="Включить сетку"
                    onClick={toggleGridMode}
                    className="control__button button button-grid mr-2">
                    <i className="fa fa-table" />
                </Button>
                <Button
                    disabled={disabledControl}
                    outline
                    active={grabActive}
                    color={grabActive ? "warning" : "dark"}
                    title="Режим карты"
                    onClick={toggleGrabMode}
                    className="control__button button button-grab">
                    <i className="fa fa-hand-paper-o" />
                </Button>
            </Col>
            <Col
                xs={12}
                className="row_control">
                <Button
                    outline
                    disabled={disabledControl}
                    active={showDefaultMarkers}
                    color={showDefaultMarkers ? "warning" : "dark"}
                    title="Спрятать дефолтные маркеры"
                    onClick={toggleShowDefaultMarkers}
                    className="control__button button button-default mr-2">
                    <i className={`mr-2 fa ${showDefaultMarkers ? "fa-eye-slash" : "fa-eye"}`} />
                    <i className="mr-2 fa fa-thumb-tack" />
                </Button>
                <Button
                    outline
                    disabled={disabledControl}
                    active={showMarkers}
                    color={showMarkers ? "warning" : "dark"}
                    title="Спрятать маркеры"
                    onClick={toggleShowMarkers}
                    className="control__button button button-simple-markers">
                    <i className={`mr-2 fa ${showMarkers ? "fa-eye-slash" : "fa-eye"}`} />
                    <i className="fa fa-map-marker" />
                </Button>
            </Col>
        </Fragment>
    );
};

SchemeHelper.propTypes = {
    gridActive: PropTypes.bool.isRequired,
    grabActive: PropTypes.bool.isRequired,
    toggleGrabMode: PropTypes.func.isRequired,
    toggleShowDefaultMarkers: PropTypes.func.isRequired,
    toggleGridMode: PropTypes.func.isRequired,
    toggleShowMarkers: PropTypes.func.isRequired,
    disabledControl: PropTypes.bool.isRequired,
    showDefaultMarkers: PropTypes.bool.isRequired,
    showMarkers: PropTypes.bool.isRequired,
};

export default memo(SchemeHelper);
