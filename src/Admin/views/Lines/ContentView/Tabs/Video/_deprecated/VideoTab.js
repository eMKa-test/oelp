import React from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { Prompt } from "react-router-dom";
import Dropzone from "react-dropzone";
import {
    Col, Row, Card, CardBody,
} from "reactstrap";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import VideoPreview from "./VideoPreview";
import Video from "./Video";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

class VideoTab extends React.Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            upload: {},
        };
    }

    inProgress = (upload) => Object.keys(upload)
        .filter((i) => typeof upload[i] !== "undefined").length;

    handleDone = (index, allSuccess) => {
        const { upload } = this.state;
        upload[index] = undefined;
        if (this.inProgress(upload) !== 0) {
            return;
        }
        this.setState(() => ({ upload: {} }), () => {
            if (allSuccess) {
                toast.success("Видео успешно загружены");
                this.props.updateItem();
            } else {
                toast.error("Не все Видео успешно загружены", { autoClose: 4000 });
            }
        });
    };

    handleFileUpload = (acceptedFiles) => {
        if (this.inProgress(this.state.upload) !== 0) {
            return alert("Предыдущая загрузка файлов в процессе"); // eslint-disable-line
        }
        return this.setState({
            upload: acceptedFiles.reduce((acc, file, i) => {
                acc[i] = {
                    index: i,
                    src: file,
                };
                return acc;
            }, {}),
        });
    };

    renderPreview = () => map(this.state.upload, (file) => (
        <Col
            key={file.index}
            xs="12"
            sm="6"
            md="4"
            xl="3">
            <VideoPreview
                index={file.index}
                file={file.src}
                uploadUrl={this.props.uploadUrl}
                handleDone={this.handleDone} />
        </Col>
    ));

    renderVideos = () => {
        const { content } = this.props;
        if (content.length === 0) {
            return (
                <Col
                    xs="12"
                    md="6"
                    xl="4">
                    <p>Ни одного видео ещё не загружено</p>
                </Col>
            );
        }
        return map(content, (video, i) => (
            <Col
                key={video.id || i}
                xs="12"
                sm="6"
                md="4"
                xl="3">
                <Video
                    video={video}
                    index={content.length - i} />
            </Col>
        ));
    };

    render() {
        const { upload } = this.state;
        return (
            <div
                style={{
                    height: "100%",
                    position: "relative",
                }}>
                {this.props.children}
                <ErrorBoundary>
                    <Row className="mt-3">
                        <Col
                            xs="12"
                            sm="6"
                            md="4"
                            xl="3">
                            <Card>
                                <CardBody className="image-thumb image-thumb_video cursor-pointer">
                                    <Dropzone
                                        className="imageUpload"
                                        activeClassName="imageUpload--active"
                                        acceptClassName="imageUpload--accept"
                                        rejectClassName="imageUpload--reject"
                                        accept="video/*"
                                        onDrop={this.handleFileUpload}>
                                        <span>Зона загрузки контента</span>
                                    </Dropzone>
                                </CardBody>
                            </Card>
                        </Col>
                        {this.renderPreview()}
                        {this.renderVideos()}
                    </Row>
                </ErrorBoundary>
                <Prompt
                    when={Object.entries(upload).length > 0}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
            </div>
        );
    }
}

const mapStateToProps = (store) => ({
    content: store.content.content,
    uploadUrl: store.content.uploadUrl,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VideoTab);
