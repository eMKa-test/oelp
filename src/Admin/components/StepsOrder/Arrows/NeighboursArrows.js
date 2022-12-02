import React, { memo } from "react";
import * as PropTypes from "prop-types";
import Polyline from "react-leaflet-arrowheads";

const arrowStyle = {
    size: "20px",
    yawn: 50,
    fill: true,
};

const NeighboursArrows = (props) => {
    const { marker, neighbours } = props;

    if (!marker || !neighbours.length) {
        return null;
    }

    return neighbours.map((item, i) => {
        const positions = [marker.position, item.position];
        return (
            <Polyline
                key={String(i)}
                className="neighbour-arrow-polyline"
                arrowheads={arrowStyle}
                smoothFactor="1.3"
                positions={positions} />
        );
    });
};

NeighboursArrows.propTypes = {
    neighbours: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
    })),
    marker: PropTypes.shape({
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
    }),
};

export default memo(NeighboursArrows);
