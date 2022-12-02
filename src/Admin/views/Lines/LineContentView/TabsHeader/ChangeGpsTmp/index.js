import React, {
    memo, useEffect, useState, useCallback, useRef,
} from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { getGpsTmp } from "../../../../../store/actionCreators/contentActions";
import ContentGPS from "./ContentGPS";

const ChangeGpsTmp = (props) => {
    const {
        contentType,
        lineID,
        getGps,
        gpsTmp,
    } = props;
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef();

    useEffect(() => {
        getGps({
            contentType,
            lineID,
        });
    }, [contentType]);

    const toggle = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const handleClick = useCallback((e) => {
        if (e.target.closest("#toggle-button-gps")) {
            toggle();
        } else {
            const node = wrapperRef.current;
            const {
                left,
                top,
                width,
                height,
            } = node.getBoundingClientRect();
            if (e.clientX < Math.floor(left) || e.clientY > Math.floor(left + width) || e.clientY < Math.floor(top) || e.clientY > Math.floor(top + height)) {
                toggle();
            }
        }
    }, [wrapperRef, open]);

    useEffect(() => {
        if (open) {
            document.addEventListener("click", handleClick);
        }
        return () => document.removeEventListener("click", handleClick);
    }, [open]);

    return (
        <div className="tmp-gps__wrapper ml-2">
            <Button
                color="primary"
                outline={!open}
                onClick={toggle}
                id="toggle-button-gps"
                className="tmp-gps__button"
                title="Задать GPS контента на дату">
                {gpsTmp?.date && (
                    <span className="aside-button-toggle-date">
                        {moment(gpsTmp.date)
                            .format("DD-MM-YYYY")}
                    </span>
                )}
                <i className="fa fa-dot-circle-o" />
            </Button>
            <ContentGPS
                toggle={toggle}
                forwardRef={wrapperRef}
                open={open} />
        </div>
    );
};

ChangeGpsTmp.propTypes = {
    lineID: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired,
    getGps: PropTypes.func.isRequired,
    gpsTmp: PropTypes.shape({
        date: PropTypes.string,
    }),
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
    gpsTmp: store.content.gpsTmp,
    lineID: store.currentLine.id,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    getGps: getGpsTmp,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ChangeGpsTmp));
