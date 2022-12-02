import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import { toast } from "react-toastify";
import DeleteModal from "../../common/DeleteModal";
import { postData } from "../../../api";
import avatar from "./assets/avatar.svg";
import "./style.css";

const PersonPanel = ({ operator }) => {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const onLogout = useCallback((e) => {
        e.preventDefault();
        postData({
            mainUrl: "/api/logout",
        }).then((res) => {
            if (res.success) {
                window.location.href = "/";
            } else {
                toast.error("Ошибка", { autoClose: 4000 });
            }
        }).catch((err) => {
            console.warn(err);
            toast.error("Ошибка", { autoClose: 4000 });
        });
    }, []);

    return (
        <div className="PersonPanel">
            <Dropdown
                className="dropdown"
                color="light"
                isOpen={open}
                toggle={() => setOpen(!open)}>
                <DropdownToggle
                    className="dropdown-button"
                    caret>
                    <span className="desktop-toggler">{operator.email}</span>
                    <img
                        className="tablet-toggler"
                        src={avatar}
                        alt="avatar" />
                </DropdownToggle>
                <DropdownMenu
                    right
                    style={{ right: "auto" }}>
                    <DropdownItem onClick={() => setConfirm(true)}>
                        <i className="fa fa-lock" />
                        <span>Выйти</span>
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => window.location.href = "/agent"}>
                        <i className="fa fa-download" />
                        <span>Агентская форма</span>
                    </DropdownItem>
                    <DropdownItem
                        disabled={__DEV__}
                        onClick={() => window.location.href = "/"}>
                        <i className="fa fa-home" />
                        <span>Вернуться на сайт</span>
                    </DropdownItem>
                </DropdownMenu>
                <DeleteModal
                    isConfirm
                    title="Подтверждение выхода из учетной записи"
                    isOpen={confirm}
                    submit={onLogout}
                    toggleModal={() => setConfirm(false)} />
            </Dropdown>
        </div>
    );
};

PersonPanel.propTypes = {
    operator: PropTypes.shape({
        email: PropTypes.string,
    }),
};

export default memo(PersonPanel);
