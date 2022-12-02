import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input,
} from "reactstrap";

const SubmitPane = (props) => {
    const {
        dots,
        onSavePoints,
        setDots,
        defaultCoords,
    } = props;
    const [open, setOpen] = useState(false);
    const [markers, setMarkers] = useState(1);

    const onChange = useCallback(({ target: { value } }) => {
        setMarkers(Number(value));
    }, [dots, defaultCoords]);

    const onClick = useCallback(() => {
        const newDots = [...dots, ...Array(markers)].map((m, i) => ({
            pointId: i + 1,
            schemePoint: m?.schemePoint ? { ...m.schemePoint } : { ...defaultCoords },
        }));
        setDots([...newDots]);
        setOpen(false);
        setMarkers(1);
    }, [dots, defaultCoords, markers]);

    return (
        <div className="submit-pane__wrapper">
            <Dropdown
                color="primary"
                isOpen={open}
                toggle={() => setOpen(!open)}>
                <DropdownToggle
                    color="primary"
                    caret>
                    Добавить маркеры
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem
                        header
                        tag="div"
                        className="dropdown-item__unClick">
                        <Input
                            value={markers}
                            min={1}
                            max={1000}
                            onChange={onChange}
                            type="number" />
                        <Button
                            onClick={onClick}
                            color="success">
                            <span className="fa fa-check text-light" />
                        </Button>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button
                title="Сохранить"
                onClick={onSavePoints}
                color="success"
                className="reset-bootstrap-button-styles save-points ml-2">
                Сохранить
            </Button>
        </div>
    );
};

SubmitPane.propTypes = {
    onSavePoints: PropTypes.func.isRequired,
    setDots: PropTypes.func.isRequired,
    selectedScheme: PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
    }),
    defaultCoords: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    dots: PropTypes.arrayOf(PropTypes.shape({
        pointId: PropTypes.number,
        schemePoint: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    })),
};

export default memo(SubmitPane);
