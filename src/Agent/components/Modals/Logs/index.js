import React, { memo } from "react";
import * as PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { resetLogs } from "../../../store/actionsCreator/loggerActions";
import LogsList from "./List";
import "./style.css";

const timeout = 150;

const LogsModal = (props) => {
    const {
        open,
        toggle,
        log,
        clearLogs,
    } = props;

    return (
        <Modal
            backdropTransition={{ timeout }}
            modalTransition={{ timeout }}
            isOpen={open}
            toggle={toggle}
            className="agent__modal-logs">
            <ModalHeader>
                Логи
            </ModalHeader>
            <ModalBody>
                {isEmpty(log) ? (
                    <p className="logs-empty">Ни одной загрузки ещё не залогировано</p>
                ) : <LogsList log={log} />}
            </ModalBody>
            <ModalFooter>
                <Button
                    disabled={!log.length}
                    color="warning"
                    outline
                    className="modal-logs__clear-button"
                    onClick={clearLogs}>
                    Очистить
                </Button>
                <Button
                    className="modal-logs__close-button ml-2"
                    onClick={toggle}>
                    Закрыть
                </Button>
            </ModalFooter>
        </Modal>
    );
};

LogsModal.propTypes = {
    logs: PropTypes.shape({}),
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func,
    clearLogs: PropTypes.func,
    log: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (store) => ({
    log: JSON.parse(store.logs.log),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    clearLogs: resetLogs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(LogsModal));
