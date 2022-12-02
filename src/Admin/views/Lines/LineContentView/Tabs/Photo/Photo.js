import React, { memo, useState, useCallback } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, CardBody, Button } from "reactstrap";
import get from "lodash/get";
import has from "lodash/has";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { fetchData } from "../../../../../../api";
import EditContentModal from "../../../../../common/EditContentModal";
import DeleteModal from "../../../../../common/DeleteModal";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { setActiveMarker, resetEditMode } from "../../../../../store/actionCreators/mapActions";

const Photo = (props) => {
    const {
        image, image: { gps: coords, pointId }, index, uploadUrl,
        activeMarker, updateItem, setActiveMarkerItem, resetEdit, dateFrom,
    } = props;
    let gps = coords;
    if (!gps) {
        gps = {};
    }
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const submitImage = useCallback((ev) => {
        ev.preventDefault();
        ev.persist();
        fetchData({
            url: `${uploadUrl}/${image.id}`,
            method: "put",
            body: {
                ...image,
                date: ev.target.dateFrom.value,
                description: ev.target.description.value,
                pointId: ev.target.pointId.value,
                gps: {
                    lat: ev.target.lat.value,
                    long: ev.target.long.value,
                },
            },
        }).then(({ success = false }) => {
            if (success) {
                setIsOpen(false);
                toast.success("Данные обновлены");
                updateItem("", resetEdit);
            }
        }).catch((e) => {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        });
    }, [uploadUrl, image]);

    const deleteContent = useCallback((ev) => {
        ev.preventDefault();
        ev.persist();
        fetchData({
            url: `${uploadUrl}/${image.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                setIsOpenDelete(false);
                toast.success("Фото удалено");
                updateItem(dateFrom);
            }
        }).catch((e) => {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        });
    }, [uploadUrl, image, dateFrom]);

    return (
        <React.Fragment>
            <Card
                className="select-map-preview-item">
                <CardBody
                    className={`image-thumb image-thumb_small
                        ${activeMarker?.id === image.id ? "_active-edit-item" : ""}
                    `}
                    onClick={() => setActiveMarkerItem(image)}
                    style={{ backgroundImage: has(image, "src.tmb") ? `url(${get(image, "src.tmb")})` : "none" }} />
                <Button
                    className="content-edit-description-button"
                    color="light"
                    onClick={() => setIsOpen(!isOpen)}>
                    <i className="icon-pencil icons d-block" />
                </Button>
                <Button
                    className="content-delete-description-button"
                    color="light"
                    onClick={() => setIsOpenDelete(!isOpenDelete)}>
                    <i className="icon-trash icons d-block" />
                </Button>
                <div className="count-container__counter">
                    {index}
                </div>
                <p className="content-thumb-description">{image.description || ""}</p>
            </Card>
            <EditContentModal
                edit
                title="Редактирование контента"
                withName={false}
                forContent={false}
                isOpen={isOpen}
                defaultDescription={image.description}
                defaultLat={gps.lat}
                defaultLong={gps.long}
                defaultPointId={pointId}
                defaultDateFrom={image.date}
                toggleModal={() => setIsOpen(!isOpen)}
                submit={submitImage} />
            <DeleteModal
                isOpen={isOpenDelete}
                toggleModal={() => setIsOpenDelete(false)}
                submit={deleteContent} />
        </React.Fragment>
    );
};

Photo.propTypes = {
    updateItem: PropTypes.func.isRequired,
    setActiveMarkerItem: PropTypes.func.isRequired,
    resetEdit: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    image: PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
        gps: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
    }),
    uploadUrl: PropTypes.string.isRequired,
    activeMarker: PropTypes.shape({
        id: PropTypes.number,
    }),
};

const mapStateToProps = (store) => ({
    uploadUrl: store.content.uploadUrl,
    activeMarker: store.map.activeMarker,
    dateFrom: store.content.dateFrom,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
    setActiveMarkerItem: setActiveMarker,
    resetEdit: resetEditMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(Photo));
