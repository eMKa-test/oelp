import React from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";
import Dropzone from "react-dropzone";
import {
    Col, Row, Card, CardBody,
} from "reactstrap";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import Preview from "./Preview";
import Panorama from "./Panorama";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

class PanoramaTab extends React.Component {
    static propTypes = {
        children: PropTypes.element,
        pans: PropTypes.array,
    };

    constructor() {
        super();
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
                toast.success("Панорамы успешно загружены");
            } else {
                toast.error("Не все панорамы успешно загружены", { autoClose: 4000 });
            }
            this.props.updateItem();
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
            md="6"
            xl="4">
            <Preview
                index={file.index}
                file={file.src}
                uploadUrl={this.props.uploadUrl}
                handleDone={this.handleDone} />
        </Col>
    ));

    renderImages = () => {
        if (this.props.content.length === 0) {
            return (
                <Col
                    xs="12"
                    md="6"
                    xl="4">
                    <p>Ни одной панорамы еще не загружено</p>
                </Col>
            );
        }
        const { content } = this.props;
        return map(content, (image, i) => (
            <Col
                key={image.id || i}
                xs="12"
                md="6"
                xl="4">
                <Panorama
                    changePanId={this.props.changePanId}
                    image={image}
                    index={content?.length - i} />
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
                            md="6"
                            xl="4">
                            <Card>
                                <CardBody className="image-thumb image-thumb_small cursor-pointer">
                                    <Dropzone
                                        className="imageUpload"
                                        activeClassName="imageUpload--active"
                                        acceptClassName="imageUpload--accept"
                                        rejectClassName="imageUpload--reject"
                                        accept="image/*"
                                        onDrop={this.handleFileUpload}>
                                        <p>Зона загрузки контента</p>
                                    </Dropzone>
                                </CardBody>
                            </Card>
                        </Col>
                        {this.renderPreview()}
                        {this.renderImages()}
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

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaTab);
