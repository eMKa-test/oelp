import React, { memo } from "react";
import * as PropTypes from "prop-types";
import "./style.css";

const RegisterLoader = ({ color }) => (
    <div className={`register-loader ${color === "primary" ? "primary" : ""}`}>
        <div />
        <div />
    </div>
);

RegisterLoader.propTypes = {
    color: PropTypes.string,
};

export default memo(RegisterLoader);
