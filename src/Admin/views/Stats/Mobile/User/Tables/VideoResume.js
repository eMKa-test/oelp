import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getAppInfo } from "../../../../../../utils/helpers";

function VideoResume(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Ссылка на файл</th>
                    <th>Длительность</th>
                    <th>Время в момент продолжения</th>
                    <th>Тип (контент/промо/стрим)</th>
                    <th>Устройство</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.source}
                            </td>
                            <td>
                                {item.meta && item.meta.duration}
                            </td>
                            <td>
                                {item.meta && item.meta.currentTime}
                            </td>
                            <td>
                                {item.meta && item.meta.seectionType}
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

VideoResume.propTypes = {
    payload: PropTypes.any,
};

export default VideoResume;
