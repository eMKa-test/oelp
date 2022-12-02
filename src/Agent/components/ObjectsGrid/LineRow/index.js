import React, { memo, Fragment } from "react";
import * as PropTypes from "prop-types";
import { contentTypes } from "../../../common/helpers";
import UploadCard from "../../UploadCard";
import "./style.css";

const LineRow = ({ line }) => (
    <Fragment>
        <div className="line-row__header">
            <span className="title">
                {line.name}
            </span>
        </div>
        <div className="uploads">
            {contentTypes.map((contentType, i) => {
                return (
                    <UploadCard
                        line={line}
                        key={String(i)}
                        contentType={contentType} />
                );
            })}
        </div>
    </Fragment>
);

LineRow.propTypes = {
    line: PropTypes.shape({
        name: PropTypes.string,
    }),
};

export default memo(LineRow);
