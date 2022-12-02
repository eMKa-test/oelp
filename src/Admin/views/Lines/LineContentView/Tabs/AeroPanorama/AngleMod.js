import React from "react";
import * as PropTypes from "prop-types";
import {
    InputGroup, InputGroupAddon, InputGroupText, ButtonGroup, Button,
} from "reactstrap";
import angleIcon from "../../../../../assets/icons/angleIcon.svg";

function AngleMod({
    panoramEditMode,
    onCancel,
    onSubmit,
    setPanoramaEdit,
    baseAngel,
    correctAngel,
}) {
    if (panoramEditMode) {
        return (
            <div className="mb-2">
                <InputGroup>
                    <Button
                        outline
                        color="warning"
                        onClick={onCancel}>
                        Отменить
                    </Button>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <img
                                style={{
                                    width: "13px",
                                    marginRight: "5px",
                                }}
                                src={angleIcon}
                                alt="angle-icon" />
                            {`${baseAngel} / ${correctAngel}`}
                        </InputGroupText>
                    </InputGroupAddon>
                    <Button
                        color="primary"
                        onClick={onSubmit}>
                        Применить
                    </Button>
                </InputGroup>
            </div>
        );
    }
    return (
        <div className="mb-2">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <img
                            style={{
                                width: "13px",
                                marginRight: "5px",
                            }}
                            src={angleIcon}
                            alt="angle-icon" />
                        {baseAngel}
                        {"°"}
                    </InputGroupText>
                </InputGroupAddon>
                <ButtonGroup>
                    <Button
                        color="primary"
                        outline
                        onClick={setPanoramaEdit}
                        active={panoramEditMode}>
                        Коррекция панорамы
                    </Button>
                </ButtonGroup>
            </InputGroup>
        </div>
    );
}

AngleMod.propTypes = {
    panoramEditMode: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    setPanoramaEdit: PropTypes.func,
    baseAngel: PropTypes.number,
    correctAngel: PropTypes.number,
    contentAngle: PropTypes.number,
    currentContentEdit: PropTypes.object,
};

export default React.memo(AngleMod);
