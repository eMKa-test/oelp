import React from "react";
import * as PropTypes from "prop-types";
import { Row, Alert } from "reactstrap";
import { toast } from "react-toastify";
import { fetchData } from "../../../../api";
import DeleteModal from "../../../common/DeleteModal";
import WidgetLine from "../../../common/WidgetLine";

const LinesGrid = (props) => {
    const { lines, objectID, updateObject } = props;
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(null);

    const closeDeleteModal = React.useCallback(() => {
        setOpenDelete(false);
        setDeleteId(null);
    }, []);

    const deleteLine = React.useCallback((ev) => {
        ev.preventDefault();
        fetchData({
            url: `/admin/api/projects/${objectID}/lines/${deleteId}`,
            method: "delete",
        }).then(() => {
            toast.success("Отрезок удалён");
            updateObject(objectID);
        }).catch((err) => {
            const msg = `Ошибка, ${err.message || err?.response?.message}`;
            toast.error(msg, { autoClose: 4000 });
        });
        setOpenDelete(false);
    }, [deleteId, objectID]);

    const openDeleteModal = React.useCallback((id) => {
        setOpenDelete(true);
        setDeleteId(id);
    }, []);

    if (lines?.length === 0) {
        return (
            <Alert
                className="mb-0"
                color="light">
                Отрезки отсутствуют
            </Alert>
        );
    }

    const { currentType, groups } = props;

    return (
        <React.Fragment>
            <Row className="mt-3">
                {Array.isArray(lines) &&
                lines.map((line) => {
                    const to = currentType
                        ? `/admin/companies/${currentType}/${objectID}/${line.id}`
                        : `/admin/objects/${objectID}/${line.id}`;
                    return (
                        <WidgetLine
                            key={line.id}
                            to={to}
                            updateObject={() => updateObject(objectID)}
                            openDeleteModal={openDeleteModal}
                            line={line}
                            groups={groups} />
                    );
                })}
            </Row>
            <DeleteModal
                title="Подтверждение удаления отрезка"
                isOpen={openDelete}
                toggleModal={closeDeleteModal}
                submit={deleteLine} />
        </React.Fragment>
    );
};

LinesGrid.propTypes = {
    objectID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentType: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    lines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({}),
        }),
    ),
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({}),
        }),
    ),
    updateObject: PropTypes.func.isRequired,
};

export default LinesGrid;
