import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Group, Text, Image as KImage } from "react-konva";
import memoize from "lodash/memoize";
import dotIcon from "../../../../../../../assets/mapIcon/schemeMarker.svg";

const MARKER_WIDTH = 30;
const MARKER_HEIGHT = 30;

const setOffsetX = memoize((value) => {
    switch (String(value).length) {
        case 1:
            return 4;
        case 2:
            return 8;
        default:
            return 12;
    }
});

const INITIAL_POSITION_X = MARKER_WIDTH + MARKER_WIDTH / 2;
const INITIAL_POSITION_Y = MARKER_HEIGHT + MARKER_HEIGHT / 2;

const MarkersGroup = (props) => {
    const {
        markers,
        stage,
    } = props;
    const [img, setImg] = useState(null);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            setImg(image);
        };
        image.src = dotIcon;
        return () => {
            image.onload = () => null;
            image.remove();
        };
    }, []);

    const onDragEnd = useCallback(({ target }) => {
        const rawCoords = { ...target.attrs.rawCoords };
        const { pointId } = target.attrs;
        const newPosition = target.getAbsolutePosition(target.parent);
        target.attrs = {
            id: "markerGroup",
            schemePoint: { ...newPosition },
            rawCoords,
            pointId,
            draggable: true,
        };
    }, [stage]);

    const onMouseOver = useCallback(() => {
        document.body.style.cursor = "pointer";
    }, []);

    const onMouseLeave = useCallback(() => {
        document.body.style.cursor = "default";
    }, []);

    if (!stage || !img) {
        return null;
    }

    return markers.map((marker, i) => {
        const { pointId } = marker;
        let x, y;
        if (marker?.schemePoint) {
            x = marker.schemePoint.x;
            y = marker.schemePoint.y;
        } else {
            x = INITIAL_POSITION_X;
            y = INITIAL_POSITION_Y;
        }
        return (
            <Group
                x={x}
                y={y}
                pointId={pointId}
                rawCoords={{
                    x,
                    y,
                }}
                schemePoint={{
                    x,
                    y,
                }}
                draggable
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
                onDragEnd={onDragEnd}
                key={String(pointId)}
                id="markerGroup">
                <KImage
                    x={0}
                    y={0}
                    width={MARKER_WIDTH}
                    height={MARKER_HEIGHT}
                    offsetX={MARKER_WIDTH / 2}
                    offsetY={MARKER_HEIGHT / 2}
                    image={img} />
                <Text
                    offsetX={setOffsetX(pointId)}
                    offsetY={-MARKER_HEIGHT / 2}
                    fontSize={16}
                    fontStyle="bold"
                    fill="#2694FF"
                    text={i + 1} />
            </Group>
        );
    });
};

MarkersGroup.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
    })),
    stage: PropTypes.any,
};

export default memo(MarkersGroup);
