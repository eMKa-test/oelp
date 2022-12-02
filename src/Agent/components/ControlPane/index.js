import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Input } from "reactstrap";
import { bindActionCreators } from "redux";
import Logs from "../Logs";
import HangedUploads from "../HangedUploads";
import AuthDropdown from "./AuthDropdown";
import { toggleUploadChunk } from "../../store/actionsCreator/appActions";
import wifiIcon from "../../assets/wifiIcon.svg";
import "./style.css";

const chunkModeTitle = "Включить, если скорость интернета низкая";

const ControlPane = (props) => {
    const {
        loading,
        chunkMode,
        toggleChunk,
    } = props;

    return (
        <div className="control-panel__wrapper">
            <Button
                disabled={loading}
                title={chunkModeTitle}
                color="light"
                className="reset-bootstrap-button-styles chunk-mode__button"
                onClick={toggleChunk}>
                <Input
                    disabled={loading}
                    addon
                    onChange={() => false}
                    type="checkbox"
                    checked={chunkMode} />
                <img
                    src={wifiIcon}
                    alt="wifi-icon" />
            </Button>
            <Logs />
            <HangedUploads disabled={loading} />
            <AuthDropdown />
        </div>
    );
};

ControlPane.propTypes = {
    loading: PropTypes.bool.isRequired,
    chunkMode: PropTypes.bool.isRequired,
    toggleChunk: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    chunkMode: store.app.chunkMode,
    loading: store.upload.load,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    toggleChunk: toggleUploadChunk,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ControlPane));
