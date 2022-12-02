import React, { memo, useState, useMemo } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import memoize from "lodash/memoize";
import ErrorMessage from "./ErrorMessage";
import { contentTypesTranslate } from "../../../common/helpers";

const uploadTypes = memoize((item) => {
    if (item?.isRegister) {
        return "Регистрация сета";
    }
    if (item?.payload?.oldUpload) {
        return "Догрузка файла";
    }
    return "Загрузка файла";
});

const LogItem = (props) => {
    const {
        item,
    } = props;
    const [open, setOpen] = useState(false);
    const timestamp = useMemo(() => moment(item?.time), [item?.time]);
    const contentType = get(item?.payload, "contentType");
    const projectId = get(item?.payload, "projectId", false);
    const lineId = get(item?.payload, "lineId", false);
    const fileName = get(item?.payload, "fileName", false);
    const error = get(item, "error", null);

    return (
        <div className="log-item__wrapper">
            <div className={`log-item__header ${open ? "opened" : ""}`}>
                <button
                    type="button"
                    className="btn_like_div header__button"
                    onClick={() => setOpen(!open)}>
                    {`${uploadTypes(item)} (${timestamp.format("HH:mm:ss")})`}
                    <div className="right-col">
                        <span>
                            {error ? (
                                <i className="fa fa-warning text-danger" />
                            ) : (
                                <i className="fa fa-check text-success" />
                            )}
                        </span>
                        <i className={`fa ${open ? "fa-caret-up" : "fa-caret-down"}`} />
                    </div>
                </button>
            </div>
            {open && (
                <div className="log-item__body">
                    <div className="table-info">
                        <div className="info date">
                            <span className="title">
                                Дата загрузки
                            </span>
                            <span className="value">
                                {timestamp.format("DD-MM-YYYY")}
                            </span>
                        </div>
                        <div className="info content-type">
                            <span className="title">
                                Тип файла
                            </span>
                            <span className="value">
                                {contentTypesTranslate[contentType]}
                            </span>
                        </div>
                        {projectId && (
                            <div className="info project">
                                <span className="title">
                                    Объект (ID)
                                </span>
                                <span className="value">
                                    {projectId}
                                </span>
                            </div>
                        )}
                        {lineId && (
                            <div className="info line">
                                <span className="title">
                                    Отрезок (ID)
                                </span>
                                <span className="value">
                                    {lineId}
                                </span>
                            </div>
                        )}
                        {fileName && (
                            <div className="info fie-name">
                                <span className="title">
                                    Файл
                                </span>
                                <span className="value">
                                    {fileName}
                                </span>
                            </div>
                        )}
                    </div>
                    <ErrorMessage error={error} />
                </div>
            )}
        </div>
    );
};

LogItem.propTypes = {
    item: PropTypes.shape({
        isRegister: PropTypes.bool,
        payload: PropTypes.shape({}),
        error: PropTypes.shape({}),
        time: PropTypes.number,
    }),
};

export default memo(LogItem);
