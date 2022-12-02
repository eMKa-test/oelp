import React, {
    Fragment, memo, useCallback, useState, useEffect,
} from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import MarkerCard from "./MarkerCard";
import DeleteModal from "../../common/DeleteModal";
import { postContentRoutes, deleteContentRoutes } from "../../api/panorama";

const StepRouteBindPanel = (props) => {
    const {
        marker,
        onReset,
        neighbours,
        contentType,
        dateFrom,
        lineId,
        setArrowsMode,
        arrowsMode,
        contentRouteId,
        updateContentRoutes,
        updateContent,
        routes,
    } = props;
    const [deadEnd, setDeadEnd] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const matchRoute = routes?.find((r) => r.pointId === marker?.pointId);

    useEffect(() => {
        if (matchRoute) {
            setDeadEnd(matchRoute.deadEnd);
        }
        return () => {
            setDeadEnd(false);
        };
    }, [matchRoute, marker]);

    const onSave = useCallback((pointId) => () => {
        let route = routes ? [...routes] : [];
        if (typeof pointId === "number") {
            route = route.filter((r) => r.pointId !== pointId);
        } else {
            const matchIndex = route.findIndex((r) => r.pointId === marker.pointId);
            const newRoute = {
                pointId: marker.pointId,
                contents: deadEnd ? [] : neighbours.map((n) => n.pointId),
                deadEnd,
            };
            if (matchIndex > -1) {
                route.splice(matchIndex, 1, newRoute);
            } else {
                route.push(newRoute);
            }
        }
        const body = {
            lineId,
            contentType,
            date: dateFrom,
            route,
        };
        if (route.length === 0) {
            return onDelete();
        }
        postContentRoutes(body, () => {
            onReset();
            updateContentRoutes();
            updateContent();
        });
    }, [marker, neighbours, contentType, dateFrom, deadEnd, updateContentRoutes, routes]);

    const onDelete = useCallback((e) => {
        e && e.preventDefault();
        deleteContentRoutes(contentRouteId, () => {
            onReset();
            setConfirm(false);
            updateContentRoutes();
            updateContent();
        });
    }, [contentRouteId, updateContentRoutes]);

    return (
        <Fragment>
            <div className="step-route-bind">
                {marker && (
                    <MarkerCard
                        canBeReset={Boolean(routes?.find((r) => r.pointId === marker.pointId))}
                        arrowsMode={arrowsMode}
                        setArrowsMode={setArrowsMode}
                        deadEnd={deadEnd}
                        setDeadEnd={setDeadEnd}
                        onReset={onReset}
                        onSave={onSave}
                        marker={marker} />
                )}
                <div className="footer">
                    <div className="control">
                        <Button
                            disabled={!contentRouteId}
                            title="Удалить все заданные переходы за текущую дату"
                            color="danger"
                            outline
                            onClick={() => setConfirm(true)}>
                            <i
                                className="fa fa-trash-o"
                                aria-hidden="true" />
                        </Button>
                        <div>
                            <Button
                                disabled={!marker}
                                title="Отменить все изменения"
                                color="warning"
                                className="ml-2"
                                onClick={onReset}>
                                <i className="fa fa-ban" />
                            </Button>
                            <Button
                                disabled={!marker}
                                title="Привязать все измененные проходки"
                                className="ml-2"
                                color="success"
                                onClick={onSave()}>
                                <i className="fa fa-check" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                title="Подтверждение удаления созданных переходов"
                isOpen={confirm}
                toggleModal={() => setConfirm(false)}
                submit={onDelete} />
        </Fragment>
    );
};

StepRouteBindPanel.propTypes = {
    marker: PropTypes.shape({
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
    }),
    contentRouteId: PropTypes.number,
    neighbours: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
    })),
    onReset: PropTypes.func.isRequired,
    updateContentRoutes: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
    arrowsMode: PropTypes.bool.isRequired,
    setArrowsMode: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired,
    dateFrom: PropTypes.string,
    lineId: PropTypes.number,
};

export default memo(StepRouteBindPanel);
