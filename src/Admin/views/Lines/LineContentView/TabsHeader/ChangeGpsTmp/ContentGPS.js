import React, {
    memo, useState, useCallback, useEffect,
} from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Calendar from "../../../../../components/Calendar";
import { postGpsTmp, deleteGpsTmp } from "../../../../../store/actionCreators/contentActions";

const ContentGPS = (props) => {
    const {
        forwardRef,
        open,
        dates,
        fetchGpsTmp,
        lineId,
        contentType,
        gpsTmp,
        deleteTmp,
        toggle,
    } = props;
    const [date, setDate] = useState(null);
    const [load, setLoad] = useState(null);

    useEffect(() => {
        if (gpsTmp) {
            setDate(gpsTmp.date);
        }
    }, [gpsTmp]);

    const onChangeDate = useCallback((_date) => {
        if (!load) {
            setDate(_date);
        }
    }, [load]);

    const onRemove = useCallback(() => {
        if (gpsTmp) {
            deleteTmp({
                id: gpsTmp.id,
                callback: () => {
                    setDate(null);
                    toggle();
                },
            });
        }
    }, [gpsTmp]);

    const onSave = useCallback(() => {
        setLoad(true);
        fetchGpsTmp({
            date,
            lineId,
            contentType,
            callback: (success) => {
                if (success) {
                    toggle();
                }
                setLoad(false);
            },
        });
    }, [date]);

    return (
        <div
            ref={forwardRef}
            className={`tmp-gps__container ${open ? "show" : "hide"}`}>
            <div className="tmp-gps__container__wrapper">
                <div className="tmp-gps__control">
                    <Calendar
                        disable={load}
                        dateFrom={date}
                        onChangeDate={onChangeDate}
                        dates={dates} />
                </div>
                <div className="tmp-gps__submit">
                    <Button
                        disabled={!gpsTmp || load}
                        outline
                        onClick={onRemove}
                        className="tmp-gps__remove"
                        title="Удалить"
                        color="danger">
                        <i className="fa fa-trash-o" />
                    </Button>
                    <Button
                        disabled={!date || load}
                        onClick={onSave}
                        title="Сохранить"
                        color="success"
                        className="tmp-gps__save">
                        <i className="fa fa-check" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

ContentGPS.propTypes = {
    forwardRef: PropTypes.any,
    open: PropTypes.bool.isRequired,
    dates: PropTypes.arrayOf(PropTypes.string),
    fetchGpsTmp: PropTypes.func,
    deleteTmp: PropTypes.func,
    toggle: PropTypes.func,
    contentType: PropTypes.string,
    lineId: PropTypes.number,
    gpsTmp: PropTypes.shape({
        date: PropTypes.string,
        id: PropTypes.number,
    }),
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
    gpsTmp: store.content.gpsTmp,
    dates: store.content.dates,
    lineId: store.currentLine.id,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchGpsTmp: postGpsTmp,
    deleteTmp: deleteGpsTmp,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(ContentGPS));
