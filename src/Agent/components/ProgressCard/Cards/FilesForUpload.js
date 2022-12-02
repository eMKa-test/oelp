import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import CardItem from "./CardItem";

const FilesForUpload = (props) => {
    const { uploadFiles } = props;

    return (
        <div className="FilesForUpload__wrapper">
            {uploadFiles.map((file, i) => (
                <CardItem
                    key={String(i)}
                    file={file} />
            ))}
        </div>
    );
};

FilesForUpload.propTypes = {
    uploadFiles: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (store) => ({
    uploadFiles: store.upload.uploadFiles,
});

export default connect(mapStateToProps)(memo(FilesForUpload));
