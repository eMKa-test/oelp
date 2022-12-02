import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { DropdownItem } from "reactstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { postData } from "../../../../../../api";
import { UPDATE_CONTENT_NORTH_API_URL } from "../../../../../constants";

const dropdownRule = ["panorama", "aeropanorama"];

const UpdateNorth = ({
    contentType, lineId, dateFrom,
}) => {
    const onClick = useCallback(() => {
        postData({
            mainUrl: UPDATE_CONTENT_NORTH_API_URL(lineId, contentType),
            body: {
                date: dateFrom,
            },
        }).then(({ success }) => {
            if (success) {
                toast.success("Изменения сохранены");
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Ошибка", { autoClose: 4000 });
        });
    }, [lineId, contentType, dateFrom]);

    if (!dropdownRule.includes(contentType)) {
        return null;
    }

    return (
        <DropdownItem
            onClick={onClick}>
            <div className="tabs__dropdown-item">
                <span>Обновить север</span>
                <span className="dropdown-item-sign">
                    <i className="fa fa-compass" />
                </span>
            </div>
        </DropdownItem>
    );
};

UpdateNorth.propTypes = {
    lineId: PropTypes.number.isRequired,
    dateFrom: PropTypes.string,
    contentType: PropTypes.string.isRequired,
};

const mapToStateProps = (store) => ({
    contentType: store.content.contentType,
    lineId: store.currentLine?.id,
    dateFrom: store.content.dateFrom,
});

export default connect(mapToStateProps, null)(memo(UpdateNorth));
