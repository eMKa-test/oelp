import React, {
    memo, useState, useEffect, useCallback,
} from "react";
import { Table, Alert, Button } from "reactstrap";
import moment from "moment";
import { getData } from "../../../../api";
import { GET_SERVER_PROCESS_STATUS_API_URL } from "../../../constants";
import { tasks } from "./helpers";
import "./style.css";

const ServerProcessing = () => {
    const [load, setLoad] = useState(false);
    const [processes, setProcesses] = useState({
        headers: [],
        cols: [],
    });

    const getDifferentTime = useCallback((startTime, time) => {
        const dif = startTime
            .diff(moment(time));
        if (dif < 60000) {
            return `${moment.duration(dif)
                .seconds()} сек.`;
        }
        if (dif >= 60000 && dif < 3.6e+6) {
            return `${moment.duration(dif)
                .minutes()} мин.`;
        }
        return `${moment.duration(dif)
            .hours()} ч.`;
    }, []);

    const getProcess = useCallback(() => {
        setLoad(true);
        getData({ mainUrl: GET_SERVER_PROCESS_STATUS_API_URL })
            .then((res) => {
                if (res.success) {
                    const nowTime = moment();
                    const result = [...res.payload];
                    result.sort((a, b) => a.id - b.id);
                    const _processes = result.reduce((acc, cur) => {
                        if (tasks[cur.section]) {
                            acc.headers.push({
                                title: tasks[cur.section].title,
                                lastActivityAt: getDifferentTime(nowTime, cur.lastActivityAt),
                            });
                            acc.cols.push({
                                status: tasks[cur.section][cur.lastState].title,
                                color: tasks[cur.section][cur.lastState].color,
                                date: cur.date,
                            });
                        }
                        return acc;
                    }, {
                        headers: [],
                        cols: [],
                    });
                    setProcesses(_processes);
                }
            })
            .catch(console.error)
            .finally(() => setLoad(false));
    }, []);

    useEffect(() => {
        getProcess();
    }, []);

    return (
        <div className="server-process-status__wrapper mt-3">
            <div className="activity-title">
                <h4 className="mb-4">Серверные процессы</h4>
                <Button
                    size="sm"
                    className="reset-bootstrap-button-styles"
                    onClick={getProcess}
                    color="primary">
                    <i className={`fa fa-refresh ${load ? "active" : ""}`} />
                </Button>
            </div>
            <Table bordered>
                <thead>
                    <tr>
                        {processes.headers.map((header, i) => (
                            <th
                                className="activity-header text-center font-lg"
                                key={String(i)}>
                                {header.title}
                                <p className="mb-0 activity-time">
                                    последняя активность:
                                    {" "}
                                    {header.lastActivityAt}
                                    {" "}
                                    назад
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {processes.cols.map((body, i) => (
                            <td
                                key={String(i)}>
                                <Alert
                                    className="mb-0 text-center font-lg"
                                    color={body.color}>
                                    {body.status}
                                </Alert>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default memo(ServerProcessing);
