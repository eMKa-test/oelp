import React, {
    Fragment, useState, memo, useCallback, useEffect, useRef,
} from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import Calendar from "../../../../../components/Calendar/Calendar";
import { changeContentType, setDateFrom } from "../../../../../store/actionCreators/contentActions";

const ChangeDate = ({ dateFrom, dates, onChangeDate }) => {
    const [open, setOpen] = useState(false);
    const selectedDate = dateFrom ? moment(dateFrom).format("DD-MM-YYYY") : "";
    const wrapperRef = useRef();

    const toggleOpen = useCallback((value) => {
        if (typeof value === "boolean") {
            setOpen(value);
        } else {
            setOpen(!open);
        }
    }, [open]);

    const handleClick = useCallback((e) => {
        if (e.target.closest("#toggle-button")) {
            toggleOpen(false);
        } else {
            const node = wrapperRef.current;
            const {
                left, top, width, height,
            } = node.getBoundingClientRect();
            if (e.clientX < Math.floor(left) || e.clientY > Math.floor(left + width) || e.clientY < Math.floor(top) || e.clientY > Math.floor(top + height)) {
                toggleOpen(false);
            }
        }
    }, [wrapperRef, open]);

    useEffect(() => {
        if (open) {
            document.addEventListener("click", handleClick);
        }
        return () => document.removeEventListener("click", handleClick);
    }, [open]);

    const handleChangeDate = useCallback((date) => {
        onChangeDate(date);
        toggleOpen(false);
    }, []);

    return (
        <Fragment>
            <div>
                <Button
                    outline={!open}
                    color="primary"
                    id="toggle-button"
                    className="calendar-toggle"
                    onClick={toggleOpen}>
                    {selectedDate && (
                        <span className="aside-button-toggle-date">{selectedDate}</span>
                    )}
                    <i className="icon-calendar" />
                </Button>
            </div>
            <div
                ref={wrapperRef}
                className={`tab-aside-panel ${open ? "aside_show" : "aside_hide"}`}>
                <div className="Calendar">
                    <Calendar
                        dateFrom={dateFrom}
                        dates={dates}
                        onChangeDate={handleChangeDate} />
                </div>
            </div>
        </Fragment>
    );
};

ChangeDate.propTypes = {
    dateFrom: PropTypes.string,
    onChangeDate: PropTypes.func,
};

const mapStateToProps = (store) => ({
    dateFrom: store.content.dateFrom,
    dates: store.content.dates,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    changeContentType,
    onChangeDate: setDateFrom,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ChangeDate));
