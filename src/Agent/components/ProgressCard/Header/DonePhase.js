import React, {
    memo, Fragment, useEffect,
} from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { resetState } from "../../../store/actionsCreator/appActions";
import { retryUpload } from "../../../store/actionsCreator/uploadActions";

const UploadingPhase = ({
    closeHandler,
    failUploads,
    retryHandler,
    networkError,
}) => {
    useEffect(() => {
        document.title = "Сфера | Загрузка завершена";
    }, []);

    return (
        <Fragment>
            {failUploads > 0 && !networkError ? (
                <button
                    onClick={retryHandler}
                    title="Повторить загрузку не загруженных файлов"
                    className="btn_like_div retry-upload__button"
                    type="button">
                    <i className="fa fa-refresh" />
                </button>
            ) : (
                <span className="end-title">
                    Загрузка завершена
                </span>
            )}
            <button
                onClick={closeHandler}
                title={networkError ? "Обновить страницу" : "Закрыть"}
                className="btn_like_div start-upload__button"
                type="button">
                {networkError ? "Обновить страницу" : "Закрыть"}
                <i className="fa fa-times" />
            </button>
        </Fragment>
    );
};

UploadingPhase.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    failUploads: PropTypes.number.isRequired,
    retryHandler: PropTypes.func.isRequired,
    networkError: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    failUploads: store.upload.failureFiles.length,
    networkError: store.upload.networkError,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    closeHandler: resetState,
    retryHandler: retryUpload,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(UploadingPhase));
