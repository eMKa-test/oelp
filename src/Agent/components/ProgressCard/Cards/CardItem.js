import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { getIcon, formatBytes, formatTitle } from "../../../common/helpers";

const CardItem = (props) => {
    const {
        file,
        progress,
    } = props;

    return (
        <div className="card-item">
            <div className="card-item__row">
                <div className="file-icon">
                    <img
                        src={getIcon(file.file.type)}
                        alt="icon-type" />
                    <div className={`uploaded-icon canceled ${file?.isFail ? "show" : ""} `}>
                        <i className="fa fa-ban" />
                    </div>
                </div>
                <div className="card-item__info">
                    <div className={`card-item__title ${file?.isFail ? "error-color" : ""}`}>
                        {formatTitle(file.file.name)}
                    </div>
                    <div className="card-item__size">
                        {formatBytes(file.file.size)}
                    </div>
                </div>
                <div className="status-upload__col">
                    {progress > 0 && (
                        <div className="card-item__progress">
                            <div
                                className="progress-status"
                                style={{ width: `${progress}%` }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

CardItem.propTypes = {
    file: PropTypes.shape({
        fileId: PropTypes.number.isRequired,
        isFail: PropTypes.bool,
        file: PropTypes.instanceOf(File),
    }),
    progress: PropTypes.number,
};

export default memo(CardItem);
