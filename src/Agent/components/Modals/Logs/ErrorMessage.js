import React, { memo } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";

const ErrorMessage = (props) => {
    const { error } = props;
    const statusCode = get(error, "status");
    const statusText = get(error, "statusText");
    const request = get(error, "request", JSON.stringify({
        body: {},
        url: "unknown",
    }));
    const {
        url,
        body,
    } = JSON.parse(request);

    if (!error) {
        return null;
    }

    return (
        <div className="error-message__wrapper">
            <div className="info error-status">
                <span className="title">
                    Код ошибки
                </span>
                <span className="value">
                    {statusCode}
                </span>
            </div>
            <div className="info error-message">
                <span className="title">
                    Ошибка
                </span>
                <span className="value">
                    {statusText}
                </span>
            </div>
            <div className="info error-request-body">
                <span className="title">
                    URL
                </span>
                <span className="value">
                    {url}
                </span>
            </div>
            <div className="info error-request-body">
                <span className="title">
                    Body
                </span>
                <pre className="value mb-0">
                    {JSON.stringify(body, null, 2)}
                </pre>
            </div>
        </div>
    );
};

ErrorMessage.propTypes = {
    error: PropTypes.shape({}),
};

export default memo(ErrorMessage);
