import React, {
    memo, useReducer, useEffect, useCallback,
} from "react";
import * as PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ControlPane from "./ControlPane";
import Scheme from "./Scheme";
import reducer, {
    initialState,
    loadSchemes,
    selectScheme,
    changeMode,
    setDots,
    setDefaultDotsCoords,
    setDotCoords,
    setViewParams,
} from "./reducer";
import { setPointsLineScheme } from "../../../../store/actionCreators/linesActions";
import { convertCoordsToImageScale } from "./helpers";
import "./style.css";

const RoomScheme = (props) => {
    const {
        contentType,
        line,
        updateLineSchemePoints,
    } = props;
    const [state, dis] = useReducer(reducer, initialState(), initialState);

    useEffect(() => {
        loadSchemes(dis, line.schemes);
    }, [line.schemes]);

    const onSavePoints = useCallback(() => {
        const body = {
            contentType,
            date: state.selectedScheme.date,
            lineId: line.id,
            points: state.dots.map((dot) => ({
                ...dot,
                schemePoint: convertCoordsToImageScale(state.selectedScheme.image, state.viewParams, dot.schemePoint),
            })),
        };
        updateLineSchemePoints(body);
    }, [state.dots, state.selectedScheme, state.viewParams]);

    return (
        <Row className="room-scheme__body">
            <Col xs={12}>
                <ControlPane
                    onSavePoints={onSavePoints}
                    dots={state.dots}
                    defaultCoords={state.defaultCoords}
                    zoomMode={state.zoomMode}
                    gridMode={state.gridMode}
                    setDots={(v) => setDots(dis, v)}
                    changeMode={(mode) => changeMode(dis, mode)}
                    schemes={state.schemes}
                    selectedScheme={state.selectedScheme}
                    selectScheme={(v) => selectScheme(dis, v)}
                    contentType={contentType}
                    lineId={line.id} />
            </Col>
            <Col xs={12}>
                {state.selectedScheme ? (
                    <Scheme
                        viewParams={state.viewParams}
                        setViewParams={(v) => setViewParams(dis, v)}
                        setDotCoords={(v) => setDotCoords(dis, v)}
                        setDefaultDotsCoords={(v) => setDefaultDotsCoords(dis, v)}
                        defaultCoords={state.defaultCoords}
                        dots={state.dots}
                        setDots={(v) => setDots(dis, v)}
                        gridMode={state.gridMode}
                        zoomMode={state.zoomMode}
                        selectedScheme={state.selectedScheme}
                        contentType={contentType}
                        lineId={line.id} />
                ) : (
                    <span className="empty-schemes">Ни одной схемы не загружено</span>
                )}
            </Col>
        </Row>
    );
};

RoomScheme.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number,
        schemes: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    contentType: PropTypes.string,
    updateLineSchemePoints: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
    contentType: store.content.contentType,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateLineSchemePoints: setPointsLineScheme,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(RoomScheme));
