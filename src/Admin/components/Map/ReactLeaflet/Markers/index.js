import React, { memo, useEffect } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { LayerGroup } from "react-leaflet";
import Marker from "./Marker";

const Markers = (props) => {
    const { markers, edit, setEdit } = props;

    useEffect(() => {
        if (edit) {
            setEdit(false);
        }
    }, [edit]);

    if (edit) {
        return null;
    }

    return (
        <LayerGroup id="markersLayer">
            {markers.map((marker) => (
                <Marker
                    key={String(marker.id)}
                    marker={marker} />
            ))}
        </LayerGroup>
    );
};

Markers.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number),
    })),
    edit: PropTypes.bool.isRequired,
    setEdit: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    markers: store.map.markers,
});

export default connect(mapStateToProps)(memo(Markers));
