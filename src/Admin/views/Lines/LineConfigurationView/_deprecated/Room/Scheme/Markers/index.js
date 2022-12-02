import React, { memo, Fragment } from "react";
import * as PropTypes from "prop-types";
import MarkersGroup from "./MarkersGroup";
import MarkersDefaultGroup from "./MarkersDefaultGroup";
import MarkerInitialPosition from "./MarkerInitialPosition";

const Markers = ({
    setConfirm,
    stage,
    markers,
    defaultMarkers,
    showDefaultMarkers,
    showMarkers,
    initialPosition,
    setInitialPosition,
}) => {
    return (
        <Fragment>
            <MarkerInitialPosition
                stage={stage}
                setInitialPosition={setInitialPosition}
                position={initialPosition} />
            {showDefaultMarkers && defaultMarkers.length > 0 ? (
                <MarkersDefaultGroup
                    stage={stage}
                    setConfirm={setConfirm}
                    markers={defaultMarkers} />
            ) : null}
            {showMarkers && markers.length > 0 ? (
                <MarkersGroup
                    stage={stage}
                    markers={markers} />
            ) : null}
        </Fragment>
    );
};

Markers.propTypes = {
    setConfirm: PropTypes.func.isRequired,
    setInitialPosition: PropTypes.func.isRequired,
    showMarkers: PropTypes.bool.isRequired,
    showDefaultMarkers: PropTypes.bool.isRequired,
    markers: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
    initialPosition: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    defaultMarkers: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
};

export default memo(Markers);
