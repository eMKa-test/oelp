import React from "react";
import * as PropTypes from "prop-types";
import {
    Button, Modal, ModalFooter, ModalHeader, Form,
} from "reactstrap";

class DeleteModal extends React.Component {
    del = React.createRef();

    componentDidUpdate() {
        if (this.props.isOpen) {
            const ref = this.del;
            setTimeout(() => ref.current && ref.current.focus(), 100);
        }
    }

    render() {
        const {
            title = "Точно удалить?",
            isOpen,
            toggleModal,
            submit,
            isConfirm,
        } = this.props;
        return (
            <Modal
                unmountOnClose
                fade={false}
                isOpen={isOpen}
                toggle={toggleModal}
                className="modal-primary">
                <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
                <Form onSubmit={submit}>
                    <ModalFooter>
                        <Button
                            color="primary"
                            type="submit"
                            innerRef={this.del}>
                            {isConfirm ? "Выйти" : "Удалить"}
                        </Button>
                        {" "}
                        <Button
                            color="secondary"
                            type="button"
                            onClick={toggleModal}
                            tabIndex="2">
                            Отмена
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

DeleteModal.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    isConfirm: PropTypes.bool,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

export default DeleteModal;
