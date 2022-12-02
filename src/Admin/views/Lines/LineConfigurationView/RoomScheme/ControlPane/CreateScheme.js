import React, {
    memo, useState, useCallback, useRef,
} from "react";
import * as PropTypes from "prop-types";
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Spinner,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { deleteLineScheme, uploadLineScheme } from "../../../../../store/actionCreators/linesActions";
import ErrorBoundary from "../../../../../common/ErrorBoundary";
import DeleteModal from "../../../../../common/DeleteModal";

const CreateScheme = (props) => {
    const {
        lineId,
        contentType,
        selectedScheme,
        deleteScheme,
        uploadScheme,
    } = props;
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [file, setFile] = useState(null);
    const [load, setLoad] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [previewBg, setPreviewBg] = useState(null);
    const dropzoneRef = useRef(null);

    const onDeleteScheme = useCallback((e) => {
        e.preventDefault();
        deleteScheme(selectedScheme.id, () => setConfirmDelete(false));
    }, [selectedScheme]);

    const onDropScheme = useCallback((dropFiles) => {
        let _file;
        if (Array.isArray(dropFiles)) {
            if (dropFiles.length > 1) {
                return toast.error("Доступна загрузка только одной схемы", { autoClose: 4000 });
            }
            [_file] = dropFiles;
        }
        const fr = new FileReader();
        fr.onload = ({ target }) => {
            setPreviewBg(target.result);
        };
        fr.readAsDataURL(_file);
        setFile(_file);
    }, [date]);

    const onChangeDate = useCallback(({ target: { value } }) => {
        setDate(value);
    }, []);

    const onCancel = useCallback(() => {
        setFile(null);
        setDate(null);
        setOpen(false);
    }, []);

    const onLoad = useCallback(() => {
        setLoad(true);
        return uploadScheme({
            contentType,
            date,
            lineId,
            file,
            callback: () => {
                setLoad(false);
                onCancel();
            },
        });
    }, [file, date]);

    return (
        <div className="create-scheme__wrapper">
            <div className="create-panel__toggle">
                <Button
                    title="Добавить схему"
                    className="reset-bootstrap-button-styles mr-2"
                    color="success"
                    onClick={() => setOpen(true)}>
                    <i className="fa fa-plus" />
                </Button>
                {selectedScheme && (
                    <Button
                        outline
                        onClick={() => setConfirmDelete(true)}
                        color="danger">
                        <i className="fa fa-trash" />
                    </Button>
                )}
            </div>
            <Modal
                isOpen={open}
                className="modal-primary modal-create-scheme">
                <ModalHeader toggle={() => setOpen(false)}>
                    Добавление новой схемы
                </ModalHeader>
                <ModalBody>
                    <div className="create-panel">
                        <FormGroup>
                            <Input
                                className="date"
                                type="date"
                                max={moment()
                                    .format("YYYY-MM-DD")}
                                onChange={onChangeDate} />
                        </FormGroup>
                        <FormGroup>
                            <Dropzone
                                disabled={load}
                                ref={dropzoneRef}
                                className="scheme-dropzone"
                                activeClassName="scheme-dropzone--active"
                                acceptClassName="scheme-dropzone--accept"
                                rejectClassName="scheme-dropzone--reject"
                                accept="image/png"
                                onDrop={onDropScheme}>
                                {!file ? (
                                    <span className="title">Загрузить (PNG)</span>
                                ) : (
                                    <div
                                        style={{ backgroundImage: `url(${previewBg})` }}
                                        className="bg-overlay" />
                                )}
                                {load && (
                                    <Spinner
                                        className="position-absolute"
                                        color="primary" />
                                )}
                            </Dropzone>
                        </FormGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        title="Отменить"
                        className="reset-bootstrap-button-styles flex-grow-1"
                        color="light"
                        onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button
                        title="Загрузить"
                        disabled={!date || !file}
                        className="reset-bootstrap-button-styles ml-2 flex-grow-1"
                        color="primary"
                        onClick={onLoad}>
                        Загрузить
                    </Button>
                </ModalFooter>
            </Modal>
            <ErrorBoundary>
                <DeleteModal
                    submit={onDeleteScheme}
                    toggleModal={() => setConfirmDelete(!confirmDelete)}
                    title="Подтверждение удаления схемы"
                    isOpen={confirmDelete} />
            </ErrorBoundary>
        </div>
    );
};

CreateScheme.propTypes = {
    selectedScheme: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    deleteScheme: PropTypes.func.isRequired,
    uploadScheme: PropTypes.func.isRequired,
    lineId: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    deleteScheme: deleteLineScheme,
    uploadScheme: uploadLineScheme,
}, dispatch);

export default connect(null, mapDispatchToProps)(memo(CreateScheme));
