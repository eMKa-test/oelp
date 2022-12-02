import React, { memo } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import {
    Button, Card, CardBody, Progress,
} from "reactstrap";
import { Prompt, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import ObjectsMap from "../components/Map/ObjectsMap";
import ErrorBoundary from "./ErrorBoundary";

class HeaderObject extends React.Component {
    state = {
        upload: null,
        bg: { backgroundImage: "none" },
        progress: 0,
        openMap: false,
    };

    componentDidMount() {
        const { image } = this.props;
        if (image) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const image = get(nextProps, "image", false);
        if (image && this.state.bg.backgroundImage !== image.src) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        } else {
            this.setState({ bg: { backgroundImage: "none" } });
        }
        return null;
    }

    config = {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ progress });
        },
    };

    handleFilePreview = (acceptedFiles) => {
        const reader = new FileReader();
        this.setState({ upload: acceptedFiles[0] });
        reader.onload = function readerOnload(e) {
            this.setState({ bg: { backgroundImage: `url('${e.target.result}')` } });
        }.bind(this);
        reader.readAsDataURL(acceptedFiles[0]);
    };

    submitFileUpload = () => {
        const upload = new FormData();
        upload.append("file", this.state.upload);
        axios
            .post(this.props.uploadUrl, upload, this.config)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ upload: null });
                    toast.success("Картинка загружена");
                }
            })
            .catch((e) => {
                toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
                warn(e, "upload err");
            });
    };

    toggleMap = (val) => this.setState({ openMap: val });

    render() {
        const {
            upload,
            progress,
            bg,
            openMap,
            allLines,
        } = this.state;
        const {
            onClickEdit,
            title,
            description,
            isActive,
            updateObject,
            lines,
        } = this.props;
        const dropZoneTitle = "Загрузить изображение объекта";
        return (
            <div className="mb-3">
                <div className="row d-flex justify-content-between align-items-start">
                    <div className="col-12 d-flex align-items-start justify-content-start">
                        <div className="mr-1 d-flex">
                            <Button
                                color="light"
                                onClick={onClickEdit}>
                                <i className="icon-pencil"/>
                            </Button>
                            <Button
                                title="Карта с отрезками"
                                color={openMap ? "primary" : "light"}
                                onClick={() => this.toggleMap(!openMap)}>
                                <i className="fa fa-map-o"/>
                            </Button>
                        </div>
                        <div className="d-flex w-100 justify-content-between align-items-start">
                            <h1 className="h3 mb-0">
                                {title}
                            </h1>
                            <i
                                title={isActive ? "Активен" : "Неактивен"}
                                style={{
                                    marginTop: "6px",
                                    fontSize: "18px",
                                }}
                                className={`mr-2 fa ${isActive ? "fa-eye text-success" : "fa-eye-slash text-danger"}`}/>
                        </div>
                    </div>
                    <div className="col-12 d-flex">
                        <p className="mb-2 pr-3">{description}</p>
                    </div>
                </div>
                <div className="row d-flex align-items-start">
                    <div className="col-md-12 col-xl-8 align-self-start">
                        <ErrorBoundary>
                            <ObjectsMap
                                isLines
                                update={updateObject}
                                open={openMap}
                                markers={lines}/>
                        </ErrorBoundary>
                    </div>
                    <div className="col-md-5 mt-3 col-xl-4">
                        <ErrorBoundary>
                            <Card className="mb-0">
                                <CardBody
                                    className="image-thumb cursor-pointer"
                                    style={bg}>
                                    <Dropzone
                                        className="imageUpload"
                                        activeClassName="imageUpload--active"
                                        acceptClassName="imageUpload--accept"
                                        rejectClassName="imageUpload--reject"
                                        accept="image/*"
                                        onDrop={this.handleFilePreview}>
                                        {bg.backgroundImage === "none" && <p>{dropZoneTitle}</p>}
                                    </Dropzone>
                                    {upload && (progress === 0 || progress === 100) ? (
                                        <Button
                                            className="imageSaveBtn"
                                            color="success"
                                            onClick={this.submitFileUpload}>
                                            <i className="icon-cloud-upload icons d-block"/>
                                        </Button>
                                    ) : null}
                                    {progress > 0 && progress < 100 ? (
                                        <Progress
                                            className="ProgressBar"
                                            value={25}/>
                                    ) : null}
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
                    </div>
                </div>
                <Prompt
                    when={Boolean(upload)}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"}/>
            </div>
        );
    }
}

HeaderObject.propTypes = {
    objectId: PropTypes.number,
    updateObject: PropTypes.func,
    onClickEdit: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    uploadUrl: PropTypes.string,
    isActive: PropTypes.bool,
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
    })),
};

const mapStateToProps = (store) => ({
    router: store.router,
});

export default connect(mapStateToProps, null)(withRouter(memo(HeaderObject)));
