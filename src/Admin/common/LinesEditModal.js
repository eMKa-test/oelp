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

const EditModal = ({
    title = "Создание нового элемента",
    defaultName = "",
    defaultDescription = "",
    defaultLat = "",
    defaultLong = "",
    defaultPlanPoints = "",
    defaultPlanPhotos = "",
    defaultPlanVideos = "",
    defaultPlanPanoramas = "",
    defaultOrderWeight = "",
    mergeAero = false,
    isOpen,
    toggleModal,
    submit,
    withName = true,
    withAgentPlans = false,
    edit = false,
}) => (
    <Modal
        isOpen={isOpen}
        toggle={toggleModal}
        className="modal-primary">
        <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
        <Form onSubmit={submit}>
            <ModalBody>
                {withName && (
                    <FormGroup>
                        <Label htmlFor="name">Название</Label>
                        <Input
                            type="text"
                            id="name"
                            defaultValue={defaultName}
                            placeholder="Введите название"
                            required />
                    </FormGroup>
                )}
                <FormGroup>
                    <Label htmlFor="description">Описание</Label>
                    <Input
                        type="textarea"
                        id="description"
                        defaultValue={defaultDescription}
                        rows="7"
                        placeholder="Введите описание"
                        required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="orderWeight">Сортировка</Label>
                    <Input
                        type="number"
                        id="orderWeight"
                        defaultValue={defaultOrderWeight}
                        placeholder="Введите значение сортировки"
                        required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Широта</Label>
                    <Input
                        type="text"
                        id="lat"
                        defaultValue={defaultLat}
                        placeholder="Введите широту"
                        required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Долгота</Label>
                    <Input
                        type="text"
                        id="long"
                        defaultValue={defaultLong}
                        placeholder="Введите долготу"
                        required />
                </FormGroup>

                {withAgentPlans && (
                    <FormGroup>
                        <Label htmlFor="name">План по точкам</Label>
                        <Input
                            type="number"
                            id="planPoints"
                            min={0}
                            defaultValue={defaultPlanPoints}
                            placeholder="План по точкам"
                            required />
                    </FormGroup>
                )}

                {withAgentPlans && (
                    <FormGroup>
                        <Label htmlFor="name">План по фото на точке</Label>
                        <Input
                            type="number"
                            id="planPhotos"
                            min={0}
                            defaultValue={defaultPlanPhotos}
                            placeholder="План по фото"
                            required />
                    </FormGroup>
                )}

                {withAgentPlans && (
                    <FormGroup>
                        <Label htmlFor="name">План по видео на точке</Label>
                        <Input
                            type="number"
                            id="planVideos"
                            min={0}
                            defaultValue={defaultPlanVideos}
                            placeholder="План по видео"
                            required />
                    </FormGroup>
                )}

                {withAgentPlans && (
                    <FormGroup>
                        <Label htmlFor="name">План по панорамам на точке</Label>
                        <Input
                            type="number"
                            id="planPanoramas"
                            min={0}
                            defaultValue={defaultPlanPanoramas}
                            placeholder="План по панорамам"
                            required />
                    </FormGroup>
                )}
                <FormGroup check>
                    <Label
                        check
                        htmlFor="mergeAero">
                        <Input
                            type="checkbox"
                            defaultChecked={mergeAero}
                            id="mergeAero" />
                        Объединять аэросъемки в один файл
                    </Label>
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

EditModal.propTypes = {
    title: PropTypes.string,
    defaultName: PropTypes.string,
    defaultLat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultLong: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultPlanPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultPlanPhotos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultPlanVideos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultPlanPanoramas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultOrderWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultDescription: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    withAgentPlans: PropTypes.bool,
    mergeAero: PropTypes.bool,
    withName: PropTypes.bool,
    edit: PropTypes.bool,
};

export default EditModal;
