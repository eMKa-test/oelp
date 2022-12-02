import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import axios from "axios";
import { mapToCssModules } from "reactstrap/lib/utils";
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Col, Button,
} from "reactstrap";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import palceholder from "assets/placeholders/obj.jpg";
import DeleteModal from "./DeleteModal";

function WidgetLine(props) {
    const {
        line,
        to,
        cssModule,
        openDeleteModal,
        groups,
        updateObject,
    } = props;
    const [openGroups, setOpenGroups] = useState(false);
    const [unbindModal, setUnbindModal] = useState(false);

    const bg = { backgroundImage: line?.image?.tmb ? `url('${line?.image?.tmb}')` : `url(${palceholder})` };
    const bindingGroup = groups.find((group) => group.id === line?.groupId);

    const classCard = "brand-card";
    const classCardHeader = classNames(`${classCard}-header`);
    const classCardTitle = `${classCard}-title h5`;
    const classCardBody = classNames(`${classCard}-body`, "px-2");
    const classes = mapToCssModules(classNames(classCard, "linesStyles"), cssModule);
    const {
        name,
        description,
    } = line;

    const openUnbindModal = useCallback(() => {
        setUnbindModal(true);
    }, []);

    const closeUnbindModal = useCallback(() => {
        setUnbindModal(false);
    }, []);

    const toggleGroup = useCallback((_groupId, lineGroupId) => (ev) => {
        ev.preventDefault();
        const groupId = lineGroupId ? null : _groupId;
        const body = { groupId };
        axios.post(`/admin/api/lines/${line.id}/linkGroup`, body)
            .then((res) => {
                if (groupId) {
                    toast.success("Отрезок привязан");
                } else {
                    toast.success("Отрезок отвязан");
                }
                updateObject();
            })
            .catch((err) => {
                const msg = `Ошибка, ${err.message || err?.response?.message}`;
                toast.success(msg, { autoClose: 4000 });
            });
        closeUnbindModal();
    }, [line?.id]);

    return (
        <React.Fragment>
            <Col
                className="mb-3"
                xs={12}
                sm={6}
                md={4}
                xl={3}>
                <NavLink to={to}>
                    <div className={classes}>
                        <div
                            className={classCardHeader}
                            style={bg}>
                            <span className={classCardTitle}>{name}</span>
                        </div>
                        {description && (
                            <div className={classCardBody}>
                                <div className="text-muted text-nowrap text-truncate">{description}</div>
                            </div>
                        )}
                    </div>
                </NavLink>
                <Button
                    className="deleteBtn"
                    color="light"
                    onClick={() => openDeleteModal(line.id)}>
                    <i className="icon-trash icons icon-trash-style" />
                </Button>
                {groups?.length > 0 && !line?.groupId && (
                    <div>
                        <Dropdown
                            className="addTpGroupBtn"
                            direction="right"
                            isOpen={openGroups}
                            toggle={() => setOpenGroups(!openGroups)}>
                            <DropdownToggle title="Добавить отрезок в группу">
                                <i className="fa fa-plus text-success" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <div className="drop-down__group__header">
                                    <p className="text-center m-0">Доступные группы</p>
                                </div>
                                {groups.map((group) => (
                                    <DropdownItem
                                        onClick={toggleGroup(group.id, line?.groupId)}
                                        key={group.id}>
                                        {group.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )}
                {groups?.length > 0 && line?.groupId && (
                    <Button
                        title={`Удалить привязку с группы: ${bindingGroup?.name}`}
                        className="addTpGroupBtn"
                        onClick={openUnbindModal}>
                        <i className="fa fa-minus text-danger" />
                    </Button>
                )}
            </Col>
            <DeleteModal
                title="Подтверждение удаления отрезка из группы"
                isOpen={unbindModal}
                toggleModal={closeUnbindModal}
                submit={toggleGroup(null, null)} />
        </React.Fragment>
    );
}

WidgetLine.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.shape({}),
        groupId: PropTypes.number,
        description: PropTypes.string,
    }),
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({}),
        }),
    ),
    name: PropTypes.string,
    description: PropTypes.string,
};

export default memo(WidgetLine);
