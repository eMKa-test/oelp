import React, { memo, Fragment, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import HangedUploadsModal from "../Modals/HangedUploads";
import "./style.css";

const HangedUploads = (props) => {
    const {
        hoveredContent,
        disabled,
    } = props;
    const [open, setOpen] = useState(false);
    const active = hoveredContent > 0;

    return (
        <Fragment>
            <button
                disabled={disabled}
                title={active ? "Есть не догруженный контент" : "Не догруженного контента нет"}
                onClick={() => setOpen(true)}
                type="button"
                className={`btn_like_div notification__button ${active ? "active" : ""}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewBox="0 0 166 197"
                    xmlSpace="preserve">
                    <path
                        d="M82.8652955,196.898522 C97.8853137,196.898522 110.154225,184.733014 110.154225,169.792619 L55.4909279,169.792619 C55.4909279,184.733014 67.8452774,196.898522 82.8652955,196.898522 L82.8652955,196.898522 Z"
                        className="notification__button__bellClapper" />
                    <path
                        d="M146.189736,135.093562 L146.189736,82.040478 C146.189736,52.1121695 125.723173,27.9861651 97.4598237,21.2550099 L97.4598237,14.4635396 C97.4598237,6.74321823 90.6498186,0 82.8530327,0 C75.0440643,0 68.2462416,6.74321823 68.2462416,14.4635396 L68.2462416,21.2550099 C39.9707102,27.9861651 19.5163297,52.1121695 19.5163297,82.040478 L19.5163297,135.093562 L0,154.418491 L0,164.080956 L165.706065,164.080956 L165.706065,154.418491 L146.189736,135.093562 Z"
                        className="notification__button__bell" />
                </svg>
                <span className={`notification__badge ${active ? "active" : ""}`}>{hoveredContent}</span>
            </button>
            <HangedUploadsModal
                toggle={() => setOpen(!open)}
                open={open} />
        </Fragment>
    );
};

HangedUploads.propTypes = {
    hoveredContent: PropTypes.number,
    disabled: PropTypes.bool,
};

const mapStateToProps = (store) => ({
    hoveredContent: store.app.contentSets.length,
});

export default connect(mapStateToProps, null)(memo(HangedUploads));
