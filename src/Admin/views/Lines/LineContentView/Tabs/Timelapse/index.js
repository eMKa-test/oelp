import React, {memo} from "react";
import * as PropTypes from "prop-types";
import TimelapseTab from "./TimelapseTab";

const TimeLapse = ({ children }) => (
    <TimelapseTab>
        {children}
    </TimelapseTab>
);

TimeLapse.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(TimeLapse);
