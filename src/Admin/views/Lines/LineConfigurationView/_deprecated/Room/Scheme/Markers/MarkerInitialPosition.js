import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Group, Image as KImage, Text } from "react-konva";
import dotIcon from "../../../../../../../assets/mapIcon/schemeInitialPosition.svg";

const MARKER_WIDTH = 30;
const MARKER_HEIGHT = 30;

const MarkerInitialPosition = (props) => {
    const {
        stage,
        position,
        setInitialPosition,
    } = props;
    const [img, setImg] = useState(null);
    const [load, setLoad] = useState(true);
    const [showTooltip, setShoTooltip] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            setImg(image);
            setLoad(false);
        };
        image.src = dotIcon;
        return () => {
            image.onload = () => null;
            image.remove();
        };
    }, []);

    const onDragEnd = useCallback(({ target }) => {
        const newPosition = target.getAbsolutePosition(target.parent);
        setInitialPosition(newPosition);
    }, [stage, setInitialPosition]);

    const onMouseOver = useCallback(() => {
        document.body.style.cursor = "pointer";
        setShoTooltip(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        document.body.style.cursor = "default";
        setShoTooltip(false);
    }, []);

    if (!stage || load) {
        return null;
    }

    return (
        <Group
            x={position.x}
            y={position.y}
            draggable
            rotation={45}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onDragEnd={onDragEnd}
            id="initialPositionGroup">
            <KImage
                x={0}
                y={0}
                width={MARKER_WIDTH}
                height={MARKER_HEIGHT}
                offsetX={MARKER_WIDTH / 2}
                offsetY={MARKER_HEIGHT / 2}
                image={img} />
            {showTooltip && (
                <Text
                    offsetX={-MARKER_WIDTH + 4}
                    offsetY={MARKER_HEIGHT / 2 - 6}
                    fontSize={15}
                    rotation={-45}
                    text="Место посадки дефолтных маркеров. Двигается"
                    fill="red" />
            )}
        </Group>
    );
};

MarkerInitialPosition.propTypes = {
    stage: PropTypes.any,
    setInitialPosition: PropTypes.func.isRequired,
    position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
};

export default memo(MarkerInitialPosition);
