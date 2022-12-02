import React, {
    memo, useEffect, useRef, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Group, Image as KImage } from "react-konva";
import stub from "../../../../../../../assets/sphere_logo_2.png";

const SchemeGroup = (props) => {
    const {
        width,
        height,
        schemeImage,
        setSchemeLoad,
    } = props;
    const [img, setImage] = useState(null);
    const schemeGroup = useRef();
    const imageRef = useRef();
    useEffect(() => {
        let src;
        setSchemeLoad(true);
        if (schemeImage?.src) {
            src = schemeImage.src;
        } else {
            src = stub;
        }
        const image = new Image();
        image.onload = () => {
            setImage(image);
            setSchemeLoad(false);
        };
        image.src = src;
    }, [schemeImage?.src]);

    useEffect(() => {
        if (img) {
            imageRef.current.cache();
        }
    }, [img]);

    return (
        <Group
            ref={schemeGroup}
            id="schemeGroup">
            <KImage
                ref={imageRef}
                x={0}
                y={0}
                width={width}
                height={height}
                image={img} />
        </Group>
    );
};

SchemeGroup.propTypes = {
    setSchemeLoad: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    schemeImage: PropTypes.shape({
        src: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
};

export default memo(SchemeGroup);
