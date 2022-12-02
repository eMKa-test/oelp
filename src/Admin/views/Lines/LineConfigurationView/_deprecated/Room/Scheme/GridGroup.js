import React, {memo} from "react";
import * as PropTypes from "prop-types";
import {Circle, Group, Line} from "react-konva";

const space = 9;
const gridColor = "#929dd2";
const centerColor = "#3766dc";

const GridGroup = (props) => {
    const { width, height } = props;
    const wCol = Math.ceil(width / space);
    const hCol = Math.ceil(height / space);
    const halfW = width / 2;
    const halfH = height / 2;

    return (
        <Group id="gridGroup">
            {[...Array(wCol)].map((er, i) => (
                <Line
                    key={String(i)}
                    strokeWidth={0.5}
                    stroke={gridColor}
                    points={[i * space, 0, i * space, height]} />
            ))}
            {[...Array(hCol)].map((er, i) => (
                <Line
                    key={String(i + 1000)}
                    strokeWidth={0.5}
                    stroke={gridColor}
                    points={[0, i * space, width, i * space]} />
            ))}
            <Line
                strokeWidth={1}
                stroke={centerColor}
                points={[halfW, 0, halfW, height]} />
            <Line
                strokeWidth={1}
                stroke={centerColor}
                points={[0, halfH, width, halfH]} />
            <Circle
                strokeWidth={1}
                x={halfH}
                y={halfH}
                fill={centerColor}
                radius={2} />
            <Circle
                strokeWidth={1}
                x={halfW}
                y={halfH}
                stroke={centerColor}
                radius={8} />
        </Group>
    );
};

GridGroup.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
};

export default memo(GridGroup);
