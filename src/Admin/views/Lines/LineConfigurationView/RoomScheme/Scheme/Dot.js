import React, { memo, useCallback, useMemo } from "react";
import * as PropTypes from "prop-types";
import { Group, Circle, Text } from "react-konva";
import { setCursorDefault, setCursorPointer } from "../helpers";

const RADIUS_TOP = 9;
const RADIUS_BOTTOM = 3;

const Dot = (props) => {
    const {
        deleteDot,
        dot,
        setDotCoords,
    } = props;

    const {
        schemePoint: {
            x,
            y,
        },
        pointId,
    } = dot;

    const onDragEnd = useCallback((ev) => {
        const { target } = ev;
        const position = target.getAbsolutePosition(target.parent);
        setDotCoords({
            pointId,
            schemePoint: { ...position },
        });
    }, [pointId]);

    return (
        <Group
            onDragEnd={onDragEnd}
            onDragMove={() => null}
            onDblClick={deleteDot(pointId)}
            onMouseOver={setCursorPointer}
            onMouseLeave={setCursorDefault}
            x={x}
            y={y}
            pointId={pointId}
            draggable
            id="pointsGroup">
            <Circle
                x={0}
                y={0}
                radius={RADIUS_TOP}
                stroke="#6289ff"
                strokeWidth={3} />
            <Circle
                x={0}
                y={0}
                radius={RADIUS_BOTTOM}
                fill="red" />
            <Text
                offsetX={RADIUS_TOP / 2}
                offsetY={RADIUS_TOP * 2.3}
                fontSize={14}
                fontStyle="bold"
                fill="red"
                text={pointId} />
        </Group>
    );
};

Dot.propTypes = {
    setDotCoords: PropTypes.func.isRequired,
    deleteDot: PropTypes.func.isRequired,
    viewParams: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    dot: PropTypes.shape({
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        pointId: PropTypes.number,
    }),
};

export default memo(Dot);
