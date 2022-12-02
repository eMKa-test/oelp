import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Group, Line } from "react-konva";

const space = 9;
const gridColor = "#929dd2";

const GridGroup = (props) => {
    const {
        width,
        height,
    } = props;
    const wCol = Math.ceil(width / space);
    const hCol = Math.ceil(height / space);

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
        </Group>
    );
};

GridGroup.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
};

export default memo(GridGroup);
