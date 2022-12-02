import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DropdownItem } from "reactstrap";
import { updateContent } from "../../../../store/actionCreators/contentActions";
import { postData } from "../../../../../api";

const UpdatePointsSet = ({
    dateFrom,
    contentType,
    lineID,
    updateItem,
}) => {
    const changeSortByPointID = useCallback(() => {
        const mainUrl = `/admin/api/lines/${lineID}/content/${contentType}/updateContentSetPointId`;
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
    }, [dateFrom, contentType, lineID]);

    return (
        <DropdownItem
            className="tabs__dropdown-item"
            title="PointID контента будет восстановлен/задан по времени загрузки контента в сете (чем позже загружен, тем больше pointID)"
            onClick={changeSortByPointID}>
            <div className="tabs__dropdown-item__body">
                <span>Задать pointID по-умолчанию</span>
                <span className="dropdown-item-sign">
                    <i className="fa fa-refresh" />
                </span>
            </div>
        </DropdownItem>
    );
};

UpdatePointsSet.propTypes = {
    dateFrom: PropTypes.string,
    lineID: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired,
    updateItem: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    contentType: store.content.contentType,
    dateFrom: store.content.dateFrom,
    lineID: store.currentLine.id,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(UpdatePointsSet));
