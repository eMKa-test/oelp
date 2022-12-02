import React, { memo } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import {
    Button, Card, CardBody, Progress, ButtonGroup,
} from "reactstrap";
import { Prompt, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";

class Header extends React.Component {
    state = {
        upload: null,
        bg: { backgroundImage: "none" },
        progress: 0,
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

    handleLineViews = (redirect) => () => {
        const params = this.props.router;
        let url = "/admin";
        if (params?.companyID) {
            url += `/companies/${params.companyID}/${params.objectID}/${params?.lineID}`;
        } else {
            url += `/objects/${params.objectID}/${params?.lineID}`;
        }
        url = !redirect ? url : url + redirect;
        this.props.history.push(url);
    };

    render() {
        const {
            upload,
            progress,
            bg,
        } = this.state;
        const {
            onClickEdit,
            title,
            description,
            router,
        } = this.props;
        const dropZoneTitle = "Загрузить изображение отрезка";
        return (
            <div className="row mb-2">
                <div className="col-md-7 col-xl-8">
                    <div className="d-flex align-items-center justify-content-start">
                        <div className="mr-3">
                            <Button
                                className="mb-2"
                                color="light"
                                onClick={onClickEdit}>
                                <i className="icon-pencil icons d-block" />
                            </Button>
                        </div>
                        <h1 className="h3 mb-2">
                            {title}
                        </h1>
                    </div>
                    <div>
                        <p className="mb-2 pr-3">{description}</p>
                        <ButtonGroup>
                            <Button
                                outline
                                color="primary"
                                onClick={this.handleLineViews("")}
                                active={!router?.lineConfig}>
                                Контент
                            </Button>
                            <Button
                                outline
                                color="primary"
                                onClick={this.handleLineViews("/configuration")}
                                active={Boolean(router?.lineConfig)}>
                                Конфигурация отрезка
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="col-md-5 col-xl-4">
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
                                    <i className="icon-cloud-upload icons d-block" />
                                </Button>
                            ) : null}
                            {progress > 0 && progress < 100 ? (
                                <Progress
                                    className="ProgressBar"
                                    value={25} />
                            ) : null}
                        </CardBody>
                    </Card>
                </div>
                <Prompt
                    when={Boolean(upload)}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
            </div>
        );
    }
}

Header.propTypes = {
    onClickEdit: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    uploadUrl: PropTypes.string,
};

const mapStateToProps = (store) => ({
    router: store.router,
});

export default connect(mapStateToProps, null)(withRouter(memo(Header)));
