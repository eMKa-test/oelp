import React, { memo } from "react";
import * as PropTypes from "prop-types";
import AerialCard from "./AerialCard";
import ContentCard from "./ContentCard";

const UploadCard = (props) => {
    const {
        contentType,
        line,
    } = props;

    if (contentType.type === "AERIAL") {
        return (
            <AerialCard
                lineId={line.id}
                projectId={line.projectId}
                contentType={contentType} />
        );
    }

    return (
        <ContentCard
            line={line}
            contentType={contentType} />
    );
};

UploadCard.propTypes = {
    contentType: PropTypes.shape({
        type: PropTypes.string,
    }),
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.number,
    }),
};

export default memo(UploadCard);
