import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Marker as RLMarker } from "react-leaflet";
import { connect } from "react-redux";
import L from "leaflet";
import markerIcon from "../../../assets/icons/marker.svg";

export const customIcon = (name) => {
    return L.divIcon({
        html: `
        <div class="object-marker"></div>
        <div class="object-marker__triangle"></div>
        <p class="object-marker__description">${name}</p>
    `,
        className: "object-marker-custom__wrapper",
        iconSize: L.point(50, 50, true),
        iconAnchor: [30, 49],
        tooltipAnchor: [0, -65],
        popupAnchor: [-15, -50],
    });
};

const Marker = (props) => {
    const {
        marker,
        onDrag,
    } = props;

    return (
        <RLMarker
            draggable
            zIndexOffset={0}
            onDragEnd={(e) => onDrag(e, marker)}
            icon={customIcon(marker.name)}
            position={marker.position} />
    );
};

Marker.propTypes = {
    marker: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
    }),
    onDrag: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    activeMarker: store.map.activeMarker,
    editMarkers: store.map.editMarkers,
});

export default connect(mapStateToProps)(memo(Marker));
