import React, {
    memo, useCallback, useEffect, useRef, useReducer,
} from "react";
import { Progress } from "reactstrap";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Stage, Layer } from "react-konva";
import { toast } from "react-toastify";
import GridGroup from "./GridGroup";
import SchemeGroup from "./SchemeGroup";
import MarkersGroups from "./Markers";
import Control from "./Control";
import { onWheel, boundFunc, reconstructArray } from "./helpers";
import DeleteModal from "../../../../../../common/DeleteModal";
import reducer, {
    initialState,
    setConfirm,
    switchGrid,
    switchGrab,
    setSubmitLoad,
    setViewParams,
    setSchemeLoad,
    resetView,
    setDefaultMarkers,
    setContentMarkers,
    toggleShowDefaultMarkers,
    toggleShowMarkers,
    deleteDefaultMarkers,
    setInitialPosition,
} from "./reducer";
import "./style.css";

const Scheme = ({
    line,
    updateLine,
    content,
    dateFrom,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);
    const stageRef = useRef();
    const baseLayerRef = useRef();
    const schemeImage = line?.schemeImage;
    const schemePoints = line?.schemePoints;

    useEffect(() => {
        return () => stageRef.current && stageRef.current.destroy();
    }, []);

    const toggleGridMode = useCallback(() => {
        dispatch(switchGrid(!state.gridActive));
    }, [state.gridActive]);

    const handleSchemeLoad = useCallback((value) => {
        dispatch(setSchemeLoad(value));
    }, []);

    const resetScale = useCallback(() => {
        const layer = baseLayerRef.current;
        layer.scale({
            x: 1,
            y: 1,
        });
        layer.position({
            x: 0,
            y: 0,
        });
    }, [baseLayerRef?.current]);

    const toggleGrabMode = useCallback(() => {
        dispatch(switchGrab(!state.grabActive));
        if (state.grabActive) {
            resetScale();
        }
    }, [state.grabActive, baseLayerRef?.current]);

    useEffect(() => {
        let height;
        if (schemeImage) {
            height = state.viewParams.width * (schemeImage.height / schemeImage.width);
        } else {
            height = 300;
        }
        dispatch(setViewParams({
            width: state.viewParams.width,
            height,
        }));
    }, [schemeImage]);

    useEffect(() => {
        if (schemePoints?.defaultPoints) {
            dispatch(setDefaultMarkers(line.schemePoints.defaultPoints));
        } else {
            dispatch(setDefaultMarkers([]));
            dispatch(setContentMarkers(null));
        }
    }, [schemePoints]);

    useEffect(() => {
        dispatch(setContentMarkers(content, line?.schemePoints));
    }, [content, line?.schemePoints]);

    const {
        width,
        height,
    } = state.viewParams;

    const dragBoundFunc = useCallback((pos) => {
        const layer = baseLayerRef.current;
        return boundFunc(pos, layer.scale().x, {
            width: layer.width(),
            height: layer.height(),
        });
    }, [baseLayerRef?.current]);

    const createMarkers = useCallback((count, callback, position) => {
        const result = [...state.defaultMarkers];
        const arr = [...Array(count)].map((el, i) => ({
            pointId: result.length + i + 1,
            schemePoint: {
                x: position?.x || state.initialPosition.x,
                y: position?.y || state.initialPosition.y,
            },
        }));
        arr.reverse();
        const res = result.concat(arr);
        dispatch(setDefaultMarkers(res));
        if (typeof callback === "function") {
            callback();
        }
    }, [state.defaultMarkers, state.initialPosition]);

    const onSave = useCallback((isDefault = false) => {
        if (stageRef?.current) {
            const stage = stageRef.current;
            const schemePoints = {
                schemeFrameSize: {
                    width: stage.width(),
                    height: stage.height(),
                },
                ...line.schemePoints,
            };
            let markersGroups;
            if (isDefault) {
                markersGroups = stage.find("#defaultGroup");
                schemePoints.defaultPoints = [];
            } else {
                markersGroups = stage.find("#markerGroup");
                schemePoints.points = { [dateFrom]: {} };
            }
            if (markersGroups && markersGroups?.length === 0) {
                dispatch(setSubmitLoad(false));
                return toast.error("Маркеры не добавлены");
            }
            dispatch(setSubmitLoad(true));
            const points = [];
            markersGroups.forEach((group) => {
                if (isDefault) {
                    schemePoints.defaultPoints.push({
                        pointId: group.attrs.pointId,
                        schemePoint: group.attrs.schemePoint || group.attrs.rawCoords,
                    });
                } else {
                    points.push({
                        pointId: group.attrs.pointId,
                        schemePoint: group.attrs.schemePoint || group.attrs.rawCoords,
                    });
                }
            });
            if (isDefault) {
                schemePoints.defaultPoints.sort((a, b) => a.pointId - b.pointId);
            } else if (line.schemePoints.points) {
                schemePoints.points = {
                    ...line.schemePoints.points,
                    [dateFrom]: points,
                };
            } else {
                schemePoints.points = { [dateFrom]: points };
            }
            updateLine({
                objectID: line.projectId,
                line: {
                    ...line,
                    schemePoints,
                },
                callback: () => {
                    dispatch(resetView());
                    resetScale();
                },
            });
        }
    }, [stageRef?.current, line, baseLayerRef?.current, dateFrom]);

    const onDeleteMarker = useCallback((e) => {
        e.preventDefault();
        if (stageRef?.current) {
            const groups = stageRef.current.find(state.confirm.groupId);
            const newMarkers = [];
            groups.forEach((group) => {
                newMarkers.push({ ...group.attrs });
            });
            reconstructArray(newMarkers, state.confirm.index);
            dispatch(deleteDefaultMarkers(newMarkers, state.confirm.index));
            dispatch(setConfirm(null));
        }
    }, [stageRef?.current, state.confirm, state.defaultMarkers]);

    const toggleConfirm = useCallback((params) => {
        dispatch(setConfirm(params));
    }, [stageRef]);

    const onTripleClick = useCallback((e) => {
        if (e.evt.detail === 3) {
            const position = e.target.getRelativePointerPosition(e.target.parent);
            createMarkers(1, null, position);
        }
    }, [stageRef.current, state.defaultMarkers]);

    return (
        <div className={`scheme__wrapper ${state.grabActive ? "grabbingMode" : ""}`}>
            <div>
                {state.schemeLoad && (
                    <Progress
                        className="progress"
                        animated
                        bar
                        color="info"
                        value="100" />
                )}
                <Stage
                    onClick={onTripleClick}
                    ref={stageRef}
                    width={width}
                    height={height}>
                    <Layer
                        ref={baseLayerRef}
                        draggable={state.grabActive}
                        onWheel={onWheel(state.grabActive)}
                        dragBoundFunc={dragBoundFunc}
                        id="baseLayer">
                        <SchemeGroup
                            setSchemeLoad={handleSchemeLoad}
                            width={width}
                            height={height}
                            schemeImage={schemeImage} />
                        {state.gridActive && (
                            <GridGroup
                                width={width}
                                height={height} />
                        )}
                        {!state.schemeLoad && schemeImage ? (
                            <MarkersGroups
                                setInitialPosition={(position) => dispatch(setInitialPosition(position))}
                                initialPosition={state.initialPosition}
                                showMarkers={state.showMarkers}
                                showDefaultMarkers={state.showDefaultMarkers}
                                setConfirm={toggleConfirm}
                                stage={stageRef.current}
                                markers={state.markers}
                                defaultPoints={line?.schemePoints?.defaultPoints}
                                defaultMarkers={state.defaultMarkers} />
                        ) : null}
                    </Layer>
                </Stage>
            </div>
            <Control
                toggleShowMarkers={() => dispatch(toggleShowMarkers())}
                showMarkers={state.showMarkers}
                showDefaultMarkers={state.showDefaultMarkers}
                toggleShowDefaultMarkers={() => dispatch(toggleShowDefaultMarkers())}
                stage={stageRef?.current}
                markersLen={state.markers?.length}
                schemeImage={line?.schemeImage}
                schemePoints={line?.schemePoints}
                onSave={onSave}
                createMarkers={createMarkers}
                toggleGridMode={toggleGridMode}
                gridActive={state.gridActive}
                toggleGrabMode={toggleGrabMode}
                submitLoad={state.submitLoad}
                grabActive={state.grabActive} />
            <DeleteModal
                submit={onDeleteMarker}
                isOpen={typeof state.confirm?.index === "number"}
                title="Подтверждение удаления маркера"
                toggleModal={() => dispatch(setConfirm(null))} />
        </div>
    );
};

Scheme.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        scheme: PropTypes.shape({
            image: PropTypes.shape({
                src: PropTypes.string,
                width: PropTypes.number,
                height: PropTypes.number,
            }),
        }),
        schemePoints: PropTypes.shape({
            defaultPoints: PropTypes.arrayOf(PropTypes.shape({
                pointId: PropTypes.number,
            })),
        }),
    }),
    updateLine: PropTypes.func.isRequired,
    dateFrom: PropTypes.string,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
    dateFrom: store.content.dateFrom,
});

export default connect(mapStateToProps, null)(memo(Scheme));
