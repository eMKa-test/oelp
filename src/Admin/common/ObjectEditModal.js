import React, { useState, useEffect } from "react";
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
    CustomInput,
    Label,
} from "reactstrap";
import { substr } from "../../utils/helpers";

const ObjectEditModal = ({
    isOpen,
    defaultName,
    defaultDescription,
    defaultLat,
    defaultLong,
    defaultOrderWeight,
    defaultAuditRatio,
    defaultProjectStatus,
    toggleModal,
    submit,
    companies,
    project,
    setAccessCompanies,
}) => {
    const initialState = project.companies || [];
    const [projectCompanies, setprojectCompanies] = useState(initialState);
    const [range, setRange] = useState(defaultAuditRatio);

    const handleChange = (id) => ({ target: { checked } }) => {
        if (checked) {
            const result = [
                ...projectCompanies,
                id,
            ];
            setprojectCompanies(
                result.sort((a, b) => a - b),
            );
        } else {
            setprojectCompanies(projectCompanies.filter((comp) => comp !== id));
        }
    };

    const handleChangeRange = ({ target: { value } }) => {
        setRange(Number(value));
    };

    useEffect(() => {
        setAccessCompanies(projectCompanies);
    }, [projectCompanies]);

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>
                Редактирование объекта
            </ModalHeader>
            <Form onSubmit={submit}>
                <ModalBody className="modal-body__object-edit">
                    <FormGroup>
                        <Input
                            defaultValue={defaultProjectStatus}
                            name="projectStatus"
                            type="select">
                            <option
                                value="ACTIVE">
                                Активный
                            </option>
                            <option
                                value="INACTIVE">
                                Неактивный
                            </option>
                        </Input>
                    </FormGroup>
                    <p>Принадлежность объекта к компании:</p>
                    <div className="access-checks-container mb-4">
                        {
                            companies.map((el) => (
                                <FormGroup
                                    key={el.id}
                                    className="mb-0 select-access">
                                    <Label
                                        className="mb-0"
                                        style={{
                                            width: "100%",
                                            paddingLeft: "1rem",
                                        }}
                                        htmlFor={`${el.id}checks`}>
                                        {substr(el.name, 30)}
                                    </Label>
                                    <Input
                                        checked={projectCompanies.includes(el.id)}
                                        id={`${el.id}checks`}
                                        type="checkbox"
                                        onChange={handleChange(el.id)} />
                                </FormGroup>
                            ))
                        }
                    </div>
                    <FormGroup>
                        <Label htmlFor="name">Название</Label>
                        <Input
                            type="text"
                            id="name"
                            defaultValue={defaultName}
                            placeholder="Введите название"
                            required />
                    </FormGroup>
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
                    <FormGroup>
                        <Label
                            htmlFor="auditRatio"
                            className="mb-0">
                            {
                                `Аудит: ${range}%`
                            }
                        </Label>
                        <CustomInput
                            onChange={handleChangeRange}
                            defaultValue={defaultAuditRatio}
                            type="range"
                            id="auditRatio"
                            name="auditRatio" />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit">
                        Сохранить
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

ObjectEditModal.propTypes = {
    defaultName: PropTypes.string,
    defaultDescription: PropTypes.string,
    defaultProjectStatus: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setAccessCompanies: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    defaultLong: PropTypes.number,
    defaultLat: PropTypes.number,
    companies: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    defaultOrderWeight: PropTypes.number,
    defaultAuditRatio: PropTypes.number,
};

export default ObjectEditModal;
