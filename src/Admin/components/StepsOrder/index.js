import React, {
    memo, useCallback, useEffect, useRef, useReducer,
} from "react";
import * as PropTypes from "prop-types";
import { LayersControl, Map, TileLayer } from "react-leaflet";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ContentLoader from "../Loaders";
import { satelliteUrl, streetUrl } from "../Map/constants";
import Markers from "./Markers";
import NeighboursArrows from "./Arrows/NeighboursArrows";
import ContentRouteArrows from "./Arrows/ContentRoutesArrows";
import StepRouteBindPanel from "./StepRouteBindPanel";
import reducer, {
    initialState,
    loadContentRoutes,
    setActiveMarker,
    setNeighbour,
    reset,
    setArrowsMode,
} from "./reducer";
import { getContentRoutes as getRoutes } from "../../store/actionCreators/panoramaActions";
import { getContent } from "../../store/actionCreators/contentActions";
import "./style.css";

const StepsOrder = (props) => {
    const {
        load,
        bounds,
        center,
        zoom,
        markers,
        lineId,
        dateFrom,
        contentType,
        getContentRoutes,
        updateContent,
        contentRoutes,
        objectId,
    } = props;
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);
    const wrapperRef = useRef();
    const mapRef = useRef();
    const bound = bounds?.length > 1 ? { bounds } : {};

    useEffect(() => {
        dispatch(loadContentRoutes(contentRoutes, markers));
    }, [markers, contentRoutes]);

    const selectMarker = useCallback((marker) => () => {
        if (state.markers.length <= 2) {
            return toast.error("Редактирование возможно при наличии 3ёх и более панорам", { autoClose: 4000 });
        }
        if (state.arrowsMode) {
            dispatch(setNeighbour(marker));
        } else {
            dispatch(setActiveMarker(marker));
        }
    }, [state.activeMarker, state.arrowsMode, state.markers]);

    const onReset = useCallback(() => {
        dispatch(reset());
    }, [state.activeMarker]);

    return (
        <div
            ref={wrapperRef}
            className="steps-order"
            style={{ height: 800 }}>
            {load ? (
                <ContentLoader active={load} />
            ) : (
                <Map
                    {...bound}
                    ref={mapRef}
                    id="map"
                    zoomSnap={1}
                    gestureHandling
                    center={center}
                    doubleClickZoom={false}
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
                                maxZoom={20}
                                url={satelliteUrl} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="схема">
                            <TileLayer url={streetUrl} />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Markers
                        contents={state.contentRoutes?.contents}
                        markers={state.markers}
                        activeMarker={state.activeMarker}
                        selectMarker={selectMarker} />
                    <ContentRouteArrows
                        contentBounds={state.contentBounds} />
                    <NeighboursArrows
                        marker={state.activeMarker}
                        neighbours={state.neighbours} />
                </Map>
            )}
            <StepRouteBindPanel
                updateContent={() => updateContent({
                    lineID: lineId,
                    objectID: objectId,
                    dateFrom,
                    contentType,
                })}
                updateContentRoutes={() => getContentRoutes({
                    lineId,
                    date: dateFrom,
                    contentType,
                })}
                routes={state.contentRoutes?.route}
                contentRouteId={state.contentRoutes?.id}
                arrowsMode={state.arrowsMode}
                setArrowsMode={() => dispatch(setArrowsMode(!state.arrowsMode))}
                lineId={lineId}
                contentType={contentType}
                dateFrom={dateFrom}
                neighbours={state.neighbours}
                onReset={onReset}
                marker={state.activeMarker} />
        </div>
    );
};

StepsOrder.propTypes = {
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    load: PropTypes.bool,
    getContentRoutes: PropTypes.func,
    updateContent: PropTypes.func,
    loop: PropTypes.shape({
        lineId: PropTypes.number,
        contentType: PropTypes.string,
    }),
    polyMode: PropTypes.bool,
    markers: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number),
    })),
    contentType: PropTypes.string.isRequired,
    dateFrom: PropTypes.string,
    lineId: PropTypes.number,
    objectId: PropTypes.number,
};

const mapStateToProps = (store) => ({
    bounds: store.map.bounds,
    center: store.map.center,
    zoom: store.map.zoom,
    load: store.map.load,
    markers: store.map.markers,
    contentType: store.content.contentType,
    dateFrom: store.content.dateFrom,
    lineId: store.currentLine.id,
    objectId: store.currentLine.projectId,
    contentRoutes: store.panorama.contentRoutes,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getContentRoutes: getRoutes,
    updateContent: getContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(StepsOrder));
