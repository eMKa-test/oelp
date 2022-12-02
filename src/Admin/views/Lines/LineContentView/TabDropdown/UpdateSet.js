import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DropdownItem } from "reactstrap";
import isEmpty from "lodash/isEmpty";
import { updateContent } from "../../../../store/actionCreators/contentActions";
import { postData } from "../../../../../api";

const UpdateSet = ({
    dateFrom,
    contentType,
    lineID,
    updateItem,
    isScheme,
}) => {
    const disabled = contentType === "panorama" && isScheme;

    const changeSortByPointID = useCallback(() => {
        if (disabled) {
            return null;
        }
        const mainUrl = `/admin/api/lines/${lineID}/content/${contentType}/updateContentSet`;
        const body = {
            date: dateFrom,
        };
        postData({
            mainUrl,
            body,
        })
            .then((res) => {
                if (res.success) {
                    toast.success("Сет обновлён");
                    updateItem(dateFrom);
                }
            })
            .catch((err) => {
                toast.error("Ошибка", { autoClose: 4000 });
                console.error(err);
            });
    }, [dateFrom, contentType, lineID, disabled]);

    return (
        <DropdownItem
            className={`tabs__dropdown-item ${disabled ? "disable" : ""}`}
            title={disabled ? "Не доступно для панорам с помещениями" : "Применяет изменения зацикленности и порядка проходки панорам за выбранную дату"}
            onClick={changeSortByPointID}>
            <div className="tabs__dropdown-item__body">
                <span>Обновить сет</span>
                <span className="dropdown-item-sign">
                    <i className="fa fa-refresh" />
                </span>
            </div>
        </DropdownItem>
    );
};

UpdateSet.propTypes = {
    dateFrom: PropTypes.string,
    lineID: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired,
    updateItem: PropTypes.func.isRequired,
    isScheme: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
    dateFrom: store.content.dateFrom,
    lineID: store.currentLine.id,
    isScheme: !isEmpty(store.currentLine.schemes),
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(UpdateSet));
