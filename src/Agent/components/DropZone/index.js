import React, { memo, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import Dropzone from "react-dropzone";
import Popover from "./Popver";
import "./style.css";

const DropZone = (props) => {
    const {
        contentLen,
        onDrop,
        files,
        onRemove,
        loading,
        title,
        subTitle,
        accept,
        isAerial,
        disabled,
    } = props;
    const [openPopover, setOpenPopover] = useState(false);
    const inactive = loading || disabled;

    return (
        <div className="upload-card">
            <div className="header-panel">
                <div className="upload-count-info">
                    {contentLen}
                </div>
                <Button
                    title="Список файлов"
                    onClick={() => setOpenPopover(!openPopover)}
                    className="btn-sm list-content__button card__button"
                    outline={!openPopover}>
                    <i className="fa fa-list-ul" />
                </Button>
            </div>
            <Dropzone
                disabled={inactive}
                title="Зона загрузки файлов"
                className="dropzone"
                activeClassName="dropzone__active"
                acceptClassName="dropzone__accept"
                rejectClassName="dropzone__reject"
                accept={isAerial ? "" : accept}
                onDrop={onDrop}>
                <i className="fa fa-download fa-2x" />
                <p className="title">{title}</p>
                {subTitle && (
                    <p className="sub-title">{subTitle}</p>
                )}
            </Dropzone>
            <Button
                title="Очистить сет"
                disabled={contentLen === 0 || inactive}
                onClick={onRemove}
                outline={contentLen === 0}
                className="btn-sm remove-content__button card__button">
                <i className="fa fa-trash-o" />
            </Button>
            <Popover
                isAerial={isAerial}
                files={files}
                open={openPopover}
                onClose={() => setOpenPopover(false)} />
        </div>
    );
};

DropZone.propTypes = {
    disabled: PropTypes.bool,
    contentLen: PropTypes.number.isRequired,
    onDrop: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    isAerial: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    accept: PropTypes.string,
    files: PropTypes.any,
};

const mapStateToProps = (store) => ({
    loading: store.upload.load,
});

export default connect(mapStateToProps)(memo(DropZone));
