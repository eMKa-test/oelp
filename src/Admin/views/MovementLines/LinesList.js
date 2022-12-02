import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "reactstrap";
import placeholder from "../../../assets/placeholders/obj.jpg";

const LinesList = ({
    lines, setDraggingLine, loadFetch, selectLine, selectedLines, resetSelectMode, objectToMove, onSubmitMove,
}) => {
    const isSelectedMode = selectedLines.length > 0;
    const onDragStart = useCallback((line) => (e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("lineId", JSON.stringify({ lineId: line.id, objectId: line.projectId, id: e.target.id }));
        e.target.classList.add("dragging");
        setDraggingLine(line);
    }, [setDraggingLine]);

    const onDragEnd = useCallback((e) => {
        e.currentTarget.classList.remove("dragging");
    }, []);

    return (
        <div className="lines-list">
            <span className="title">Отрезки</span>
            <div className="items__wrapper">
                <div className="control">
                    <div>
                        {isSelectedMode ? (
                            <span className="info-title">Выбрать объект</span>
                        ) : (
                            <span className="info-title">Перетащить отрезок или выбрать несколько</span>
                        )}
                    </div>
                    <div>
                        <Button
                            disabled={!isSelectedMode}
                            color="danger"
                            onClick={resetSelectMode}>
                            <i className="fa fa-ban" />
                        </Button>
                        <Button
                            className="ml-2"
                            disabled={!isSelectedMode || !objectToMove}
                            color="success"
                            onClick={onSubmitMove}>
                            <i className="fa fa-check" />
                        </Button>
                    </div>
                </div>
                <div className="items">
                    {lines.length ? lines.map((line, i) => {
                        const isSelected = selectedLines.includes(line.id);
                        return (
                            <button
                                onClick={() => selectLine(line.id)}
                                disabled={loadFetch}
                                draggable={!loadFetch && !isSelectedMode}
                                id={`line_${line.id}`}
                                onDragStart={onDragStart(line)}
                                onDragEnd={onDragEnd}
                                type="button"
                                key={String(i)}
                                className="movement-card">
                                <div className="item-thumb">
                                    <div
                                        className="item-thumb__overlay"
                                        style={{ backgroundImage: `url(${line.image?.tmb || placeholder})` }} />
                                </div>
                                <div className="info">
                                    <span className="title">{line.name}</span>
                                    <span className="description">{line.description}</span>
                                </div>
                                <i className={classnames("fa fa-check selected-line", { "show-select-line": isSelected })} />
                            </button>
                        );
                    }) : (
                        <span className="no-items">Отрезков нет</span>
                    )}
                </div>
            </div>
        </div>
    );
};

LinesList.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
    })),
    selectedLines: PropTypes.arrayOf(PropTypes.number),
    setDraggingLine: PropTypes.func.isRequired,
    selectLine: PropTypes.func.isRequired,
    loadFetch: PropTypes.bool.isRequired,
    objectToMove: PropTypes.number,
    resetSelectMode: PropTypes.func.isRequired,
    onSubmitMove: PropTypes.func.isRequired,
};

export default memo(LinesList);
