import React from "react";
import * as PropTypes from "prop-types";
import {
    Card, CardBody, Button,
} from "reactstrap";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchData } from "../../../../../../api";
import EditContentModal from "../../../../../common/EditContentModal";
import DeleteModal from "../../../../../common/DeleteModal";
import VideoPlayer from "../../../../../common/VideoPlayer";
import { updateContent } from "../../../../../store/actionCreators/contentActions";

class Video extends React.Component {
    static propTypes = {
        video: PropTypes.object,
        uploadUrl: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
        };
    }

    submitVideo = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({ isOpen: false }, () => {
            const { video, uploadUrl } = this.props;
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
                    toast.success("Данные обновлены");
                    this.props.updateItem();
                }
            }).catch((e) => {
                toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
            });
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { video, uploadUrl, dateFrom } = this.props;
        fetchData({
            url: `${uploadUrl}/${video.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpenDelete: false });
                toast.success("Видео удалено");
                this.props.updateItem(dateFrom);
            }
        }).catch((e) => {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        });

        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    render() {
        const {
            video: content, video: { gps: coords, pointId },
        } = this.props;
        const { isOpen, isOpenDelete } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        return (
            <React.Fragment>
                <Card
                    className="select-map-preview-item">
                    <CardBody
                        className="image-thumb image-thumb_video">
                        <VideoPlayer
                            className="VideoPreview"
                            tmb={content.src.tmb && content.src.tmb}
                            src={content.src.src}
                            preload="none" />
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
                        <p className="content-thumb-description">{content.description || ""}</p>
                    </CardBody>
                </Card>
                <EditContentModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={content.description}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultPointId={pointId}
                    defaultDateFrom={content.date}
                    toggleModal={this.toggleModal}
                    submit={this.submitVideo} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (store) => ({
    uploadUrl: store.content.uploadUrl,
    dateFrom: store.content.dateFrom,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Video);
