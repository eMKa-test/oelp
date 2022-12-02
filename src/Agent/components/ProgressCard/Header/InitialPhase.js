import React, { memo, useEffect, Fragment } from "react";
import * as PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { startUpload } from "../../../store/actionsCreator/uploadActions";
import { declinationWord } from "../../../common/helpers";

const getFilesCount = (sets, oldFilesCount) => {
    let setsFiles = oldFilesCount;
    // eslint-disable-next-line no-restricted-syntax
    for (const { files } of Object.values(sets)) {
        setsFiles += files.length;
    }
    return setsFiles;
};

const titles = [
    "файл",
    "файла",
    "файлов",
];

const InitialPhase = (props) => {
    const {
        canUpload,
        startUploadProcess,
        allFilesCount,
    } = props;

    useEffect(() => {
        document.title = "Сфера | Агентская форма";
    }, []);

    return (
        <Fragment>
            <button
                disabled={!canUpload}
                onClick={startUploadProcess}
                title="Начать загрузку"
                className="btn_like_div start-upload__button"
                type="button">
                Начать загрузку
                <i className="fa fa-play" />
            </button>
            {allFilesCount > 0 && (
                <span className="all-files__count">
                    {declinationWord(allFilesCount, titles)}
                </span>
            )}
        </Fragment>
    );
};

InitialPhase.propTypes = {
    startUploadProcess: PropTypes.func.isRequired,
    canUpload: PropTypes.bool.isRequired,
    allFilesCount: PropTypes.number.isRequired,
};

const mapStateToProps = (store) => ({
    canUpload: !isEmpty(store.upload.oldFiles) || !isEmpty(store.upload.sets),
    allFilesCount: getFilesCount(store.upload.sets, store.upload.oldFiles.length),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    startUploadProcess: startUpload,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(InitialPhase));
