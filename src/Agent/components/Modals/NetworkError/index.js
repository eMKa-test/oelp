import React, { memo } from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Modal,
    ModalFooter,
    ModalBody,
    ModalHeader,
} from "reactstrap";
import "./style.css";
import networkErrorIconWhite from "../../../assets/networkErrorIcon-light.svg";

const timeout = 150;

const NetworkErrorModal = (props) => {
    const {
        open,
        toggle,
    } = props;

    return (
        <Modal
            backdropTransition={{ timeout }}
            modalTransition={{ timeout }}
            isOpen={open}
            toggle={toggle}
            className="agent__modal-network">
            <ModalHeader>
                Отсутствует интернет соединение
                <img
                    width={30}
                    src={networkErrorIconWhite}
                    alt="network-error" />
            </ModalHeader>
            <ModalBody>
                Проверьте подключение и повторите загрузку файлов.
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    className="modal-network__submit-button ml-2"
                    type="button"
                    onClick={toggle}>
                    Ок
                </Button>
            </ModalFooter>
        </Modal>
    );
};

NetworkErrorModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func,
};

export default memo(NetworkErrorModal);
