export const initialState = () => ({
    groups: [],
    limit: 50,
    pages: 0,
    total: 0,
    page: 1,
    isNewGroup: false,
    isOpenEdit: false,
    editGroup: null,
    isOpenDelete: null,
});

const OPEN_NEWGROUP_MODAL = "OPEN_NEWGROUP_MODAL";
export const setOpenNewGroup = (isNewGroup) => ({
    type: OPEN_NEWGROUP_MODAL,
    isNewGroup
});
const OPEN_DELETE_MODAL = "OPEN_DELETE_MODAL";
export const setOpenDeleteGroup = (isOpenDelete) => ({
    type: OPEN_DELETE_MODAL,
    isOpenDelete
});
const OPEN_EDIT_GROUP_MODAL = "OPEN_EDIT_GROUP_MODAL";
export const setOpenEditGroup = (isOpenEdit, editGroup) => ({
    type: OPEN_EDIT_GROUP_MODAL,
    isOpenEdit,
    editGroup
});
const SET_PAGINATION = "SET_PAGINATION";
export const setPagination = (...args) => ({ type: SET_PAGINATION, ...args });

export const reducer = (state, action) => {
    switch (action.type) {
        case SET_PAGINATION: {
            const {
                type,
                ...args
            } = action;
            return { ...state, ...args[0] };
        }
        case OPEN_NEWGROUP_MODAL: {
            return {
                ...state,
                isNewGroup: action.isNewGroup
            };
        }
        case OPEN_EDIT_GROUP_MODAL: {
            return {
                ...state,
                isOpenEdit: action.isOpenEdit,
                editGroup: action.editGroup
            };
        }
        case OPEN_DELETE_MODAL: {
            return {
                ...state,
                isOpenDelete: action.isOpenDelete
            };
        }
        default:
            return state;
    }
};

export default null;
