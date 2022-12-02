import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Group, Text, Image as KImage } from "react-konva";
import memoize from "lodash/memoize";
import dotIcon from "../../../../../../../assets/mapIcon/schemeDefaultMarker.svg";

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

const MarkersGroup = (props) => {
    const {
        markers,
        stage,
        setConfirm,
    } = props;
    const [img, setImg] = useState(null);
    const [load, setLoad] = useState(true);

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
        const rawCoords = { ...target.attrs.rawCoords };
        const { pointId } = target.attrs;
        const newPosition = target.getAbsolutePosition(target.parent);
        target.attrs = {
            ...target.attrs,
            schemePoint: { ...newPosition },
            pointId,
            rawCoords,
            draggable: true,
        };
    }, [stage]);

    const onMouseOver = useCallback(() => {
        document.body.style.cursor = "pointer";
    }, []);

    const onMouseLeave = useCallback(() => {
        document.body.style.cursor = "default";
    }, []);

    if (!stage || load) {
        return null;
    }

    return markers.map((marker, i) => {
        if (!marker.schemePoint) {
            return null;
        }
        const {
            x,
            y,
        } = marker.schemePoint;
        return (
            <Group
                x={x}
                y={y}
                pointId={marker.pointId}
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
                onDblClick={(e) => setConfirm({
                    index: i,
                    groupId: "#defaultGroup",
                })}
                onDragEnd={onDragEnd}
                key={String(i)}
                id="defaultGroup">
                <KImage
                    x={0}
                    y={0}
                    width={MARKER_WIDTH}
                    height={MARKER_HEIGHT}
                    offsetX={MARKER_WIDTH / 2}
                    offsetY={MARKER_HEIGHT / 2}
                    image={img} />
                <Text
                    offsetX={setOffsetX(marker.pointId)}
                    offsetY={MARKER_HEIGHT - 5}
                    fontSize={14}
                    fontStyle="bold"
                    fill="#FF00FF"
                    text={marker.pointId} />
            </Group>
        );
    });
};

MarkersGroup.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number,
    })),
    stage: PropTypes.any,
    setConfirm: PropTypes.func.isRequired,
};

export default memo(MarkersGroup);
