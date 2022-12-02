import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { DropdownItem } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import isEmpty from "lodash/isEmpty";
import { getContentLoops } from "../../../../store/actionCreators/panoramaActions";
import { postContentLoops, deleteContentLoops } from "../../../../api/panorama";

const ContentLoop = ({
    loop,
    contentType,
    lineId,
    updateContentLoops,
    isScheme,
}) => {
    const title = loop ? "Убрать зацикленность" : "Зациклить контент";
    const disabled = contentType === "panorama" && isScheme;

    const onClick = useCallback(() => {
        if (disabled) {
            return null;
        }
        const fetchData = loop
            ? deleteContentLoops(loop.id)
            : postContentLoops({
                lineId,
                contentType,
            });
        fetchData.then(({ success }) => {
            if (success) {
                updateContentLoops({
                    lineId,
                    contentType,
                });
            }
        });
    }, [lineId, contentType, loop, disabled]);

    return (
        <DropdownItem
            className={`tabs__dropdown-item ${disabled ? "disable" : ""}`}
            title={disabled ? "Не доступно для панорам с помещениями" : "Зацикливание панорам"}
            onClick={onClick}>
            <div className="tabs__dropdown-item__body">
                <span>{title}</span>
                <span className="dropdown-item-sign">
                    {loop ? (
                        <i className="fa fa-ellipsis-v" />
                    ) : (
                        <i className="fa fa-superpowers" />
                    )}
                </span>
            </div>
        </DropdownItem>
    );
};

ContentLoop.propTypes = {
    lineId: PropTypes.number.isRequired,
    isScheme: PropTypes.bool.isRequired,
    loop: PropTypes.shape({
        id: PropTypes.number,
    }),
    updateContentLoops: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired,
};

const mapToStateProps = (store) => ({
    contentType: store.content.contentType,
    contentLoops: store.panorama.contentLoops,
    loop: store.panorama.loop,
    lineId: store.currentLine?.id,
    isScheme: !isEmpty(store.currentLine?.schemes),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateContentLoops: getContentLoops }, dispatch);

export default connect(mapToStateProps, mapDispatchToProps)(memo(ContentLoop));
