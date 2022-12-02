import React from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = () => ({
    bg: { backgroundImage: "none" },
    groupImage: null,
    editGroup: null,
});

const GroupEditModal = ({
    title = "Создание нового элемента",
    defaultName = "",
    defaultDescription = "",
    isOpen,
    defaultOrderWeight = "",
    toggleModal,
    defaultLat = "",
    defaultLong = "",
    objectId,
    updateObject,
    editGroup = null,
    edit = false,
}) => {
    const [state, setState] = React.useState({
        bg: { backgroundImage: "none" },
        groupImage: null,
        editGroup,
    });

    React.useEffect(() => {
        const result = {
            ...state,
            bg: {
                backgroundImage: editGroup?.image?.src || "none",
            },
        };
        setState(result);
    }, [edit]);

    React.useEffect(() => {
        if (!isOpen) {
            setState(initialState);
        }
    }, [isOpen]);

    const submit = (e) => {
        e.preventDefault();
        const group = {
            name: e.target.name.value,
            description: e.target.description.value,
            gps: {
                lat: Number(e.target.lat.value),
                long: Number(e.target.long.value),
            },
            orderWeight: e.target.orderWeight.value,
            projectId: objectId,
        };
        let method = "post";
        let url = "/admin/api/groups/";
        if (edit) {
            method = "put";
            url += editGroup.id;
        }
        axios[method](url, { ...group })
            .then(() => {
                const msg = edit ? "Изменения сохранны" : "Группа создана";
                toast.success(msg);
                updateObject(objectId);
                toggleModal();
                setState(initialState());
            })
            .catch((e) => {
                if (e.response.status === 409) {
                    toast.error("Данное имя группы уже существует. Выберите другое имя", { autoClose: 4000 });
                } else {
                    toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
                }
                toggleModal();
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
            <Form onSubmit={submit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="name">Название</Label>
                        <Input
                            name="name"
                            type="text"
                            id="name"
                            defaultValue={editGroup?.name || defaultName}
                            placeholder="Введите название"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Описание</Label>
                        <Input
                            name="description"
                            type="textarea"
                            id="description"
                            defaultValue={editGroup?.description || defaultDescription}
                            rows="3"
                            placeholder="Введите описание" />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="orderWeight">Сортировка</Label>
                        <Input
                            type="number"
                            id="orderWeight"
                            defaultValue={editGroup?.orderWeight || defaultOrderWeight}
                            placeholder="Введите значение сортировки"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="lat">Широта</Label>
                        <Input
                            name="lat"
                            type="text"
                            id="lat"
                            defaultValue={editGroup?.gps?.lat || defaultLat}
                            placeholder="Введите широту"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="long">Долгота</Label>
                        <Input
                            name="long"
                            type="text"
                            id="long"
                            defaultValue={editGroup?.gps?.long || defaultLong}
                            placeholder="Введите долготу"
                            required />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit">
                        {edit ? "Сохранить" : "Создать"}
                    </Button>
                    {" "}
                    <Button
                        color="secondary"
                        type="button"
                        onClick={toggleModal}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

GroupEditModal.propTypes = {
    title: PropTypes.string,
    defaultName: PropTypes.string,
    defaultDescription: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    defaultOrderWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultLat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultLong: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    objectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateObject: PropTypes.func,
    editGroup: PropTypes.shape({
        id: PropTypes.number,
    }),
};

export default GroupEditModal;
