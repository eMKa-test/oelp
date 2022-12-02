import React from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import "./style.css";

const ContentLoader = ({
    active,
    stickToTop = false,
}) => (
    <div
        className={classnames("Loader-container", {
            "loader-hide": !active,
            "loader-show": active,
            "stick-to-top": stickToTop,
        })}>
        <div className="spinner-border text-info">
            <span className="sr-only">Загрузка...</span>
        </div>
    </div>
);

ContentLoader.propTypes = {
    active: PropTypes.bool.isRequired,
    stickToTop: PropTypes.bool,
};

export default React.memo(ContentLoader);
