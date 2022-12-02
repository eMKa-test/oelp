import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import {
    formatBytes, formatTitle, getContentAccept, renameFile,
} from "../../../../common/helpers";

const CardBody = (props) => {
    const {
        set,
        file,
        addFiles,
        files,
        removeFile,
    } = props;
    const [uploadReady, setUploadReady] = useState(false);

    useEffect(() => {
        const match = files.find((f) => f?.fileId === file.id);
        setUploadReady(Boolean(match));
    }, [files, file]);

    const fileProps = {
        ...file,
        contentType: set.contentType,
    };

    const onDrop = useCallback(({
        name,
        id: fileId,
    }) => (fls) => {
        if (fls.length > 1) {
            return null;
        }
        const [_file] = fls;
        const params = { ...set };
        delete params.files;
        addFiles({
            ...params,
            fileName: file.name,
            fileId,
            file: renameFile(_file, name.toLowerCase()),
            isRegistered: true,
            progress: 0,
        });
        return setUploadReady(file);
    }, [files]);

    return (
        <div className="set-item__dropzone">
            <Dropzone
                disabled={file.done || Boolean(uploadReady)}
                title={file.done ? "Файл загружен" : file.name}
                className={`dropzone ${uploadReady ? "file-dropped" : ""}`}
                activeClassName="dropzone__active"
                acceptClassName="dropzone__accept"
                rejectClassName="dropzone__reject"
                accept={getContentAccept(set.contentType)}
                onDrop={onDrop(file)}>
                {uploadReady && (
                    <Button
                        title="Удалить файл"
                        className="modal-confirm__remove-file"
                        onClick={() => removeFile(fileProps)}>
                        <i className="fa fa-times" />
                    </Button>
                )}
                <i className="fa fa-download fa-2x" />
                <p className="title">{formatTitle(file.name, 40)}</p>
                {file.size && (
                    <span className="file-size">
                        {formatBytes(file.size)}
                    </span>
                )}
                {file.done && (
                    <i className="file__done fa fa-check" />
                )}
            </Dropzone>
        </div>
    );
};

CardBody.propTypes = {
    set: PropTypes.shape({
        date: PropTypes.string,
        lineId: PropTypes.number,
        projectId: PropTypes.number,
        contentType: PropTypes.string,
    }),
    file: PropTypes.shape({
        name: PropTypes.string,
        size: PropTypes.number,
        done: PropTypes.bool,
    }),
    addFiles: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
};

export default memo(CardBody);
