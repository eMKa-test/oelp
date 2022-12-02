import React, { memo } from "react";
import * as PropTypes from "prop-types";
import Polyline from "react-leaflet-arrowheads";

const arrowStyle = {
    size: "15px",
    yawn: 60,
};

const BaseArrows = (props) => {
    const { baseBounds, showBase } = props;

    if (baseBounds.length && showBase) {
        return (
            <Polyline
                dashArray={4}
                className="arrow-polyline"
                arrowheads={arrowStyle}
                smoothFactor={1}
                positions={baseBounds} />
        );
    }

    return null;
};

BaseArrows.propTypes = {
    baseBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    showBase: PropTypes.bool.isRequired,
};

export default memo(BaseArrows);
