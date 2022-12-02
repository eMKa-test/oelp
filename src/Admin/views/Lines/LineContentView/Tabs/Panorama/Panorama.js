import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import get from "lodash/get";
import has from "lodash/has";
import { fetchData } from "api";
import EditContentModal from "Admin/common/EditContentModal";
import DeleteModal from "Admin/common/DeleteModal";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { resetEditMode, setActiveMarker } from "../../../../../store/actionCreators/mapActions";

class Panorama extends React.PureComponent {
    static propTypes = {
        image: PropTypes.object,
        uploadUrl: PropTypes.string,
        index: PropTypes.number,
        updateItem: PropTypes.func,
        dateFrom: PropTypes.string,
        lineID: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
        };
    }

    submitImage = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({ isOpen: false }, () => {
            const { image, uploadUrl } = this.props;
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
                    toast.success("Данные обновлены");
                    this.props.updateItem(this.props.content.dateFrom, this.props.resetEdit);
                }
            }).catch((e) => {
                toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
            });
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { image, uploadUrl, content: { dateFrom } } = this.props;
        fetchData({
            url: `${uploadUrl}/${image.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpenDelete: false });
                toast.success("Панорама удалена");
                this.props.updateItem(dateFrom);
            }
        }).catch((e) => {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
        });

        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    setFirstStepPanoram = () => {
        const { image: { id }, content: { dateFrom }, router: { lineID } } = this.props;
        fetchData({
            url: `/admin/api/lines/${lineID}/content/panorama/first`,
            method: "post",
            body: {
                date: dateFrom,
                id,
            },
        }).then((res) => {
            if (res.success) {
                toast.success("Данные обновлены");
                this.props.updateItem();
            }
        }).catch((e) => {
            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
            console.warn(e);
        });
    };

    render() {
        const {
            image, image: { gps: coords, pointId }, index, activeMarker,
        } = this.props;
        const { isOpen, isOpenDelete } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        const isFirst = image?.isFirst;
        return (
            <React.Fragment>
                <Card
                    className="select-map-preview-item">
                    <CardBody
                        onClick={() => this.props.changePanId(image.id)}
                        className={`
                            image-thumb image-thumb_small admin-panoram-thumb
                            ${(activeMarker?.id === image.id) && "admin-panoram-thumb_selected"}
                        `}
                        style={{ backgroundImage: has(image, "src.tmb") ? `url(${get(image, "src.tmb")})` : "none" }} />
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
                    <Button
                        title={`${isFirst ? "Первая панорама" : "Сделать первой панорамой"}`}
                        className="panorama-first-step-button"
                        color={isFirst ? "success" : "light"}
                        onClick={this.setFirstStepPanoram}>
                        <i className={`${isFirst ? "icon-check" : "icon-minus"} icons d-block`} />
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
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={image.description}
                    defaultDateFrom={image.date}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultPointId={pointId}
                    toggleModal={this.toggleModal}
                    submit={this.submitImage} />
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
    content: store.content,
    router: store.router,
    currentLine: store.currentLine,
    activeMarker: store.map.activeMarker,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
    setActiveMarkerItem: setActiveMarker,
    resetEdit: resetEditMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Panorama);
