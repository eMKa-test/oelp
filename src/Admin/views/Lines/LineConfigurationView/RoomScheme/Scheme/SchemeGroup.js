import React, {
    memo, useEffect, useRef, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Group, Image as KImage } from "react-konva";

const SchemeGroup = (props) => {
    const {
        width,
        height,
        schemeImage,
        setLoad,
    } = props;
    const [img, setImage] = useState(null);
    const schemeGroup = useRef();
    const imageRef = useRef();

    useEffect(() => {
        setLoad(true);
        if (schemeImage?.src) {
            const image = new Image();
            image.onload = () => {
                setImage(image);
                setLoad(false);
            };
            image.src = schemeImage.src;
        }
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
    setLoad: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    schemeImage: PropTypes.shape({
        src: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
};

export default memo(SchemeGroup);
