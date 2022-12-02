import React, {
    memo, useCallback, useEffect, useRef, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Stage, Layer } from "react-konva";
import { Progress } from "reactstrap";
import {
    onWheel, dragBoundFunc, setCursorDefault,
} from "../helpers";
import SchemeGroup from "./SchemeGroup";
import GridGroup from "./GridGroup";
import Dot from "./Dot";
import DotsInitialPosition from "./DotsInitialPosition";
import "./style.css";

const Scheme = (props) => {
    const {
        gridMode,
        setDefaultDotsCoords,
        defaultCoords,
        selectedScheme,
        zoomMode,
        dots,
        setDots,
        setDotCoords,
        viewParams,
        setViewParams,
    } = props;
    const [schemeLoad, setLoad] = useState(true);
    const wrapperRef = useRef(null);
    const stageRef = useRef(null);
    const baseLayerRef = useRef(null);

    useEffect(() => {
        const node = wrapperRef.current;
        const res = node.getBoundingClientRect();
        if (node && selectedScheme) {
            const params = selectedScheme.image;
            setViewParams({
                width: res.width,
                height: (params.height / params.width) * res.width,
            });
        }
    }, [wrapperRef.current, selectedScheme]);

    useEffect(() => {
        if (!zoomMode && baseLayerRef.current) {
            const layer = baseLayerRef.current;
            if (layer.scale()?.x > 1 || layer.scale()?.y > 1) {
                layer.scale({
                    x: 1,
                    y: 1,
                });
                layer.position({
                    x: 0,
                    y: 0,
                });
            }
        }
    }, [baseLayerRef.current, zoomMode]);

    const onStageClick = useCallback((e) => {
        if (e.target.className !== "Image") {
            return null;
        }
        const position = e.target.getRelativePointerPosition(e.target.parent);
        return setDots([...dots, {
            schemePoint: { ...position },
            pointId: dots.length + 1,
        }]);
    }, [dots]);

    const deleteDot = useCallback((pointId) => () => {
        const result = dots.filter((d) => d.pointId !== Number(pointId));
        const newDots = result.map((d, i) => ({
            ...d,
            pointId: i + 1,
        }));
        setDots(newDots);
        setCursorDefault();
    }, [dots]);

    return (
        <div
            ref={wrapperRef}
            className="scheme__wrapper">
            {schemeLoad && (
                <Progress
                    className="progress"
                    animated
                    bar
                    color="info"
                    value="100" />
            )}
            <Stage
                onDblClick={onStageClick}
                ref={stageRef}
                width={viewParams.width}
                height={viewParams.height}>
                <Layer
                    ref={baseLayerRef}
                    draggable={zoomMode}
                    onDragEnd={setCursorDefault}
                    onWheel={onWheel(zoomMode)}
                    dragBoundFunc={dragBoundFunc(baseLayerRef?.current)}
                    id="baseLayer">
                    <SchemeGroup
                        setLoad={setLoad}
                        width={viewParams.width}
                        height={viewParams.height}
                        schemeImage={selectedScheme?.image} />
                    {gridMode && (
                        <GridGroup
                            width={viewParams.width}
                            height={viewParams.height} />
                    )}
                    {!schemeLoad && (
                        <DotsInitialPosition
                            position={defaultCoords}
                            setDefaultDotsCoords={setDefaultDotsCoords}
                            stage={stageRef.current} />
                    )}
                    {!schemeLoad && dots?.map((dot, i) => (
                        <Dot
                            viewParams={viewParams}
                            imageWidth={selectedScheme?.image?.width}
                            imageHeight={selectedScheme?.image?.height}
                            setDotCoords={setDotCoords}
                            key={String(i)}
                            deleteDot={deleteDot}
                            dot={dot} />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

Scheme.propTypes = {
    zoomMode: PropTypes.bool.isRequired,
    gridMode: PropTypes.bool.isRequired,
    setDefaultDotsCoords: PropTypes.func.isRequired,
    setViewParams: PropTypes.func.isRequired,
    setDotCoords: PropTypes.func,
    setDots: PropTypes.func,
    dots: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
    viewParams: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    defaultCoords: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    selectedScheme: PropTypes.shape({
        date: PropTypes.string,
        image: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
            src: PropTypes.string,
        }),
        points: PropTypes.arrayOf(PropTypes.shape({
            pointId: PropTypes.number,
            schemePoint: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number,
            }),
        })),
    }),
};

export default memo(Scheme);
