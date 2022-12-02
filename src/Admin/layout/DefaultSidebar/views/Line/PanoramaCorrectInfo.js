import React, { memo } from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { togglePanoramaMouseControl } from "../../../../store/actionCreators/panoramaActions";
import { keys } from "./helpers";

const PanoramaCorrectInfo = (props) => {
    const { mouseControl, toggleMouseControl } = props;

    return (
        <div className="panorama-correct-info__wrapper">
            <div className="title">
                Управление панорамой
            </div>
            <div className="body">
                <Button
                    className="mb-3 w-100 toggle-mouse-control"
                    color="primary"
                    onClick={() => toggleMouseControl(!mouseControl)}>
                    Управление мышкой
                    <span
                        className={classnames("status", {
                            enable: mouseControl,
                            disable: !mouseControl,
                        })} />
                </Button>
                {keys.map((item, i) => (
                    <div
                        key={String(i)}
                        className="field">
                        <i className={`fa ${item.classname}`} />
                        <span className="info-button">
                            {item.key}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

PanoramaCorrectInfo.propTypes = {
    toggleMouseControl: PropTypes.func.isRequired,
    mouseControl: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    mouseControl: store.panorama.mouseControl,
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({ toggleMouseControl: togglePanoramaMouseControl }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(memo(PanoramaCorrectInfo));
