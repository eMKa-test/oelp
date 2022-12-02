import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getAppInfo } from "../../../../../../utils/helpers";

function PromoMonthSelect(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Компания</th>
                    <th>Название фильтра</th>
                    <th>Выбранный месяц</th>
                    <th>Устройство</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.companyName}
                            </td>
                            <td>
                                {item.meta && item.meta.filterTitle}
                            </td>
                            <td>
                                {item.meta && item.meta.selectedMonth}
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

PromoMonthSelect.propTypes = {
    payload: PropTypes.any,
};

export default PromoMonthSelect;
