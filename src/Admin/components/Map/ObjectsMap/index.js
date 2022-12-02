import React, {
    memo, useCallback, useRef, useState, useEffect,
} from "react";
import {
    Map, TileLayer, LayersControl,
} from "react-leaflet";
import isEmpty from "lodash/isEmpty";
import has from "lodash/has";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Collapse } from "reactstrap";
import { bindActionCreators } from "redux";
import { satelliteUrl, streetUrl } from "../constants";
import Marker from "./Marker";
import ContentLoader from "../../Loaders";
import { putLine } from "../../../store/actionCreators/linesActions";
import { putObject } from "../../../store/actionCreators/objectsActions";
import "./style.css";

const ObjectsMap = (props) => {
    const {
        isLines,
        open,
        markers,
        objectId,
        fetchLines,
        fetchObjects,
    } = props;
    const [load, setLoad] = useState(true);
    const [_markers, setMarkers] = useState([]);
    const [bounds, setBounds] = useState([]);
    const wrapperRef = useRef();
    const mapRef = useRef();
    const initialView = useRef({
        zoom: 15,
        center: [59.851623, 30.322146],
    });

    useEffect(() => {
        if (open) {
            const result = [];
            const _bounds = [];
            markers.forEach((m) => {
                if (!isEmpty(m.gps) && has(m, "gps.long") && has(m, "gps.lat")) {
                    const position = Object.values(m.gps);
                    result.push({
                        id: m.id,
                        name: m.name,
                        position,
                    });
                    _bounds.push(position);
                }
            });
            setBounds(_bounds);
            setMarkers(result);
        }
    }, [open, markers]);

    const onDrag = useCallback(({ target }, item) => {
        const {
            lat,
            lng: long,
        } = target.getLatLng();
        setLoad(true);
        const body = {
            gps: {
                lat,
                long,
            },
        };
        if (isLines) {
            fetchLines({
                objectID: objectId,
                line: {
                    ...item,
                    ...body,
                },
            });
        } else {
            fetchObjects({
                object: {
                    ...item,
                    ...body,
                },
            });
        }
        setLoad(false);
    }, [isLines, objectId]);

    const onExited = useCallback(() => {
        setLoad(true);
        mapRef.current.leafletElement.invalidateSize();
    }, [mapRef.current]);

    const onEntered = useCallback(() => {
        mapRef.current.leafletElement.invalidateSize(true);
        setMapView();
        setLoad(false);
    }, [mapRef.current, bounds]);

    const setMapView = useCallback(() => {
        if (bounds?.length > 1) {
            mapRef.current.leafletElement.invalidateSize(true);
            mapRef.current.leafletElement.fitBounds([bounds]);
        } else if (bounds.length === 1) {
            mapRef.current.leafletElement.setView(bounds[0], 18);
        }
    }, [bounds]);

    return (
        <div className="col my-3">
            <Collapse
                onExited={onExited}
                onEntered={onEntered}
                isOpen={open}>
                <ContentLoader
                    stickToTop
                    active={load} />
                <div
                    ref={wrapperRef}
                    style={{ height: "500px" }}
                    className="object-map__wrapper">
                    <Map
                        {...initialView.current}
                        ref={mapRef}
                        id="map"
                        minZoom={4}
                        zoomSnap={1.15}>
                        <LayersControl
                            collapsed={false}
                            position="bottomleft">
                            <LayersControl.BaseLayer
                                checked
                                name="спутник">
                                <TileLayer
                                    crossOrigin
                                    url={satelliteUrl} />
                            </LayersControl.BaseLayer>
                            <LayersControl.BaseLayer name="схема">
                                <TileLayer
                                    url={streetUrl} />
                            </LayersControl.BaseLayer>
                        </LayersControl>
                        {_markers.map((marker, i) => (
                            <Marker
                                marker={marker}
                                key={String(i)}
                                onDrag={onDrag} />
                        ))}
                    </Map>
                </div>
            </Collapse>
        </div>
    );
};
ObjectsMap.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        gps: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
    })),
    resetEdit: PropTypes.func,
    open: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    fetchObjects: PropTypes.func,
    fetchLines: PropTypes.func,
    isLines: PropTypes.bool,
    objectId: PropTypes.number,
};

const mapStateToProps = (store) => ({
    objectId: store.currentObject?.id,
});

const mapDispachToProps = (dispatch) => bindActionCreators({
    fetchObjects: putObject,
    fetchLines: putLine,
}, dispatch);

export default connect(mapStateToProps, mapDispachToProps)(memo(ObjectsMap));
