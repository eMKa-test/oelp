import React, {
    useEffect, useCallback, useState, useRef,
} from "react";
import * as PropTypes from "prop-types";
import {
    Button, Modal, ModalFooter, ModalHeader, Form, ModalBody,
} from "reactstrap";

const timeout = 150;

const bodyTextStyle = {
    fontSize: 16,
    fontWeight: 500,
};

const ConfirmTimerModal = (props) => {
    const {
        title = "Подтверждение удаления",
        isOpen,
        time = 3000,
        toggleModal,
        submit,
        bodyText,
        submitTitle = "Удалить",
    } = props;
    const [timerCount, setCanConfirm] = useState(time / 1000);
    const timerId = useRef(null);

    const confirmTimer = useCallback(() => {
        let count = 1;
        const startTimer = () => {
            timerId.current = setTimeout(() => {
                setCanConfirm(time / 1000 - count);
                count += 1;
                if (count <= time / 1000) {
                    clearTimeout(timerId.current);
                    startTimer();
                } else {
                    count = 0;
                    clearTimeout(timerId.current);
                }
            }, 1000);
        };
        startTimer();
    }, [time]);

    useEffect(() => {
        if (isOpen) {
            confirmTimer();
        }
        return () => {
            clearTimeout(timerId.current);
            timerId.current = null;
            setTimeout(() => {
                setCanConfirm(time / 1000);
            }, timeout);
        };
    }, [isOpen]);

    const onCancel = useCallback(() => {
        toggleModal();
    }, []);

    const onSubmit = useCallback((e) => {
        submit(e);
        toggleModal();
    }, [submit]);

    return (
        <Modal
            backdropTransition={{ timeout }}
            modalTransition={{ timeout }}
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
            <ModalBody>
                <div style={bodyTextStyle}>
                    {bodyText}
                </div>
            </ModalBody>
            <Form onSubmit={submit}>
                <ModalFooter>
                    <Button
                        onClick={onSubmit}
                        disabled={timerCount > 0}
                        color="primary"
                        type="submit">
                        {submitTitle}
                        &nbsp;
                        {timerCount > 0 && (
                            `(${timerCount}cек.)`
                        )}
                    </Button>
                    {" "}
                    <Button
                        color="secondary"
                        type="button"
                        onClick={onCancel}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

ConfirmTimerModal.propTypes = {
    time: PropTypes.number,
    title: PropTypes.string,
    submitTitle: PropTypes.string,
    bodyText: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

export default ConfirmTimerModal;
