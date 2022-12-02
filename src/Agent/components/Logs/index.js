import React, {
    memo, Fragment, useState,
} from "react";
import LogsModal from "../Modals/Logs";
import "./style.css";

const LogsButton = () => {
    const [open, setOpen] = useState(false);
    const active = false;

    return (
        <Fragment>
            <button
                title="Логи"
                onClick={() => setOpen(true)}
                type="button"
                className={`btn_like_div hanged-uploads__button ${active ? "active" : ""}`}>
                <i className="fa fa-clock-o" />
            </button>
            <LogsModal
                open={open}
                toggle={() => setOpen(false)} />
        </Fragment>
    );
};

export default memo(LogsButton);
