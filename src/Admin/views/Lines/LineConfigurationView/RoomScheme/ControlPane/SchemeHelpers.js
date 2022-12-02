import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";

const SchemeHelpers = (props) => {
    const {
        zoomMode,
        gridMode,
        changeMode,
    } = props;

    return (
        <div className="scheme-helpers__wrapper">
            <Button
                outline
                active={gridMode}
                color={gridMode ? "warning" : "dark"}
                title="Включить сетку"
                onClick={() => changeMode("gridMode")}
                className="control__button button button-grid mr-2">
                <i className="fa fa-table" />
            </Button>
            <Button
                outline
                active={zoomMode}
                color={zoomMode ? "warning" : "dark"}
                title="Режим карты"
                onClick={() => changeMode("zoomMode")}
                className="control__button button button-grab">
                <i className="fa fa-hand-paper-o" />
            </Button>
        </div>
    );
};

SchemeHelpers.propTypes = {
    zoomMode: PropTypes.bool.isRequired,
    gridMode: PropTypes.bool.isRequired,
    changeMode: PropTypes.func.isRequired,
};

export default memo(SchemeHelpers);
