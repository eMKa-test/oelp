import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Polyline } from "react-leaflet";
import { connect } from "react-redux";

const PolyLines = (props) => {
    const { bounds } = props;

    if (!bounds) {
        return null;
    }

    return (
        <Polyline
            smoothFactor="1.3"
            weight="3"
            color="red"
            positions={bounds} />
    );
};

PolyLines.propTypes = {
    bounds: PropTypes.array,
};

const mapStateToProps = (store) => ({
    bounds: store.map.bounds,
});

export default connect(mapStateToProps, null)(memo(PolyLines));
