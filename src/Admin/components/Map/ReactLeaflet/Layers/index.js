import React, { memo } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { connect } from "react-redux";
import { ImageOverlay, LayerGroup, LayersControl } from "react-leaflet";

function Layers(props) {
    const { line } = props;
    const imageSrc = get(line, "mapLayerImage.src", null);
    const imageBounds = get(line, "mapLayerGPS.bounds", null);
    const schemeSrc = get(line, "mapSchemeImage.src", null);
    const schemeBounds = get(line, "mapSchemeGPS.bounds", null);

    if ((!imageSrc || !imageBounds) && (!schemeSrc || !schemeBounds)) {
        return null;
    }

    return (
        <LayersControl
            collapsed={false}
            position="topleft">
            {imageSrc && imageBounds && (
                <LayersControl.Overlay
                    name="Фото отрезка">
                    <LayerGroup>
                        <ImageOverlay
                            url={imageSrc}
                            bounds={imageBounds} />
                    </LayerGroup>
                </LayersControl.Overlay>
            )}
            {schemeSrc && schemeBounds && (
                <LayersControl.Overlay
                    name="Схема отрезка">
                    <LayerGroup>
                        <ImageOverlay
                            url={schemeSrc}
                            bounds={schemeBounds} />
                    </LayerGroup>
                </LayersControl.Overlay>
            )}
        </LayersControl>
    );
}

Layers.propTypes = {
    line: PropTypes.shape({
        mapLayerImage: PropTypes.shape({
            src: PropTypes.string,
        }),
        mapLayerGPS: PropTypes.shape({
            bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        }),
        mapLayerScheme: PropTypes.shape({
            src: PropTypes.string,
        }),
        mapLayerSchemeGPS: PropTypes.shape({
            bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        }),
    }),
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
});

export default connect(mapStateToProps)(memo(Layers));
