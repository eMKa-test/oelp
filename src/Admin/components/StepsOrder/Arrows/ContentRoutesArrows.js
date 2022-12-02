import React, { memo } from "react";
import * as PropTypes from "prop-types";
import Polyline from "react-leaflet-arrowheads";

const arrowStyle = {
    size: "20px",
    yawn: 50,
};

const ContentRoutesArrows = (props) => {
    const { contentBounds } = props;

    if (contentBounds.length) {
        return contentBounds.map((item, i) => {
            if (item.arrowPosition) {
                return (
                    <Polyline
                        key={String(i)}
                        className="content-route-arrow-polyline"
                        arrowheads={arrowStyle}
                        smoothFactor={5}
                        positions={item.arrowPosition} />
                );
            }
        });
    }

    return null;
};

ContentRoutesArrows.propTypes = {
    contentBounds: PropTypes.arrayOf(PropTypes.shape({
        contents: PropTypes.arrayOf(PropTypes.number),
        deadEnd: PropTypes.bool,
        pointId: PropTypes.number,
    })),
};

export default memo(ContentRoutesArrows);
