import React, {
    Fragment, memo, useCallback, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import get from "lodash/get";
import { ERROR } from "../../constants";
import FileItem from "./StatusBodies/Failed/FileItem";

const SetBody = (props) => {
    const {
        set,
        setConfirmUploaded,
        setConfirmDelete,
    } = props;
    const error = get(set, "lastError", ERROR.UNKNOWN);

    return (
        <div className="set-body__wrapper">
            {error && (
                <div className="set-error">
                    <i className="fa fa-exclamation-triangle text-danger" />
                    <span className="error-message">
                        {error}
                    </span>
                </div>
            )}
            <div className="files__info">
                <span>Файлы:</span>
                {set.files.map((file, i) => (
                    <FileItem
                        key={String(i)}
                        file={file}>
                        <Fragment>
                            <Button
                                onClick={() => setConfirmUploaded(set.id)}
                                outline
                                color="info"
                                className="btn-sm"
                                title="Отметить как загруженный и отправить на конвертацию">
                                <i className="fa fa-flag-checkered" />
                            </Button>
                            <Button
                                onClick={() => setConfirmDelete(set.id)}
                                outline
                                color="danger"
                                className="btn-sm ml-2"
                                title="Удалить сет">
                                <i className="fa fa-trash" />
                            </Button>
                        </Fragment>
                    </FileItem>
                ))}
            </div>
            <pre>
                {JSON.stringify(set, null, 4)}
            </pre>
        </div>
    );
};

SetBody.propTypes = {
    set: PropTypes.shape({
        id: PropTypes.number,
        files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    setConfirmUploaded: PropTypes.func.isRequired,
    setConfirmDelete: PropTypes.func.isRequired,
};

export default memo(SetBody);
