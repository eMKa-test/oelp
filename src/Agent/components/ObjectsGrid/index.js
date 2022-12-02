import React, { memo, useState } from "react";
import * as PropTypes from "prop-types";
import { Collapse } from "reactstrap";
import isEmpty from "lodash/isEmpty";
import LineRow from "./LineRow";
import "./style.css";

const ObjectsGrid = ({ object }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`objects-grid__wrapper ${open ? "collapsed" : ""}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`btn_like_div object-button ${open ? "collapsed" : ""}`}>
                <span className="title">
                    {object.name}
                </span>
            </button>
            <Collapse
                isOpen={open}>
                {!isEmpty(object.lines) ? (
                    object.lines.map((line, i) => (
                        <LineRow
                            line={line}
                            key={String(i)} />
                    ))
                ) : (
                    <span className="lines-empty">
                        Отрезки отсутствуют
                    </span>
                )}
            </Collapse>
        </div>
    );
};

ObjectsGrid.propTypes = {
    object: PropTypes.shape({
        name: PropTypes.string.isRequired,
        lines: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })),
    }),
};

export default memo(ObjectsGrid);
