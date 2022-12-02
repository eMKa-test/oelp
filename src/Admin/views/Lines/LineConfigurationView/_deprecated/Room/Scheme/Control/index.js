import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Row } from "reactstrap";
import SchemeHelper from "./SchemeHelper";
import CreateMarkers from "./CreateMarkers";
import BindMarkers from "./BindMarkers";

const Control = (props) => {
    const {
        gridActive, toggleGridMode, grabActive, toggleGrabMode, stage,
        submitLoad, createMarkers, onSave, schemeImage, markersLen, toggleShowDefaultMarkers,
        showDefaultMarkers, showMarkers, toggleShowMarkers,
    } = props;
    const disabledControl = !schemeImage;

    return (
        <div className="scheme__control">
            <Row>
                <SchemeHelper
                    showMarkers={showMarkers}
                    toggleShowMarkers={toggleShowMarkers}
                    showDefaultMarkers={showDefaultMarkers}
                    toggleShowDefaultMarkers={toggleShowDefaultMarkers}
                    disabledControl={disabledControl}
                    gridActive={gridActive}
                    toggleGridMode={toggleGridMode}
                    grabActive={grabActive}
                    toggleGrabMode={toggleGrabMode} />
                <CreateMarkers
                    showDefaultMarkers={showDefaultMarkers}
                    stage={stage}
                    disabledControl={disabledControl}
                    createMarkers={createMarkers}
                    submitLoad={submitLoad}
                    onSave={onSave}
                    markersLen={markersLen} />
                <BindMarkers
                    stage={stage}
                    onSave={onSave}
                    disabledControl={disabledControl}
                    submitLoad={submitLoad} />
            </Row>
        </div>
    );
};

Control.propTypes = {
    showMarkers: PropTypes.bool.isRequired,
    toggleShowMarkers: PropTypes.func.isRequired,
    gridActive: PropTypes.bool.isRequired,
    toggleGridMode: PropTypes.func.isRequired,
    grabActive: PropTypes.bool.isRequired,
    toggleGrabMode: PropTypes.func.isRequired,
    submitLoad: PropTypes.bool.isRequired,
    showDefaultMarkers: PropTypes.bool.isRequired,
    createMarkers: PropTypes.func.isRequired,
    toggleShowDefaultMarkers: PropTypes.func.isRequired,
    markersLen: PropTypes.number,
    stage: PropTypes.any,
    onSave: PropTypes.func.isRequired,
    schemeImage: PropTypes.shape({
        src: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
};

export default memo(Control);
