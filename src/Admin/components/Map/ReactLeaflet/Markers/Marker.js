import React, {
    memo, useCallback, useEffect, useMemo,
} from "react";
import * as PropTypes from "prop-types";
import { Marker as RLMarker } from "react-leaflet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setActiveMarker, addToEdit } from "../../../../store/actionCreators/mapActions";
import { customIcon } from "../helpers";
import markerIcon from "../../../../assets/icons/marker.svg";
import markerActiveIcon from "../../../../assets/icons/markerActive.svg";

const Marker = (props) => {
    const {
        marker,
        setActive,
        addToEditItem,
        activeMarker,
    } = props;
    const isActive = useMemo(() => marker.id === activeMarker?.id, [activeMarker?.id]);

    useEffect(() => {

    }, []);

    const onClick = useCallback(() => {
        setActive(marker);
    }, [marker]);

    const onDragEnd = useCallback(({ target }) => {
        const coords = target.getLatLng();
        addToEditItem(marker, coords);
    }, [marker]);

    return isActive ? (
        <RLMarker
            onClick={onClick}
            draggable
            zIndexOffset={1}
            onDragEnd={onDragEnd}
            icon={customIcon(marker.index, markerActiveIcon)}
            position={marker.position} />
    ) : (
        <RLMarker
            zIndexOffset={0}
            onClick={onClick}
            icon={customIcon(marker.index, markerIcon)}
            position={marker.position} />
    );
};

Marker.propTypes = {
    marker: PropTypes.shape({
        index: PropTypes.number,
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
    }),
    activeMarker: PropTypes.shape({
        id: PropTypes.number,
    }),
    setActive: PropTypes.func.isRequired,
    addToEditItem: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    activeMarker: store.map.activeMarker,
    editMarkers: store.map.editMarkers,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setActive: setActiveMarker,
    addToEditItem: addToEdit,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(Marker));
