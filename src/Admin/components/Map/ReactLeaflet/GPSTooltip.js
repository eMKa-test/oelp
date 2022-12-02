import React, {
    memo, useEffect, useState, useCallback,
} from "react";
import { Button } from "reactstrap";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import { toast } from "react-toastify";

const GPSTooltip = ({ coords, onCancel }) => {
    const [open, setOpen] = useState(false);
    const left = get(coords, "x", 0);
    const top = get(coords, "y", 0);

    useEffect(() => {
        if (coords && !open) {
            setOpen(true);
        }
    }, [coords]);

    const hideToolTip = useCallback(() => {
        setOpen(false);
        if (typeof onCancel === "function") {
            setTimeout(onCancel, 150);
        }
    }, [onCancel]);

    const onCopy = useCallback(() => {
        const parent = document.querySelector(".correct-map__wrapper");
        const input = document.createElement("input");
        input.value = `${coords.lat}, ${coords.lng}`;
        input.style.visiblity = "hidden";
        input.style.position = "absolute";
        input.style.left = "50%";
        input.style.top = "50%";
        parent.append(input);
        input.focus();
        input.select();
        const copied = document.execCommand("copy");
        if (copied) {
            toast.success("Кооординаты скопированы");
        } else {
            toast.error("Непонятная ошибка", { autoClose: 4000 });
        }
        input.remove();
    }, [coords]);

    return (
        <div
            style={{ left: `${left - 243}px`, top: `${top - 121}px` }}
            className={`gps-info__wrapper ${open ? "show-info" : "hide-info"}`}>
            <button
                onClick={hideToolTip}
                className="gps-info__button"
                type="button">
                <i className="fa fa-times" />
            </button>
            <p className="gps-info__item">
                <span className="title">
                    Широта:
                </span>
                <span className="coords">{coords?.lat}</span>
            </p>
            <p className="gps-info__item">
                <span className="title">
                    Долгота:
                </span>
                <span className="coords">{coords?.lng}</span>
            </p>
            <div style={{ textAlign: "right" }}>
                <Button
                    color="primary"
                    outline
                    title="Скопировать координаты"
                    onClick={onCopy}>
                    <i className="fa fa-clone" />
                </Button>
            </div>
        </div>
    );
};

GPSTooltip.propTypes = {
    coords: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    onCancel: PropTypes.func.isRequired,
};

export default memo(GPSTooltip);
