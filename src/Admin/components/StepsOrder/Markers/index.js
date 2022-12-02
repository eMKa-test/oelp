import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { LayerGroup } from "react-leaflet";
import Marker from "./Marker";

const Markers = (props) => {
    const { markers, selectMarker, activeMarker } = props;

    return (
        <LayerGroup id="markersLayer">
            {markers.map((marker) => {
                const isActive = activeMarker?.id === marker?.id;
                return (
                    <Marker
                        selectMarker={selectMarker}
                        key={String(marker.id)}
                        isActive={isActive}
                        marker={marker} />
                );
            })}
        </LayerGroup>
    );
};

Markers.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number),
    })),
    selectMarker: PropTypes.func.isRequired,
    activeMarker: PropTypes.shape({
        id: PropTypes.number,
    }),
};

export default memo(Markers);
