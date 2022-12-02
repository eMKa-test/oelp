import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.css";
import isArray from "lodash/isArray";

const Calendar = (props) => {
    const {
        dates,
        dateFrom,
        onChangeDate,
        disable,
        noList,
        maxDate,
    } = props;

    const onChange = useCallback((value) => {
        onChangeDate(moment(value)
            .format("YYYY-MM-DD"));
    }, [onChangeDate]);

    return (
        <ReactCalendar
            onChange={onChange}
            minDetail="decade"
            maxDate={maxDate}
            locale="ru-RU"
            selectRange={false}
            value={dateFrom ? new Date(dateFrom) : null}
            tileDisabled={({
                date,
                view,
            }) => {
                if (disable) {
                    return true;
                }
                const day = moment(date)
                    .toString();
                if (view === "month" && dates?.includes(day)) {
                    return false;
                }
                if (view !== "month") {
                    return false;
                }
                if (noList) {
                    return false;
                }
                return true;
            }} />
    );
};

Calendar.propTypes = {
    noList: PropTypes.bool,
    dates: PropTypes.array,
    dateFrom: PropTypes.string,
    maxDate: PropTypes.instanceOf(Date),
    disable: PropTypes.bool,
    onChangeDate: PropTypes.func,
};

export default memo(Calendar);
