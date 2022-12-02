import React, {memo, useCallback, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import {
    Col,
    Collapse,
    Card,
    Button,
} from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import BodyGroup from "./Dropzone";
import DndLinesList from "./DndLinseList";
import { putLine } from "../../store/actionCreators/linesActions";

function WidgetGroup(props) {
    const {
        group,
        deleteGroup,
        editGroup,
        lines,
        updateObject,
    } = props;
    const { id } = group;
    const [open, setOpen] = useState(false);
    const linesCount = group?.lines?.length;
    const dropRef = useRef(null);

    if (linesCount) {
        group.lines.sort((a, b) => {
            return b.orderWeight - a.orderWeight;
        });
    }

    const toggleHeader = useCallback((val) => {
        if (typeof val === "boolean") {
            return setOpen(val);
        }
        return setOpen(!open);
    }, [open, linesCount]);

    const bindLines = useCallback((_lines, callback) => {
        const allFetches = _lines.map((lineId) => {
            return axios.post(`/admin/api/lines/${lineId}/linkGroup`, { groupId: group.id });
        });
        Promise.all(allFetches)
            .then(() => {
                if (typeof callback === "function") {
                    callback();
                }
                toast.success("Отрезки привязаны");
                updateObject();
            })
            .catch((err) => {
                const msg = `Ошибка, ${err.message || err?.response?.message}`;
                toast.error(msg, { autoClose: 4000 });
            });
    }, [group]);

    const manualOnDrop = useCallback((e) => {
        e.stopPropagation();
        if (dropRef.current) {
            dropRef.current.fileInputEl.click()
        }
    }, [dropRef]);

    return (
        <React.Fragment>
            <Col
                key={id}
                className="mb-3"
                xs={12}
                sm={6}
                md={4}
                xl={3}
                style={{ overflow: "hidden" }}>
                <div>
                    <Card
                        className="group-card">
                        <BodyGroup
                            onClick={toggleHeader}
                            forwardRef={dropRef}
                            group={group}>
                            <Button
                                title="Загрузить картинку группы"
                                className="dropBtn"
                                onClick={manualOnDrop}>
                                <i className="fa fa-upload text-light" />
                            </Button>
                        </BodyGroup>
                        <Collapse isOpen={open}>
                            <DndLinesList
                                putLine={props.putLine}
                                lines={lines}
                                open={open}
                                updateObject={updateObject}
                                toggleHeader={toggleHeader}
                                bindLines={bindLines}
                                group={group} />
                        </Collapse>
                    </Card>
                </div>
                <Button
                    title="Удалить группу"
                    className="deleteBtn"
                    color="light"
                    onClick={deleteGroup({ ...group })}>
                    <i className="icon-trash icons icon-trash-style" />
                </Button>
                <Button
                    title="Редактировать группу"
                    className="editBtn"
                    color="primary"
                    onClick={editGroup({ ...group })}>
                    <i className="icon-pencil icons" />
                </Button>
            </Col>
        </React.Fragment>
    );
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ putLine }, dispatch);

WidgetGroup.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        lines: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            }),
        ),
        image: PropTypes.shape({
            raw: PropTypes.string,
            src: PropTypes.string,
            tmb: PropTypes.string,
        }),
    }),
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
    })),
    deleteGroup: PropTypes.func,
    putLine: PropTypes.func,
    editGroup: PropTypes.func,
    updateObject: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(memo(WidgetGroup));
