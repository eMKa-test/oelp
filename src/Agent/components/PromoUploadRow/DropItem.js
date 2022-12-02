import React, { memo, useState, useCallback } from "react";
import * as PropTypes from "prop-types";
import DropZone from "../DropZone";

const DropItem = (props) => {
    const {
        name,
        accept,
        type,
    } = props;
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((files) => {
        setFiles([...files]);
    }, []);

    const onRemove = useCallback(() => {

    }, []);

    return (
        <DropZone
            accept={accept}
            contentLen={files.length}
            files={files}
            title={name}
            onRemove={onRemove}
            onDrop={onDrop} />
    );
};

DropItem.propTypes = {
    name: PropTypes.string.isRequired,
    accept: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default memo(DropItem);
