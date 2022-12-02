import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./style.css";
import { bindActionCreators } from "redux";
import ItemCard from "./ItemCard";
import { addOldFiles } from "../../../store/actionsCreator/uploadActions";

const timeout = 150;

const HangedUploads = (props) => {
    const {
        open,
        toggle,
        lines,
        contentSets,
        oldFiles,
        addFiles,
    } = props;
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (open) {
            setFiles([...oldFiles]);
        }
        return () => {
            setFiles([]);
        };
    }, [open, oldFiles]);

    const removeFile = useCallback((file) => {
        const _files = files.filter((f) => f.fileId !== file.id);
        setFiles(_files);
    }, [files]);

    const onSubmit = useCallback(() => {
        addFiles(files);
        toggle();
    }, [toggle, files]);

    const onCancel = useCallback(() => {
        toggle();
    }, [toggle]);

    const addFile = useCallback((fileSet) => {
        const result = [...files, fileSet];
        setFiles(result);
    }, [files]);

    return (
        <Modal
            toggle={toggle}
            backdropTransition={{ timeout }}
            modalTransition={{ timeout }}
            isOpen={open}
            className="agent__modal-notify">
            <ModalHeader>
                Догрузка контента
            </ModalHeader>
            <ModalBody>
                <div className="body__wrapper">
                    {!isEmpty(contentSets) ? contentSets.map((set, i) => (
                        <ItemCard
                            removeFile={removeFile}
                            files={files}
                            addFiles={addFile}
                            line={lines.find((l) => l.id === set.lineId)}
                            key={String(i)}
                            set={set} />
                    )) : (
                        <p className="empty-list">Список пуст</p>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    className="modal-confirm__cancel-button"
                    type="button"
                    onClick={onCancel}>
                    Отмена
                </Button>
                {" "}
                <Button
                    className="modal-confirm__submit-button ml-2"
                    type="button"
                    onClick={onSubmit}>
                    Сохранить и выйти
                </Button>
            </ModalFooter>
        </Modal>
    );
};

HangedUploads.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    addFiles: PropTypes.func.isRequired,
    contentSets: PropTypes.arrayOf(PropTypes.shape({
        contentType: PropTypes.string,
        date: PropTypes.string,
        lineId: PropTypes.number,
    })),
    lines: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
    })),
    oldFiles: PropTypes.arrayOf(PropTypes.shape({
        file: PropTypes.instanceOf(File),
    })),
};

const mapStateToProps = (store) => ({
    contentSets: store.app.contentSets,
    lines: store.app.lines,
    oldFiles: store.upload.oldFiles,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addFiles: addOldFiles,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(HangedUploads));
