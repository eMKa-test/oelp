import React from "react";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import {
    Button, Card, CardBody, Progress,
} from "reactstrap";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Prompt } from "react-router-dom";
import { toast } from "react-toastify";
import VideoPlayer from "../../common/VideoPlayer";

const VideoBackground = (props) => {
    const [src, setSrc] = React.useState(null);
    const [upload, setUpload] = React.useState(null);
    const [progress, setProgress] = React.useState(0);

    const handleFilePreview = (acceptedFiles) => {
        const [file] = acceptedFiles;
        setSrc(file.preview);
        setUpload(file);
    };

    const submitFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", upload);
        try {
            const { data } = await axios.post(`${props.uploadUrl}/uploadVideo`, formData, {
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                },
            });
            if (data.success) {
                setUpload(null);
                toast.success("Видео загружено");
            } else {
                toast.error("Неизвестная ошибка", { autoClose: 4000 });
            }
        } catch (e) {
            toast.error(`Ошибка. ${e.message || e.response.message}`, { autoClose: 4000 });
            warn(e, "upload err");
        }
    };

    const current = get(props, "video.src", null);

    React.useEffect(() => {
        setSrc(current || null);
    }, [current]);

    return (
        <Card className="mb-0">
            <CardBody className="image-thumb-company cursor-pointer">
                <Dropzone
                    disabled
                    className="imageUpload"
                    activeClassName="imageUpload--active"
                    acceptClassName="imageUpload--accept"
                    rejectClassName="imageUpload--reject"
                    disabledClassName="imageUpload--disabled"
                    accept="video/*"
                    onDrop={handleFilePreview}>
                    {src ? (
                        <VideoPlayer
                            style={{
                                width: "80%",
                                maxHeight: "100%",
                                background: "lightgrey",
                            }}
                            className=""
                            src={src} />
                    ) : (
                        <p>Зона загрузки фонового видео</p>
                    )}
                </Dropzone>
                {upload && (progress === 0 || progress === 100) ? (
                    <Button
                        className="imageSaveBtn"
                        color="success"
                        onClick={submitFileUpload}>
                        <i className="icon-cloud-upload icons d-block" />
                    </Button>
                ) : null}
            </CardBody>
            {progress > 0 && progress < 100 ? (
                <Progress
                    className="ProgressBar"
                    value={progress} />
            ) : null}
            <Prompt
                when={Boolean(upload)}
                message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
        </Card>
    );
};

VideoBackground.propTypes = {
    uploadUrl: PropTypes.string.isRequired,
};

export default React.memo(VideoBackground);
