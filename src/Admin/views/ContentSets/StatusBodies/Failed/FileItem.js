import React, {
    memo, useCallback, Fragment, useState,
} from "react";
import * as PropTypes from "prop-types";
import memoize from "lodash/memoize";
import { toast } from "react-toastify";
import axios from "axios";
import Dropzone from "react-dropzone";
import { formatBytes, formatTitle } from "../../../../../Agent/common/helpers";
import { TOAST_MESSAGE } from "../../../../constants";

const getMimeType = memoize((name) => {
    const value = name.toLowerCase();
    if (value.includes(".srt")) {
        return "text/str";
    }
    if (value.includes(".jp")) {
        return "image/jpeg";
    }
    return "video/mp4";
});

const FileItem = (props) => {
    let {
        file,
    } = props;
    const [dropped, setDropped] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isFailure, setFailure] = useState("");
    const [uploaded, setUploaded] = useState(false);
    const [load, setLoad] = useState(false);
    const isFailed = file.status === "FAILED";

    const getFile = useCallback(() => {
        if (!isFailed) {
            return null;
        }
        return axios.get(
            `/admin/api/contentSets/getFile/${file.id}`,
            {
                responseType: "blob",
            },
        )
            .then((res) => {
                if (res.status === 200) {
                    const blob = new Blob([res.data], { type: getMimeType(file.name) });
                    const link = document.createElement("a");
                    link.download = file.name;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    link.remove();
                }
            })
            .catch((err) => {
                toast.error(TOAST_MESSAGE.ERROR_UNKNOWN, { autoClose: 4000 });
                console.error(err);
            });
    }, [file, isFailed]);

    const onDrop = useCallback((files) => {
        if (files.length > 1) {
            return toast.error("Ожидается один файл для загрузки", { autoClose: 4000 });
        }
        const [_file] = files;
        setDropped(_file);
    }, []);

    const onUploadProgress = useCallback(({
        total,
        loaded,
    }) => {
        const loadedProgress = (loaded * 100) / total;
        setProgress(Math.round(loadedProgress));
    }, []);

    const onUpload = useCallback(() => {
        setLoad(true);
        setProgress(0);
        setFailure("");
        const url = "/admin/api/contentSets/uploadFile";
        const body = new FormData();
        body.append("fileId", file.id);
        body.append("file", dropped);
        axios.post(url, body, { onUploadProgress })
            .then((res) => {
                if (res.data.success) {
                    file = { ...res.data.payload };
                    setUploaded(true);
                } else if (res.data.includes("DOCTYPE")) {
                    setFailure("Файл не может быть загружен. Возможно параметры файла не соответствуют требованиям сета.");
                }
            })
            .catch((err) => {
                const message = err?.response?.data?.error
                    || err?.response.statusText
                    || err?.response?.message
                    || "Не известная ошибка";
                setFailure(message);
                console.error(err);
            })
            .finally(() => setLoad(false));
    }, [dropped, file]);

    return (
        <div
            className="file">
            <div className="body">
                <i className={`fa file-status ${isFailed ? " fa-times text-danger" : "fa-check text-success"}`} />
                <span className="title value">
                    <button
                        title={isFailed ? "Скачать файл" : ""}
                        className={`btn_like_div ${isFailed ? "download" : ""}`}
                        style={{ cursor: !isFailed ? "default" : "pointer" }}
                        onClick={getFile}
                        type="button">
                        {formatTitle(file.name)}
                    </button>
                </span>
                &nbsp;
                {file.size && (
                    <span className="size value">
                        {formatBytes(file.size)}
                    </span>
                )}
                {isFailed && (
                    <Fragment>
                        <Dropzone
                            disabled={false}
                            title="Зона загрузки файлов"
                            className={`dropzone ${dropped ? "dropzone__accept" : ""}`}
                            activeClassName="dropzone__active"
                            rejectClassName="dropzone__reject"
                            accept={getMimeType(file.name)}
                            onDrop={onDrop}>
                            <span className="dropped-status">
                                {load ? (
                                    `${progress} %`
                                ) : (
                                    dropped ? "готов к загрузке" : "добавить файл"
                                )}
                            </span>
                        </Dropzone>
                        {((dropped && !uploaded) || isFailure) && (
                            <button
                                title="Загрузить"
                                className="btn_like_div upload__button"
                                onClick={onUpload}
                                type="button">
                                <i className={`fa ${isFailure ? "fa-refresh" : "fa-play"}`} />
                            </button>
                        )}
                    </Fragment>
                )}
                {isFailure && (
                    <div
                        title={isFailure}
                        className="upload__error-message">
                        <i className="fa fa-exclamation-triangle text-danger" />
                        &nbsp;
                        <span className="title">{isFailure}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

FileItem.propTypes = {
    file: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        status: PropTypes.string,
        size: PropTypes.number,
    }),
};

export default memo(FileItem);
