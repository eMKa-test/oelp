import React, { memo, useState, useCallback } from "react";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import {
    DropdownToggle, DropdownItem, DropdownMenu, ButtonDropdown,
} from "reactstrap";
import "./style.css";
import { toast } from "react-toastify";
import { postData } from "../../../../api";
import ConfirmModal from "../../Modals/ConfirmModal";

const AuthDropdown = (props) => {
    const { user } = props;
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [confirmRedirect, setConfirmRedirect] = useState(false);
    const isAdmin = user?.kind === "SUPER";

    const logOut = useCallback(() => {
        postData({
            mainUrl: "/api/logout",
        })
            .then((res) => {
                if (res.success) {
                    window.location.href = "/";
                } else {
                    toast.error("Ошибка", { autoClose: 4000 });
                }
            })
            .catch((err) => {
                console.warn(err);
                toast.error("Ошибка", { autoClose: 4000 });
            });
    }, []);

    const redirectToAdmin = useCallback(() => {
        window.location.href = "/admin";
    }, []);

    return (
        <div className="auth-dropdown__wrapper">
            <ButtonDropdown
                isOpen={open}
                toggle={() => setOpen(!open)}>
                <DropdownToggle
                    color="light"
                    split>
                    <span className="mr-2">
                        <i className="fa fa-user-o" />
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>
                        {user?.email}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                        onClick={() => setConfirmRedirect(true)}
                        disabled={!isAdmin}>
                        <i className="fa fa-external-link" />
                        В админку
                    </DropdownItem>
                    <DropdownItem onClick={() => setConfirm(true)}>
                        <i className="fa fa-sign-out" />
                        Выйти
                    </DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
            <ConfirmModal
                title="Подтверждение выхода из учетной записи"
                open={confirm}
                toggle={() => setConfirm(false)}
                submit={logOut} />
            <ConfirmModal
                title="Подтверждение перехода на другую страницу"
                submitTitle="Перейти"
                open={confirmRedirect}
                toggle={() => setConfirmRedirect(false)}
                submit={redirectToAdmin} />
        </div>
    );
};

AuthDropdown.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string,
        kind: PropTypes.string,
    }),
};

const mapStateToProps = (store) => ({
    user: store.app.user,
});

export default connect(mapStateToProps)(memo(AuthDropdown));
