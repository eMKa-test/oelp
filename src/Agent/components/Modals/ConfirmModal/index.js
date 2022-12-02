import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { connect } from "react-redux";
import "./style.css";

const timeout = 150;

const ConfirmModal = (props) => {
    const {
        open,
        toggle,
        submit = () => {
        },
        title = "Подтверждение действий",
        bodyTitle = "",
        loading,
        submitTitle = "Выйти",
    } = props;

    const bodyText = loading
        ? "Не все загрузки завершены! Если продолжите - часть контента не будет загружена!"
        : bodyTitle;

    const onSubmit = useCallback(() => {
        toggle();
        submit();
    }, [submit, toggle]);

    return (
        <Modal
            backdropTransition={{ timeout }}
            modalTransition={{ timeout }}
            isOpen={open}
            toggle={toggle}
            className={`agent__modal-confirm ${loading ? "status__warning" : ""}`}>
            <ModalHeader>
                {title}
            </ModalHeader>
            {bodyText ? (
                <ModalBody>
                    {bodyText}
                </ModalBody>
            ) : null}
            <ModalFooter>
                <Button
                    className="modal-confirm__cancel-button"
                    type="button"
                    onClick={toggle}>
                    Отмена
                </Button>
                {" "}
                <Button
                    className="modal-confirm__submit-button ml-2"
                    type="button"
                    onClick={onSubmit}>
                    {loading ? "Всё равно перейти" : submitTitle}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

ConfirmModal.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    toggle: PropTypes.func,
    submit: PropTypes.func,
    title: PropTypes.string,
    bodyTitle: PropTypes.string,
    submitTitle: PropTypes.string,
};

const mapStateToProps = (store) => ({
    loading: store.upload.load,
});

export default connect(mapStateToProps)(memo(ConfirmModal));
