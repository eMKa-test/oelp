import React, {
    memo, useCallback, useEffect, useState, Fragment,
} from "react";
import * as PropTypes from "prop-types";
import {
    Button, Row, Col, Collapse, Spinner,
} from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { getLineByID } from "../../../../store/actionCreators/linesActions";
import { fetchData, delData } from "../../../../../api";
import DeleteModal from "../../../../common/DeleteModal";
import "./style.css";

const AgentLineScheme = ({
    line,
    updateLine,
}) => {
    const [load, setLoad] = useState(false);
    const [bg, setBg] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        setBg(line.agentImage?.src || null);
    }, [line.agentImage]);

    const onDrop = useCallback(([file]) => {
        if (file) {
            const url = `/admin/api/lines/${line.id}/agentImage`;
            const body = new FormData();
            body.append("file", file);
            fetchData({
                url,
                method: "post",
                body,
            })
                .then(() => {
                    updateLine({
                        objectID: line.projectId,
                        id: line.id,
                    });
                    toast.success("Схема добавлена ффывфыв");
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Ошибка", { autoClose: 4000 });
                })
                .finally(() => setLoad(false));
        }
    }, [line]);

    const onDelete = useCallback((e) => {
        e.preventDefault();
        setLoad(true);
        const url = `/admin/api/lines/${line.id}/agentImage`;
        delData(url)
            .then(() => {
                toast.success("Схема удалена");
                updateLine({
                    objectID: line.projectId,
                    id: line.id,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Ошибка", { autoClose: 4000 });
            })
            .finally(() => {
                setDeleteConfirm(false);
                setLoad(false);
            });
    }, [line]);

    return (
        <Fragment>
            <Row>
                <Col
                    xs={12}>
                    <div className="agent-scheme__wrapper">
                        <div className="agent-scheme__dropzone">
                            <Dropzone
                                disabled={load}
                                title="Загрузить схему"
                                className="imageUpload layer-dropzone"
                                activeClassName="imageUpload--active"
                                acceptClassName="imageUpload--accept"
                                rejectClassName="imageUpload--reject"
                                accept="image/*"
                                onDrop={onDrop}>
                                <div
                                    style={{ backgroundImage: `url(${bg})` }}
                                    className="agent-scheme__dropzone overlay" />
                                {!line.agentImage && (
                                    <span>
                                        Загрузить
                                        {" "}
                                        схему
                                    </span>
                                )}
                                {load && (
                                    <Spinner
                                        className="agent-scheme__loader"
                                        color="primary" />
                                )}
                            </Dropzone>
                        </div>
                        {line.agentImage && (
                            <Button
                                className="ml-3"
                                onClick={() => setDeleteConfirm(true)}
                                color="danger">
                                <i className="fa fa-trash" />
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
            <DeleteModal
                submit={onDelete}
                toggleModal={() => setDeleteConfirm(false)}
                isOpen={deleteConfirm}
                title="Подтверждение удаления схемы" />
        </Fragment>
    );
};

AgentLineScheme.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.number,
        agentImage: PropTypes.shape({
            src: PropTypes.string,
        }),
    }),
    updateLine: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateLine: getLineByID,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(AgentLineScheme));
