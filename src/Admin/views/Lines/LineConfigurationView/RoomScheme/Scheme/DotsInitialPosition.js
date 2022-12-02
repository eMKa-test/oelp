import React, {
    memo, useCallback, useState,
} from "react";
import * as PropTypes from "prop-types";
import {
    Group, Circle, Rect, Text,
} from "react-konva";

const DotsInitialPosition = (props) => {
    const {
        stage,
        position,
        setDefaultDotsCoords,
    } = props;
    const [showTooltip, setShoTooltip] = useState(false);

    const onDragEnd = useCallback(({ target }) => {
        const newPosition = target.getAbsolutePosition(target.parent);
        setDefaultDotsCoords(newPosition);
    }, [stage, setDefaultDotsCoords]);

    const onMouseOver = useCallback(() => {
        document.body.style.cursor = "pointer";
        setShoTooltip(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        document.body.style.cursor = "default";
        setShoTooltip(false);
    }, []);

    if (!stage) {
        return null;
    }

    return (
        <Group
            x={position.x}
            y={position.y}
            draggable
            rotation={-45}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onDragEnd={onDragEnd}
            id="initialPositionGroup">
            <Rect
                x={-14}
                y={-14}
                width={28}
                height={28}
                strokeWidth={2}
                stroke="red" />
            <Circle
                x={0}
                y={0}
                fill="red"
                radius={3} />
            {showTooltip && (
                <Text
                    rotation={45}
                    offsetX={-22}
                    offsetY={5}
                    fontSize={15}
                    text="Место посадки маркеров"
                    fill="red" />
            )}
        </Group>
    );
};

DotsInitialPosition.propTypes = {
    stage: PropTypes.any,
    setDefaultDotsCoords: PropTypes.func.isRequired,
    position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
};

export default memo(DotsInitialPosition);
