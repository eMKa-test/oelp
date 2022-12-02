import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getAppInfo } from "../../../../../../utils/helpers";

function CalendarChangeDate(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Тип контента</th>
                    <th>Компания</th>
                    <th>Выбранная дата</th>
                    <th>Устройство</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.contentType}
                            </td>
                            <td>
                                {item.meta && item.meta.companyName}
                            </td>
                            <td>
                                {item.meta && item.meta.date}
                            </td>
                            <td>
                                {getAppInfo(item.userAgent)}
                            </td>
                        </tr>
                    ))
                ) : null}
            </tbody>
        </Table>
    );
}

CalendarChangeDate.propTypes = {
    payload: PropTypes.any,
};

export default CalendarChangeDate;
