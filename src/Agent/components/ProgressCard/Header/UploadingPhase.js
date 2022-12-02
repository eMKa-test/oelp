import React, { memo, useEffect } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { declinationWord } from "../../../common/helpers";

const style = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "8px",
};

const titles = [
    "файл",
    "файла",
    "файлов",
];

const UploadingPhase = ({
    progress,
    allUploadFilesCount,
    uploadedFilesCount,
}) => {
    useEffect(() => {
        document.title = `Сфера | Загружено ${progress}%`;
    }, [progress]);

    return (
        <div style={style}>
            <div
                className="status-progress"
                style={{ width: `${progress}%` }} />
            <span>
                Загружено
                &nbsp;
                {uploadedFilesCount}
                {" "}
                из
                {" "}
                {declinationWord(allUploadFilesCount, titles)}
            </span>
        </div>
    );
};

UploadingPhase.propTypes = {
    progress: PropTypes.number.isRequired,
    uploadedFilesCount: PropTypes.number.isRequired,
    allUploadFilesCount: PropTypes.number.isRequired,
};

const mapStateToProps = (store) => ({
    progress: store.upload.globalProgress,
    uploadedFilesCount: store.upload.successFiles.length,
    allUploadFilesCount: store.upload.allUploadFilesCount,
});

export default connect(mapStateToProps, null)(memo(UploadingPhase));
