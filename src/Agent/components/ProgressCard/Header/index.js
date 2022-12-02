import React, { memo, useEffect, useMemo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { UPLOAD_PHASES_COMPONENT } from "./helpers";
import { UPLOAD_PHASES } from "../../../store/actionsCreator/uploadActions";

const Header = (props) => {
    const {
        showSlide,
        toggleSlide,
        uploadPhase,
        uploadFilesLen,
    } = props;

    const PhaseComponent = useMemo(() => {
        return UPLOAD_PHASES_COMPONENT[uploadPhase];
    }, [uploadPhase]);

    useEffect(() => {
        if (uploadPhase === UPLOAD_PHASES.UPLOADING || (uploadPhase === UPLOAD_PHASES.DONE && uploadFilesLen)) {
            toggleSlide(true);
        } else {
            toggleSlide(false);
        }
    }, [uploadPhase, uploadFilesLen]);

    return (
        <div className="header">
            <PhaseComponent />
            {uploadPhase === UPLOAD_PHASES.UPLOADING && (
                <div className="top-control">
                    <button
                        title="Скрыть"
                        className={`btn_like_div toggle-slide__button ${showSlide ? "show" : ""}`}
                        onClick={() => toggleSlide(!showSlide)}
                        type="button">
                        <i className="fa fa-caret-down" />
                    </button>
                </div>
            )}
        </div>
    );
};

Header.propTypes = {
    toggleSlide: PropTypes.func.isRequired,
    showSlide: PropTypes.bool.isRequired,
    uploadPhase: PropTypes.string.isRequired,
    uploadFilesLen: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    loading: store.upload.load,
    uploadPhase: store.upload.uploadPhase,
    networkError: store.upload.networkError,
    uploadFilesLen: store.upload.uploadFiles.length > 0,
});

export default connect(mapStateToProps)(memo(Header));
