import React, { memo } from "react";
import * as PropTypes from "prop-types";

const DefaultStatus = (props) => {
    const {} = props;

    return (
        <div className="DefaultStatus__wrapper">
            DefaultStatus body
        </div>
    );
};

DefaultStatus.propTypes = {};

export default memo(DefaultStatus);
