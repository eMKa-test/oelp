import React, { memo } from "react";
import * as PropTypes from "prop-types";
import ErrorBoundary from "../../../../../common/ErrorBoundary";
import CreateScheme from "./CreateScheme";
import DatesList from "./DatesList";
import SchemeHelpers from "./SchemeHelpers";
import SubmitPane from "./SubmitPane";
import "./style.css";

const ControlPane = (props) => {
    const {
        contentType,
        lineId,
        schemes,
        selectScheme,
        selectedScheme,
        changeMode,
        zoomMode,
        gridMode,
        dots,
        setDots,
        defaultCoords,
        onSavePoints,
    } = props;

    return (
        <div className="control-pane">
            <div className="d-flex">
                <ErrorBoundary>
                    <CreateScheme
                        selectedScheme={selectedScheme}
                        contentType={contentType}
                        lineId={lineId} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <DatesList
                        selectedScheme={selectedScheme}
                        selectScheme={selectScheme}
                        schemes={schemes} />
                </ErrorBoundary>
            </div>
            {schemes.length > 0 && (
                <ErrorBoundary>
                    <SchemeHelpers
                        zoomMode={zoomMode}
                        gridMode={gridMode}
                        changeMode={changeMode} />
                </ErrorBoundary>
            )}
            {selectedScheme && (
                <ErrorBoundary>
                    <SubmitPane
                        defaultCoords={defaultCoords}
                        setDots={setDots}
                        dots={dots}
                        onSavePoints={onSavePoints} />
                </ErrorBoundary>
            )}
        </div>
    );
};

ControlPane.propTypes = {
    onSavePoints: PropTypes.func.isRequired,
    selectedScheme: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    dots: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
    schemes: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
    lineId: PropTypes.number.isRequired,
    changeMode: PropTypes.func.isRequired,
    setDots: PropTypes.func.isRequired,
    selectScheme: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired,
    zoomMode: PropTypes.bool.isRequired,
    gridMode: PropTypes.bool.isRequired,
};

export default memo(ControlPane);
