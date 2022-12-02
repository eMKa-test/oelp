import React, {
    memo, useCallback, useRef, useState,
} from "react";
import {
    Map, TileLayer, LayersControl,
} from "react-leaflet";
import * as PropTypes from "prop-types";
import { GestureHandling } from "leaflet-gesture-handling";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { satelliteUrl, streetUrl } from "../constants";
import { resetEditMode, updateMarkersPosition } from "../../../store/actionCreators/mapActions";
import { updateContent } from "../../../store/actionCreators/contentActions";
import Markers from "./Markers";
import Layers from "./Layers";
import ContentLoader from "../../Loaders";
import ControlPanel from "./ControlPanel";
import PolyLines from "./PolyLines";
import GPSTooltip from "./GPSTooltip";
import "./style.css";

const ReactLeaflet = (props) => {
    const {
        map: {
            load,
            bounds,
            center,
            zoom,
            polyMode,
        },
        dateFrom,
        contentType,
        resetEdit,
        updateMarkers,
        updateContents,
    } = props;
    const [edit, setEdit] = useState(false);
    const [gpsInfo, setGPSInfo] = useState(null);
    const wrapperRef = useRef();
    const mapRef = useRef();
    const bound = bounds?.length > 1 ? { bounds } : {};

    const cancelEdit = useCallback(() => {
        resetEdit();
        setEdit(true);
    }, [mapRef?.current]);

    const submitMarkers = useCallback(() => {
        updateMarkers(contentType, () => updateContents(dateFrom));
    }, [contentType, dateFrom]);

    const getCoords = useCallback((e) => {
        const params = wrapperRef.current.getBoundingClientRect();
        const coords = {
            ...e.latlng,
            x: e.originalEvent.clientX - params.left,
            y: e.originalEvent.clientY - params.top,
        };
        setGPSInfo(coords);
    }, [wrapperRef.current]);

    const onCancelTooltip = useCallback(() => {
        if (gpsInfo) {
            setGPSInfo(null);
        }
    }, [gpsInfo]);

    return (
        <div
            ref={wrapperRef}
            className="correct-map__wrapper"
            style={{ height: 800 }}>
            {load ? (
                <ContentLoader active={load} />
            ) : (
                <Map
                    {...bound}
                    ref={mapRef}
                    id="map"
                    onClick={onCancelTooltip}
                    onContextMenu={getCoords}
                    zoomSnap={1.6}
                    gestureHandling
                    center={center}
                    maxZoom={21}
                    minZoom={4}
                    zoom={zoom}>
                    <LayersControl
                        collapsed={false}
                        position="bottomleft">
                        <LayersControl.BaseLayer
                            checked
                            name="спутник">
                            <TileLayer
                                crossOrigin
                                maxZoom={21}
                                url={satelliteUrl} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="схема">
                            <TileLayer
                                maxZoom={20}
                                url={streetUrl} />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Layers />
                    <Markers
                        setEdit={setEdit}
                        edit={edit} />
                    {polyMode ? (
                        <PolyLines />
                    ) : null}
                </Map>
            )}
            <GPSTooltip
                onCancel={() => setGPSInfo(null)}
                coords={gpsInfo} />
            <ControlPanel
                cancelEdit={cancelEdit}
                submitMarkers={submitMarkers} />
        </div>
    );
};

ReactLeaflet.propTypes = {
    map: PropTypes.shape({
        bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        center: PropTypes.arrayOf(PropTypes.number),
        zoom: PropTypes.number,
        load: PropTypes.bool,
        polyMode: PropTypes.bool,
    }),
    resetEdit: PropTypes.func.isRequired,
    updateContents: PropTypes.func.isRequired,
    updateMarkers: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired,
    dateFrom: PropTypes.string,
};

const mapStateToProps = (store) => ({
    map: store.map,
    contentType: store.content.contentType,
    dateFrom: store.content.dateFrom,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    resetEdit: resetEditMode,
    updateMarkers: updateMarkersPosition,
    updateContents: updateContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ReactLeaflet));
