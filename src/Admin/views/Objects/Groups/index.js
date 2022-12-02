import React, { useReducer } from "react";
import * as PropTypes from "prop-types";
import { Button, Col, Row } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useHistory } from "react-router-dom";
import Pagination from "../../../layout/DefaultPagination";
import GroupsGrid from "./GroupsGrid";
import GroupEditModal from "../../../common/GroupEditModal";
import DeleteModal from "../../../common/DeleteModal";
import {
    reducer,
    initialState,
    setPagination,
    setOpenNewGroup,
    setOpenEditGroup,
    setOpenDeleteGroup,
} from "./reducer";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Groups = (props) => {
    const {
        currentObject,
        currentType,
        updateObject
    } = props;
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);
    const {
        location: { pathname },
        replace
    } = useHistory();
    const query = useQuery();
    const groupIdFromSearch = query.get("groupId");

    const handlePagination = ({
        page,
        limit = 50
    }) => {
        const { groups } = currentObject;
        const start = (page - 1) * limit;
        const end = page * limit;
        dispatch(setPagination({
            page,
            limit,
            groups: groups.slice(start, end),
        }));
    };

    const filterGroups = () => {
        const { groups } = currentObject;
        const start = (state.page - 1) * state.limit;
        if (groups?.length > 0) {
            dispatch(setPagination({
                page: state.page,
                groups: groups.slice(start, state.limit * state.page) || [],
                total: groups?.length,
                pages: Math.floor(groups?.length / 12) || 0,
            }));
        }
    };

    React.useEffect(() => {
        filterGroups();
    }, [currentObject?.groups]);

    const submitDelete = React.useCallback((ev) => {
        ev.preventDefault();
        axios.delete(`/admin/api/groups/${state.isOpenDelete.id}`)
            .then(() => {
                toast.success("Группа удалена");
            })
            .catch((err) => {
                const msg = `Ошибка, ${err?.message || err?.response?.message}`;
                toast.error(msg, { autoClose: 4000 });
            })
            .finally(() => {
                updateObject(currentObject.id);
                dispatch(setOpenDeleteGroup(null));
            });
    }, [state.isOpenDelete]);

    const toggleNewGroupModal = React.useCallback(() => {
        dispatch(setOpenNewGroup(!state.isNewGroup));
    }, [state.isNewGroup]);

    const toggleEditModal = React.useCallback(() => {
        toggleNewGroupModal();
        dispatch(setOpenEditGroup(false, null));
        if (groupIdFromSearch) {
            replace(pathname);
        }
    }, [state.isNewGroup, groupIdFromSearch]);

    const openEditGroup = React.useCallback((group) => () => {
        toggleNewGroupModal();
        dispatch(setOpenEditGroup(true, { ...group }));
    }, [state.isNewGroup]);

    const deleteGroup = React.useCallback((group) => () => {
        dispatch(setOpenDeleteGroup({ ...group }));
    }, []);

    const closeDelete = React.useCallback(() => {
        dispatch(setOpenDeleteGroup(null));
    }, []);

    React.useEffect(() => {
        if (groupIdFromSearch && currentObject?.groups) {
            const { groups } = currentObject;
            const group = groups.find((item) => item.id === Number(groupIdFromSearch));
            openEditGroup(group)();
        }
    }, [groupIdFromSearch, currentObject]);

    return (
        <React.Fragment>
            <Row className="mt-3">
                <Col>
                    <h4 className="mb-3">Группы</h4>
                    <Button
                        className="mr-3"
                        color="primary"
                        onClick={toggleNewGroupModal}>
                        Добавить новую группу +
                    </Button>
                </Col>
                <Col
                    className="mb-2"
                    xs={12}>
                    <GroupsGrid
                        updateObject={() => updateObject(currentObject?.id)}
                        editGroup={openEditGroup}
                        deleteGroup={deleteGroup}
                        currentObject={currentObject}
                        currentType={currentType}
                        groups={state.groups}/>
                </Col>
                {state.groups?.length > 0 ? (
                    <Col>
                        <Pagination
                            total={state.total}
                            onPagination={handlePagination}
                            page={state.page}/>
                    </Col>
                ) : null}
            </Row>
            <GroupEditModal
                updateObject={updateObject}
                currentObject={currentObject}
                isOpen={state.isNewGroup || state.isOpenEdit}
                editGroup={state.editGroup}
                edit={Boolean(state.editGroup)}
                objectId={currentObject.id}
                title={`Добавление группы объекту - ${currentObject.name}`}
                toggleModal={toggleEditModal}/>
            <DeleteModal
                title="Подтверждение удаления группы"
                isOpen={Boolean(state.isOpenDelete)}
                toggleModal={closeDelete}
                submit={submitDelete}/>
        </React.Fragment>
    );
};

Groups.propTypes = {
    currentObject: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            description: PropTypes.string,
        })),
    }),
    currentType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    updateObject: PropTypes.func,
};

export default Groups;
