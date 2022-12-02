import React, { memo, useRef, useEffect } from "react";
import * as PropTypes from "prop-types";
import M from "marzipano";

const limiter = M.RectilinearView.limit.traditional(
    1024 * 3,
    100 * Math.PI / 180,
);
const initialView = {
    yaw: 0,
    pitch: 0,
    fov: 100 * Math.PI / 180,
};

const geometry = new M.EquirectGeometry([{ width: "512px" }]);
const view = new M.RectilinearView(initialView, limiter);

const PanoramaPreview = (props) => {
    const { image } = props;
    const pan = useRef(null);
    let viewer = useRef(null);

    useEffect(() => {
        if (pan.current) {
            viewer = new M.Viewer(pan.current);
            const source = M.ImageUrlSource.fromString(image);
            viewer.createScene({
                geometry,
                view,
                pinFirstLevel: true,
                source,
            }).switchTo({
                transitionDuration: 150,
            });
        }
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, [image]);

    return (
        <div className="panorama-preview__wrapper">
            <div className="panorama-preview__loader">
                <span className="loader" />
            </div>
            <div
                ref={pan}
                className="panorama-preview" />
        </div>
    );
};

PanoramaPreview.propTypes = {
    image: PropTypes.string,
};

export default memo(PanoramaPreview);
