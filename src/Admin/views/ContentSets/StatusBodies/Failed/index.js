import React, { memo } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { Button } from "reactstrap";
import { ERROR } from "../../../../constants";
import FileItem from "./FileItem";

const FailedStatus = (props) => {
    const {
        setConfirmUploaded,
        setConfirmDelete,
        set,
    } = props;
    const error = get(set, "lastError", ERROR.UNKNOWN);

    return (
        <div className="set-body__wrapper">
            {error && (
                <div className="set-error">
                    <div>
                        Ошибка загрузки сета:
                        &nbsp;
                        <span className="error-message">
                            {error}
                        </span>
                    </div>
                    <i className="fa fa-exclamation-triangle text-danger" />
                </div>
            )}
            <div className="files__info">
                <span>Файлы:</span>
                {set.files.map((file, i) => (
                    <FileItem
                        key={String(i)}
                        file={{ ...file }} />
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

FailedStatus.propTypes = {
    set: PropTypes.shape({
        id: PropTypes.number,
        files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    setConfirmUploaded: PropTypes.func.isRequired,
    setConfirmDelete: PropTypes.func.isRequired,
};

export default memo(FailedStatus);
