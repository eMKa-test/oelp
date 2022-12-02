import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import CardItem from "./CardItem";

const UploadingFile = (props) => {
    const { file } = props;

    if (isEmpty(file)) {
        return null;
    }

    const { progress } = props;

    return (
        <div className="uploading-file__wrapper">
            <CardItem
                progress={progress}
                file={file} />
        </div>
    );
};

UploadingFile.propTypes = {
    progress: PropTypes.number.isRequired,
    file: PropTypes.shape({}),
};

const mapStateToProps = (store) => ({
    progress: store.upload.progress,
    file: store.upload.uploadingFile,
});

export default connect(mapStateToProps)(memo(UploadingFile));
