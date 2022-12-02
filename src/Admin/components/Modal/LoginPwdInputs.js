import React, { useState } from "react";
import * as PropTypes from "prop-types";
import { FormGroup, Input, Label } from "reactstrap";
import showPwdIcon from "../../assets/icons/showPassword.svg";
import hidePwdIcon from "../../assets/icons/hidePassword.svg";

const LoginPwdInputs = ({ email, pwdChkErr, autoComplete }) => {
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);

    return (
        <React.Fragment>
            <FormGroup>
                <Label htmlFor="email">логин (e-mail)</Label>
                <Input
                    type="text"
                    id="email"
                    placeholder="Введите e-mail"
                    defaultValue={email} />
            </FormGroup>
            <FormGroup className="modal-user-password">
                <Label htmlFor="password">новый пароль</Label>
                <Input
                    autoComplete={autoComplete}
                    type={showPwd ? "text" : "password"}
                    id="password" />
                <button
                    type="button"
                    className="btn_like_div toggle-password"
                    onClick={() => setShowPwd(!showPwd)}>
                    <img
                        src={showPwd ? hidePwdIcon : showPwdIcon}
                        alt="icon-pwd" />
                </button>
            </FormGroup>
            <FormGroup className="modal-user-password">
                <Label htmlFor="pwdChk">повторите пароль</Label>
                <Input
                    autoComplete={autoComplete}
                    type={showCPwd ? "text" : "password"}
                    id="pwdChk" />
                <button
                    type="button"
                    className="btn_like_div toggle-password"
                    onClick={() => setShowCPwd(!showCPwd)}>
                    <img
                        src={showCPwd ? hidePwdIcon : showPwdIcon}
                        alt="icon-pwd" />
                </button>
                {pwdChkErr && (
                    <span className="invalid-feedback d-inline-block">пароли не совпадают</span>
                )}
            </FormGroup>
        </React.Fragment>
    );
};

LoginPwdInputs.propTypes = {
    email: PropTypes.string,
    pwdChkErr: PropTypes.bool,
    autoComplete: PropTypes.string,
};

export default LoginPwdInputs;
