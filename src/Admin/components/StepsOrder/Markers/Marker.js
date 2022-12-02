import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Marker as RLMarker } from "react-leaflet";
import { customIcon } from "../helpers";

const Marker = (props) => {
    const {
        marker,
        selectMarker,
        isActive,
    } = props;

    return (
        <RLMarker
            onClick={selectMarker(marker)}
            zIndexOffset={0}
            icon={customIcon(marker.index, isActive, marker.deadEnd)}
            position={marker.position} />
    );
};

Marker.propTypes = {
    marker: PropTypes.shape({
        index: PropTypes.number,
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
        deadEnd: PropTypes.bool,
    }),
    selectMarker: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
};

export default memo(Marker);
