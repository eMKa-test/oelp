import React, { useState, useCallback } from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchData } from "../../../../../../api";
import EditContentModal from "../../../../../common/EditContentModal";
import DeleteModal from "../../../../../common/DeleteModal";
import VideoPlayer from "../../../../../common/VideoPlayer";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { resetEditMode, setActiveMarker } from "../../../../../store/actionCreators/mapActions";

const Video = (props) => {
    const {
        video, video: { gps: coords, pointId }, index, uploadUrl,
        activeMarker, updateItem, setActiveMarkerItem, resetEdit, dateFrom,
    } = props;
    let gps = coords;
    if (!gps) {
        gps = {};
    }
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const submitVideo = useCallback((ev) => {
        ev.preventDefault();
        ev.persist();
        fetchData({
            url: `${uploadUrl}/${video.id}`,
            method: "put",
            body: {
                ...video,
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
    }, [uploadUrl, video]);

    const deleteContent = useCallback((ev) => {
        ev.preventDefault();
        ev.persist();
        fetchData({
            url: `${uploadUrl}/${video.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                setIsOpenDelete(false);
                toast.success("Видео удалено");
                updateItem(dateFrom);
            }
        }).catch((e) => {
            console.warn(e);
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        });
    }, [uploadUrl, video, dateFrom]);

    return (
        <React.Fragment>
            <Card
                className="select-map-preview-item">
                <CardBody
                    className={`image-thumb image-thumb_video ${activeMarker?.id === video.id
                        ? "_active-edit-item" : ""}`}
                    onClick={() => setActiveMarkerItem(video)}>
                    <VideoPlayer
                        tmb={video.src.tmb && video.src.tmb}
                        className="VideoPreview"
                        src={video.src.src}
                        preload="none" />
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
                    <p className="content-thumb-description">{video.description || ""}</p>
                </CardBody>
            </Card>
            <EditContentModal
                edit
                title="Редактирование контента"
                withName={false}
                isOpen={isOpen}
                forContent={false}
                defaultDescription={video.description}
                defaultLat={gps.lat}
                defaultLong={gps.long}
                defaultPointId={pointId}
                defaultDateFrom={video.date}
                toggleModal={() => setIsOpen(!isOpen)}
                submit={submitVideo} />
            <DeleteModal
                isOpen={isOpenDelete}
                toggleModal={() => setIsOpenDelete(false)}
                submit={deleteContent} />
        </React.Fragment>
    );
};

Video.propTypes = {
    updateItem: PropTypes.func.isRequired,
    setActiveMarkerItem: PropTypes.func.isRequired,
    resetEdit: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    video: PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
        gps: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
        src: PropTypes.shape({
            src: PropTypes.string,
            tmb: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(Video);
