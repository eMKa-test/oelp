import React, { useCallback } from "react";
import * as PropTypes from "prop-types";
import { Button, Col, Row } from "reactstrap";
import Pagination from "../../../layout/DefaultPagination";
import LinesGrid from "./LinesGrid";
import LinesEditModal from "../../../common/LinesEditModal";
import {
    initialState,
    reducer,
    setOpenNewLine,
    setPagination,
} from "./reducer";

const Lines = (props) => {
    const {
        currentObject, currentType, putLine, updateObject, loading,
    } = props;
    const [state, dispatch] = React.useReducer(reducer, initialState(), initialState);
    const freeLines = currentObject?.lines?.filter((line) => !line.groupId);

    const handlePagination = useCallback(({ page, limit = 12 }) => {
        const start = (page - 1) * limit;
        const end = page * limit;
        dispatch(setPagination({
            page,
            limit,
            lines: freeLines?.slice(start, end) || [],
        }));
    }, [freeLines]);

    const filterLines = useCallback(() => {
        const start = (state.page - 1) * state.limit;
        dispatch(setPagination({
            page: state.page,
            lines: freeLines?.slice(start, state.limit * state.page) || [],
            total: freeLines?.length,
            pages: Math.floor(freeLines?.length / 12) || 0,
        }));
    }, [freeLines, state.page, state.limit]);

    React.useEffect(() => {
        filterLines();
    }, [currentObject?.lines]);

    const submitNewLine = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value && ev.target.description.value) {
            dispatch(setOpenNewLine(false));
            putLine({
                objectID: currentObject.id,
                line: {
                    name: ev.target.name.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                    agentPlans: {
                        points: ev.target.planPoints.value,
                        photos: ev.target.planPhotos.value,
                        videos: ev.target.planVideos.value,
                        panoramas: ev.target.planPanoramas.value,
                    },
                    orderWeight: ev.target.orderWeight.value,
                },
            });
        }
    };

    return (
        <React.Fragment>
            <Row
                className="lines-dropzone mt-3">
                <Col>
                    <h4 className="mb-3">Отрезки</h4>
                    <Button
                        color="primary"
                        onClick={() => dispatch(setOpenNewLine(true))}>
                        Добавить новый отрезок +
                    </Button>
                </Col>
                <Col
                    className="mb-2"
                    xs={12}>
                    <LinesGrid
                        updateObject={updateObject}
                        objectID={currentObject?.id}
                        currentType={currentType}
                        lines={state.lines}
                        groups={currentObject.groups} />
                </Col>
                {state.lines.length > 0 ? (
                    <Col>
                        <Pagination
                            total={state.total}
                            onPagination={handlePagination}
                            page={state.page} />
                    </Col>
                ) : null}
            </Row>
            <LinesEditModal
                isOpen={state.isNewLine}
                title={`Добавление отрезка объекту - ${currentObject.name}`}
                toggleModal={() => dispatch(setOpenNewLine(!state.isNewLine))}
                submit={submitNewLine}
                withAgentPlans />
        </React.Fragment>
    );
};

Lines.propTypes = {
    currentObject: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        lines: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            tabs: PropTypes.arrayOf(PropTypes.string),
        })),
    }),
};

export default Lines;
