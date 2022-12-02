import React, { memo, useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import DatePane from "../components/DatePane";
import ControlPane from "../components/ControlPane";
import networkErrorIcon from "../assets/networkErrorIcon.svg";
import NetworkErrorModal from "../components/Modals/NetworkError";

const Header = ({ networkError }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (networkError) {
            setOpen(true);
        }
    }, [networkError]);

    return (
        <header>
            <div className="header">
                <DatePane />
                {networkError && (
                    <img
                        title="интернет отсутсвует"
                        width={40}
                        src={networkErrorIcon}
                        alt="network-error" />
                )}
                <ControlPane />
            </div>
            <NetworkErrorModal
                open={open}
                toggle={() => setOpen(false)} />
        </header>
    );
};

Header.propTypes = {
    networkError: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    networkError: store.upload.networkError,
});

export default connect(mapStateToProps)(memo(Header));
