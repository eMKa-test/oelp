import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import EditContentModal from "Admin/common/EditContentModal";
import DeleteModal from "Admin/common/DeleteModal";
import { fetchData } from "api";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import VideoPlayer from "../../../../../common/VideoPlayer";
import EditVideo from "../../../../../components/EditVideos";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { resetEditMode, setActiveMarker } from "../../../../../store/actionCreators/mapActions";

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
            videoCut: null,
            loadIs: false,
            reFetch: false,
        };
    }

    submitVideo = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({
            loadIs: true,
            isOpen: false,
        }, () => {
            const {
                video,
                uploadUrl,
            } = this.props;
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
                    videocut: this.state.videoCut,
                },
            })
                .then(({ success = false }) => {
                    if (success) {
                        this.setState({
                            loadIs: false,
                            reFetch: false,
                        });
                        toast.success("Данные обновлены");
                        this.props.updateItem("", this.props.resetEdit);
                    }
                })
                .catch((e) => {
                    this.setState({
                        loadIs: false,
                        reFetch: true,
                    }, () => {
                        toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
                        alert("Ошибка. Нажмите Повторить");
                    });
                });
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const {
            video,
            uploadUrl,
            dateFrom,
        } = this.props;
        fetchData({
            url: `${uploadUrl}/${video.id}`,
            method: "delete",
        })
            .then(({ success = false }) => {
                if (success) {
                    this.setState({ isOpenDelete: false });
                    toast.success("Видео удалено");
                    this.props.updateItem(dateFrom);
                }
            })
            .catch((e) => {
                toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
            });
        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    getVideoCut = (arr) => this.setState({ videoCut: arr });

    render() {
        const {
            video: content,
            video: {
                gps: coords,
                pointId,
            },
            video,
            setActiveMarkerItem,
            index,
            activeMarker,
        } = this.props;
        const {
            isOpen,
            isOpenDelete,
            loadIs,
            reFetch,
        } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        let alertOutline = {};
        if (video.status !== "ACTIVE") {
            alertOutline = { outline: "4px dashed red" };
        }
        return (
            <React.Fragment>
                <Card
                    className={`select-map-preview-item ${activeMarker?.id === video.id ? "_active-edit-item" : ""}`}
                    style={alertOutline}>
                    <CardBody
                        className={`image-thumb image-thumb_video ${activeMarker?.id === video.id ? "_active-edit-item" : ""}`}
                        onClick={() => setActiveMarkerItem(video)}>
                        <VideoPlayer
                            className="VideoPreview"
                            preload="none"
                            tmb={content.src.tmb && content.src.tmb}
                            src={content.src.src} />
                        <Button
                            className="content-edit-description-button"
                            color="light"
                            onClick={this.toggleModal}>
                            <i className="icon-pencil icons d-block" />
                        </Button>
                        <Button
                            className="content-delete-description-button"
                            color="light"
                            onClick={this.toggleDeleteModal}>
                            <i className="icon-trash icons d-block" />
                        </Button>
                        <div className="count-container__counter">
                            {index}
                        </div>
                        <p className="content-thumb-description">{content.description || ""}</p>
                    </CardBody>
                </Card>
                <EditContentModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    loadIs={loadIs}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={content.description}
                    defaultDateFrom={content.date}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultPointId={pointId}
                    toggleModal={this.toggleModal}
                    submit={this.submitVideo}
                    stylesForAerial={{ maxWidth: "650px" }}
                    reFetch={reFetch}
                    cutVideos={(
                        <EditVideo
                            {...this.props}
                            getVideoCut={this.getVideoCut} />
                    )} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

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
