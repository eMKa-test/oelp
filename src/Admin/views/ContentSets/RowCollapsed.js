import React, { memo, useEffect, useState } from "react";
import { Collapse } from "reactstrap";
import get from "lodash/get";
import PropTypes from "prop-types";
import { statusTypes, contentTypes } from "./helpers";
import StatusBodies from "./StatusBodies";
import { ERROR } from "../../constants";

const ruleOfSetTypes = [
    "CONVERTING",
    "UPLOADING",
    "FAILED",
];

const RowCollapsed = (props) => {
    const {
        set,
        users,
        setConfirmUploaded,
        setConfirmDelete,
    } = props;
    const [open, setOpen] = useState(false);
    const date = get(set, "date", ERROR.UNKNOWN);
    const statusType = get(set, "status", ERROR.UNKNOWN);
    const contentType = get(set, "contentType", ERROR.UNKNOWN);
    const files = get(set, "files", ERROR.UNKNOWN);
    const matchUser = users.find((u) => u.id === set.userId);
    const line = get(set, "line", ERROR.UNKNOWN);
    const projectName = get(line, "project.name", ERROR.UNKNOWN);

    useEffect(() => {
        return () => setOpen(false);
    }, [set]);

    const collapsedSet = ruleOfSetTypes.includes(set.status);

    return (
        <div className="row__collapsable-header">
            <button
                disabled={!collapsedSet}
                type="button"
                onClick={() => setOpen(!open)}
                className={`btn_like_div c-table__row ${statusType === "FAILED" ? "failed" : ""} ${open ? "show" : ""}`}>
                <span className="c-table__col sm">
                    {date}
                </span>
                <span className="c-table__col sm">
                    {statusTypes[statusType]}
                </span>
                <span className="c-table__col sm">
                    {contentTypes[contentType]}
                </span>
                <span className="c-table__col sm">
                    {matchUser?.name}
                </span>
                <span className="c-table__col lg">
                    {projectName}
                </span>
                <span className="c-table__col lg">
                    {line?.name || "Не известно"}
                </span>
                <span className="c-table__col sm justify-content-end mr-3">
                    {files.length}
                </span>
                <i className={`caret-indicate fa ${open ? "fa-caret-up" : "fa-caret-down"}`} />
            </button>
            <Collapse isOpen={open}>
                <div className="collapsed-body">
                    <StatusBodies
                        setConfirmUploaded={setConfirmUploaded}
                        setConfirmDelete={setConfirmDelete}
                        set={set} />
                </div>
            </Collapse>
        </div>
    );
};

RowCollapsed.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({})),
    set: PropTypes.shape({
        userId: PropTypes.number,
        lineId: PropTypes.number,
        projectId: PropTypes.number,
        status: PropTypes.string,
    }),
    setConfirmUploaded: PropTypes.func.isRequired,
    setConfirmDelete: PropTypes.func.isRequired,
};

export default memo(RowCollapsed);
