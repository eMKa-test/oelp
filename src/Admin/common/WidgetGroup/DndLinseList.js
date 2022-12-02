import React, {
    memo, useEffect, useState, useRef, useCallback,
} from "react";
import * as PropTypes from "prop-types";
import { CardBody, Button, Spinner } from "reactstrap";
import dragula from "react-dragula";
import { toast } from "react-toastify";
import LinesList from "./LinesList";
import SelectLines from "./SelectLines";
import { postData } from "../../../api";
import { OBJECTS_API_URL } from "../../constants";

const DndLinesList = (props) => {
    const {
        group,
        bindLines,
        toggleHeader,
        updateObject,
        open,
        lines,
    } = props;
    const [items, setItems] = useState([]);
    const [load, setLoad] = useState(false);
    const linesCount = group?.lines?.length;
    const container = useRef();

    useEffect(() => {
        let drake;
        if (open) {
            drake = dragula([container.current], {
                revertOnSpill: true,
            });
            setItems(Array.from(drake.containers[0].childNodes));
            drake.on("drop", (e, target, source) => {
                try {
                    setItems(Array.from(source.childNodes));
                } catch (err) {
                    console.error(err);
                }
            });
            drake.on("cancel", () => {
                toast.error("Перемещение отменено", { autoClose: 4000 });
            });
        }
        return () => {
            if (drake) {
                drake.destroy();
            }
        };
    }, [group.lines, open, load]);

    const autoSetOrders = useCallback(async (e) => {
        try {
            e.stopPropagation();
            setLoad(true);
            const fetches = items.map((el, i) => {
                const ob = JSON.parse(el.dataset.line);
                ob.orderWeight = (items.length - 1) - i;
                return postData({
                    mainUrl: `${OBJECTS_API_URL}/${group.projectId}/lines/${ob.id}`,
                    body: { ...ob },
                });
            });
            await Promise.all(fetches);
            toast.success("Изменения внесены");
            setLoad(false);
        } catch (err) {
            toast.error(`Что-то не так ${err.message}`, { autoClose: 4000 });
            setLoad(false);
            console.error(err);
        }
    }, [items]);

    return (
        <CardBody id="group-lines-container">
            {group?.lines?.length > 0 && (
                <div className="list-item">
                    {load ? (
                        <Spinner
                            size="sm"
                            color="primary" />
                    ) : <div />}
                    <Button
                        disabled={load}
                        onClick={autoSetOrders}
                        title={"Сортировка задаётся всем отрезкам по текущему расположению в списке\nСначала расставить нужный порядок в списке, затем нажать кнопку\nВерхний отрезок будет первым в меню и т.д."}
                        className="btn-sm btn-info">
                        <span className="text-light">
                            Сортировать
                        </span>
                        &nbsp;
                        <i className="fa fa-sort-amount-desc text-light" />
                    </Button>
                </div>
            )}
            {load && (
                <div className="load-pane" />
            )}
            <div
                ref={container}
                id="linesContainer">
                {group.lines.map((line) => (
                    <LinesList
                        key={line.id}
                        linesCount={linesCount}
                        toggleHeader={toggleHeader}
                        updateObject={updateObject}
                        open={open}
                        group={group}
                        line={line} />
                ))}
            </div>
            <SelectLines
                group={group}
                bindLines={bindLines}
                lines={lines} />
        </CardBody>
    );
};

DndLinesList.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        lines: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            }),
        ),
    }),
    lines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        }),
    ),
    open: PropTypes.bool,
    bindLines: PropTypes.func,
    putLine: PropTypes.func,
    toggleHeader: PropTypes.func,
    updateObject: PropTypes.func,
};

export default memo(DndLinesList);
