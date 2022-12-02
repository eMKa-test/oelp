import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";

const StatusUpload = (props) => {
    const {
        progress,
        isCancelled,
        isFailure,
        cancelRequests,
        isUploaded,
        retryUpload,
        isReChunk,
    } = props;

    const onCancelRequests = useCallback(() => {
        cancelRequests.forEach((cnFn) => cnFn());
    }, [cancelRequests]);

    return (
        <div className="status-upload__col">
            {progress < 100 && !isFailure && !isUploaded && !isCancelled ? (
                <div className="card-item__progress">
                    <div
                        className="progress-status"
                        style={{ width: `${progress}%` }} />
                </div>
            ) : null}
            {isCancelled && (
                <span className="cancelled-title">отменено</span>
            )}
            {isReChunk && isFailure && (
                <span className="cancelled-title">
                    Повторная попытка загрузки
                </span>
            )}
            {progress < 100 && progress > 0 && !isFailure && !isReChunk && (
                <div className="card-item__cancel">
                    {!isCancelled && (
                        <button
                            title="Отменить загрузку"
                            onClick={onCancelRequests}
                            className="btn_like_div cancel-upload__button"
                            type="button">
                            <i className="fa fa-times" />
                        </button>
                    )}
                </div>
            )}
            {isFailure && !isReChunk && (
                <div className="card-item__upload-status">
                    <button
                        title="Повторить загрузку"
                        onClick={retryUpload}
                        className="btn_like_div retry-upload__button"
                        type="button">
                        <i className="fa fa-refresh" />
                    </button>
                </div>
            )}
        </div>
    );
};

StatusUpload.propTypes = {
    isReChunk: PropTypes.bool,
    progress: PropTypes.number.isRequired,
    isCancelled: PropTypes.bool.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    isFailure: PropTypes.any,
    cancelRequests: PropTypes.arrayOf(PropTypes.func),
    retryUpload: PropTypes.func.isRequired,
};

export default memo(StatusUpload);
