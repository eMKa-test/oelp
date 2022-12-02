import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import {
    Button, Col, Collapse, Input, Row, InputGroupAddon, InputGroup,
} from "reactstrap";
import { toast } from "react-toastify";

const CreateMarkers = (props) => {
    const {
        markersLen,
        disabledControl,
        createMarkers,
        submitLoad,
        onSave,
        stage,
        showDefaultMarkers,
    } = props;
    const minCount = 1;
    const maxCount = (markersLen && 300 - markersLen) || 300;
    const [openCreateMarkers, setOpenCreateMarkers] = useState(false);
    const [countMarkers, setCountMarkers] = useState(minCount);

    useEffect(() => {
        if (openCreateMarkers && !showDefaultMarkers) {
            setOpenCreateMarkers(false);
        }
    }, [showDefaultMarkers, openCreateMarkers]);

    const onChange = useCallback(({ target: { value } }) => {
        setCountMarkers(Number(value));
    }, []);

    const checkCountOnBlur = useCallback(({ target: { value } }) => {
        if (Number(value) > maxCount) {
            setCountMarkers(maxCount);
        } else if (Number(value) < 1) {
            setCountMarkers(minCount);
        } else {
            setCountMarkers(Number(value));
        }
    }, [maxCount]);

    const onCreate = useCallback(() => {
        if (typeof createMarkers === "function") {
            if (countMarkers > maxCount || countMarkers < minCount) {
                return toast.error(`от ${minCount} до ${maxCount} маркеров`, { autoClose: 4000 });
            }
            return createMarkers(countMarkers, () => {
                setCountMarkers(1);
            });
        }
        return null;
    }, [countMarkers, createMarkers, maxCount]);

    const _onSave = useCallback((val) => () => {
        onSave(val);
    }, [onSave, stage]);

    return (
        <Col
            xs={12}
            className="row_control">
            <Row className="flex-grow-1">
                <Col
                    xs={12}>
                    <Button
                        disabled={disabledControl || !showDefaultMarkers}
                        title={!showDefaultMarkers ? "Нажать на левый глаз для добавления маркеров" : "Добавить маркеры"}
                        onClick={() => setOpenCreateMarkers(!openCreateMarkers)}
                        className="create-markers__collapse">
                        Добавить маркеры
                        <i className="fa fa-chevron-down" />
                    </Button>
                </Col>
                <Col
                    xs={12}
                    className="collapse-container text-center">
                    <Collapse isOpen={openCreateMarkers}>
                        <InputGroup className="mt-3 mb-2">
                            <Input
                                className="text-center"
                                onBlur={checkCountOnBlur}
                                onChange={onChange}
                                min={minCount}
                                max={maxCount}
                                value={countMarkers}
                                title="Количество маркеров по умолчанию"
                                type="number" />
                            <InputGroupAddon addonType="append">
                                <Button
                                    disabled={disabledControl}
                                    color="primary"
                                    title="Добавить"
                                    onClick={onCreate}>
                                    Добавить
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Collapse>
                    <Button
                        title="Сохранить изменённое плоложение дефолтных маркеров (фиолетовые)"
                        disabled={submitLoad || disabledControl}
                        className="control__button button button-default-points"
                        color={submitLoad ? "light" : "primary"}
                        onClick={_onSave(true)}>
                        Задать по умолчанию
                    </Button>
                </Col>
            </Row>
        </Col>
    );
};

CreateMarkers.propTypes = {
    markersLen: PropTypes.number,
    disabledControl: PropTypes.bool.isRequired,
    createMarkers: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    submitLoad: PropTypes.bool.isRequired,
    showDefaultMarkers: PropTypes.bool.isRequired,
};

export default memo(CreateMarkers);
