import React, { memo } from "react";
import "./style.css";

const CardLoader = () => (
    <div className="card-spinner">
        <div className="card-spinner-inner card-spinner-one" />
        <div className="card-spinner-inner card-spinner-two" />
        <div className="card-spinner-inner card-spinner-three" />
    </div>
);

export default memo(CardLoader);
