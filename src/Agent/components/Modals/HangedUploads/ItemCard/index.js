import React, { memo, Fragment } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import memoize from "lodash/memoize";
import CardBody from "./CardBody";
import Collapse from "../../../Collapse";
import { formatTitle } from "../../../../common/helpers";

const types = {
    IMAGE: "Фото",
    VIDEO: "Видео",
    PANORAMA: "Панорама",
    AEROPANORAMA: "Аэропанорама",
    AERIAL: "Аэросъемка",
};

const getType = memoize((type) => types[type]);

const ItemCard = (props) => {
    const {
        set,
        line,
        addFiles,
        files,
        removeFile,
    } = props;

    const nodeTitle = (
        <div className="left-title">
            <div className="set-title">
                {formatTitle(line.name)}
            </div>
            <div className="set-type">
                {getType(set.contentType)}
            </div>
        </div>
    );

    return (
        <div className="item-card">
            <div className="set-info">
                <Collapse
                    showStatus={false}
                    duration={200}
                    nodeTitle={nodeTitle}
                    rightTitle={set.date}
                    classname="hanged-upload__item-header">
                    <div className="set-body">
                        <div className="set-card__body">
                            {set?.files.map((file, i) => (
                                <CardBody
                                    removeFile={removeFile}
                                    files={files}
                                    addFiles={addFiles}
                                    key={String(i)}
                                    file={file}
                                    set={set} />
                            ))}
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    );
};

ItemCard.propTypes = {
    set: PropTypes.shape({
        date: PropTypes.string,
        lineId: PropTypes.number,
        contentType: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
        })),
    }),
    line: PropTypes.shape({
        name: PropTypes.string,
    }),
    addFiles: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    lines: store.app.lines,
});

export default connect(mapStateToProps)(memo(ItemCard));
