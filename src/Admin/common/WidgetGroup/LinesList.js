import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import { ListGroupItem, Button } from "reactstrap";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteModal from "../DeleteModal";

function LinesList(props) {
    const {
        line,
        updateObject,
        open,
        toggleHeader,
        linesCount,
    } = props;
    const { pathname } = useLocation();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const unbindingLine = useCallback((ev) => {
        ev.preventDefault();
        axios.post(`/admin/api/lines/${line.id}/linkGroup`, { groupId: null })
            .then(() => {
                if (open && linesCount <= 1) {
                    toggleHeader(false);
                }
                toast.success("Отрезок отвязан");
                updateObject();
            })
            .catch((err) => {
                const msg = `Ошибка, ${err.message || err?.response?.message}`;
                toast.error(msg, { autoClose: 4000 });
            });
    }, [line?.id, open, linesCount, toggleHeader]);

    const openDelete = useCallback(() => {
        setOpenDeleteModal(true);
    }, []);

    const closeDelete = useCallback(() => {
        setOpenDeleteModal(false);
    }, []);

    return (
        <React.Fragment>
            <ListGroupItem
                data-line={JSON.stringify(line)}
                title="Переместить"
                className="list-item">
                <NavLink
                    title={`Перейти в ${line.name}`}
                    to={`${pathname}/${line.id}`}>
                    {line.name}
                </NavLink>
                <Button
                    className="btn-sm"
                    onClick={openDelete}
                    title="Удалить отрезок"
                    color="light">
                    <i className="fa fa-minus text-danger d-bloc" />
                </Button>
            </ListGroupItem>
            <DeleteModal
                submit={unbindingLine}
                toggleModal={closeDelete}
                isOpen={openDeleteModal}
                title="Подтверждение удаления отрезка из группы" />
        </React.Fragment>
    );
}

LinesList.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        orderWeight: PropTypes.number,
    }),
    updateObject: PropTypes.func,
    toggleHeader: PropTypes.func,
    open: PropTypes.bool,
    linesCount: PropTypes.number,
};

export default memo(LinesList);
