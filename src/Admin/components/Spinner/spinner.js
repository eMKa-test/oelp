import React from "react";
import "./spinner.css";

export const Spinner = () => {
    return (
        <div className="spinner">
            <div className="spinner-double-ring mx-auto d-table ">
                <div className="spinner-content">
                    <div />
                    <div />
                    <div>
                        <div />
                    </div>
                    <div>
                        <div />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Spinner;
