import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { postData } from "../../../api";
import { getAllProjects } from "../../store/actionCreators/companiesActions";
import placeholder from "../../../assets/placeholders/obj.jpg";

const ObjectsList = ({
    objects, selectedObjectId, setObject, draggingLineObject, removeDraggingLine, setLoadFetch, loadFetch, selectedLines,
    setObjectToMove, objectToMove,
}) => {
    const dispatch = useDispatch();
    const isSelectedMode = selectedLines.length > 0;

    const onDrop = useCallback((droppedObjectId) => (e) => {
        try {
            const data = e.dataTransfer.getData("lineId");
            const parsed = JSON.parse(data);
            if (parsed.objectId === droppedObjectId) {
                const node = document.getElementById(parsed.id);
                node.classList.remove("dragging");
                e.currentTarget.classList.remove("drop-over");
                e.currentTarget.classList.remove("drop-over-denied");
                removeDraggingLine();
                return false;
            }
            setLoadFetch(true);
            const mainUrl = `/admin/api/lines/${parsed.lineId}/move`;
            const body = {
                projectId: Number(e.target.id),
            };
            postData({
                mainUrl,
                body,
            }).then((res) => {
                if (res.success) {
                    removeDraggingLine();
                    dispatch(getAllProjects());
                    toast.success("Изменения сохранены");
                }
            }).catch((err) => {
                toast.error("Ошибка", { autoClose: 4000 });
                console.error(err);
            });
            e.currentTarget.classList.remove("drop-over");
        } catch (err) {
            toast.error("Ошибка", { autoClose: 4000 });
            console.warn(err, "JSON PARSE ERROR");
        } finally {
            setLoadFetch(false);
        }
        return null;
    }, [selectedObjectId]);

    const onDragEnter = useCallback((e) => {
        e.preventDefault();
        if (draggingLineObject?.projectId === Number(e.currentTarget.id)) {
            e.currentTarget.classList.add("drop-over-denied");
            e.dataTransfer.effectAllowed = "none";
        } else {
            e.currentTarget.classList.add("drop-over");
            e.dataTransfer.effectAllowed = "move";
        }
    }, [draggingLineObject?.projectId]);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains("drop-over-denied")) {
            e.currentTarget.classList.remove("drop-over-denied");
        } else {
            e.currentTarget.classList.remove("drop-over");
        }
    }, []);

    const onClick = useCallback((idx) => () => {
        if (isSelectedMode) {
            return setObjectToMove(idx);
        }
        setObject(idx);
    }, [isSelectedMode]);

    return (
        <div className="objects-list">
            <span className="title">Объекты</span>
            <div className="items__wrapper">
                <div
                    className="items">
                    {objects.length ? objects.map((pr, i) => (
                        <button
                            disabled={loadFetch}
                            id={pr.id}
                            onDrop={onDrop(pr.id)}
                            onDragOver={onDragOver}
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onClick={onClick(isSelectedMode ? pr.id : i)}
                            type="button"
                            key={String(i)}
                            className={classnames("movement-card", {
                                active: selectedObjectId === pr.id,
                                "object-to-move": objectToMove === pr.id,
                            })}>
                            <div className="item-thumb">
                                <div
                                    className="item-thumb__overlay"
                                    style={{ backgroundImage: `url(${pr.image?.tmb || placeholder})` }} />
                            </div>
                            <div className="info">
                                <span className="title">{pr.name}</span>
                                <span className="description">{pr.description}</span>
                            </div>
                        </button>
                    )) : (
                        <span className="no-items">Отрезков нет</span>
                    )}
                </div>
            </div>
        </div>
    );
};

ObjectsList.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
    })),
    setObject: PropTypes.func.isRequired,
    loadFetch: PropTypes.bool.isRequired,
    setLoadFetch: PropTypes.func.isRequired,
    removeDraggingLine: PropTypes.func.isRequired,
    setObjectToMove: PropTypes.func.isRequired,
    selectedObjectId: PropTypes.number,
    draggingLineObject: PropTypes.shape({
        projectId: PropTypes.number,
    }),
    selectedLines: PropTypes.arrayOf(PropTypes.number),
    objectToMove: PropTypes.number,
};

export default memo(ObjectsList);
