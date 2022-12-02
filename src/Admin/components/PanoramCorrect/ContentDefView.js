import React, { memo, useState, useMemo } from "react";
import classnames from "classnames";
import * as PropTypes from "prop-types";
import * as geo from "geolib";
import { Button } from "reactstrap";

const ContentDefView = (props) => {
    const {
        yaw, contentView, onDelete, onSubmit,
    } = props;
    const [open, setOpen] = useState(false);
    const degree = Math.round(geo.toDeg(yaw));
    const viewAngle = useMemo(() => Math.round(contentView?.viewAngle) || 0, [contentView]);

    return (
        <div
            className={classnames("content-def-view__wrapper", {
                show: open,
                hide: !open,
            })}>
            <div className="content-def-view__value">
                <div className="degree-info">
                    <div>
                        <i className="fa fa-compass text-primary" />
                        &nbsp;
                        {degree}
                        &deg;
                    </div>
                    <div className="content-view-angle">
                        {viewAngle}
                        &deg;
                    </div>
                </div>
                <div>
                    <Button
                        title="Удалить"
                        disabled={!contentView}
                        onClick={onDelete}
                        outline
                        className="mr-2"
                        color="danger">
                        <i className="fa fa-trash" />
                    </Button>
                    <Button
                        title="Сохранить"
                        onClick={onSubmit}
                        color="success">
                        <i className="fa fa-check" />
                    </Button>
                </div>
            </div>
            <button
                type="button"
                title="Дефолтное направление взгляда"
                onClick={() => setOpen(!open)}
                className="btn_like_div content-def-view__toggle">
                {open ? (
                    <i className="fa fa-arrow-up" />
                ) : (
                    <i className="fa fa-arrow-down" />
                )}
            </button>
        </div>
    );
};

ContentDefView.propTypes = {
    contentView: PropTypes.shape({
        id: PropTypes.number,
        viewAngle: PropTypes.number,
    }),
    yaw: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default memo(ContentDefView);
