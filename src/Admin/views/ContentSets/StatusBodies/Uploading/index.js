import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import { formatTitle } from "../../../../../Agent/common/helpers";
import { fileStatusTypes } from "../../helpers";

const UploadingStatus = (props) => {
    const {
        setConfirmUploaded,
        setConfirmDelete,
        set,
    } = props;

    return (
        <div className="set-body__wrapper">
            <div className="files__info">
                <span>Файлы:</span>
                {set.files.map((file, i) => (
                    <div
                        key={String(i)}
                        className="file">
                        <div className="body">
                            <span className="title value">
                                {formatTitle(file.name)}
                            </span>
                            &nbsp;
                            -
                            &nbsp;
                            <span className="status value">
                                {fileStatusTypes[file.status]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="set-footer">
                <Button
                    onClick={() => setConfirmUploaded(set.id)}
                    outline
                    color="info"
                    title="Отметить как загруженный и отправить на конвертацию">
                    Отметить как загруженный
                </Button>
                <Button
                    onClick={() => setConfirmDelete(set.id)}
                    outline
                    color="danger"
                    className="ml-2"
                    title="Удалить сет">
                    Удалить сет
                </Button>
            </div>
        </div>
    );
};

UploadingStatus.propTypes = {
    set: PropTypes.shape({
        id: PropTypes.number,
        files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    setConfirmUploaded: PropTypes.func.isRequired,
    setConfirmDelete: PropTypes.func.isRequired,
};

export default memo(UploadingStatus);
