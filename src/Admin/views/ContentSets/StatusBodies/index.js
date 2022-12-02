import React, { memo } from "react";
import * as PropTypes from "prop-types";
import FailedStatus from "./Failed";
import ConvertingStatus from "./Converting";
import UploadingStatus from "./Uploading";
import DefaultStatus from "./DefaultStatus";

const StatusBodies = (props) => {
    const {
        set,
        ...rest
    } = props;

    switch (set.status) {
        case "FAILED":
            return (
                <FailedStatus
                    {...rest}
                    set={set} />
            );
        case "CONVERTING":
            return (
                <ConvertingStatus set={set} />
            );
        case "UPLOADING":
            return (
                <UploadingStatus
                    {...rest}
                    set={set} />
            );
        default:
            return (
                <DefaultStatus
                    {...rest}
                    set={set} />
            );
    }
};

StatusBodies.propTypes = {
    set: PropTypes.shape({
        status: PropTypes.string.isRequired,
    }),
};

export default memo(StatusBodies);
