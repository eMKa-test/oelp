import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import {
    Badge, Button, CardHeader, CardImg, CardSubtitle, CardTitle, Progress,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import placeholder from "../../../assets/placeholders/obj.jpg";

const BodyGroup = ({ group, forwardRef, onClick, children }) => {
    const { name, description } = group;
    const linesCount = group?.lines?.length;
    const [loadImage, setLoadImage] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [uploadImage, setUploadImage] = useState(null);
    const [groupImage, setGroupImage] = useState(group?.image?.tmb || placeholder);

    const handleFilePreview = useCallback((acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = function readerOnload() {
            setUploadImage(acceptedFiles[0]);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const getProgress = {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setLoadProgress(progress);
        },
    };

    const submitUploadImage = useCallback(() => {
        const upload = new FormData();
        upload.append("file", uploadImage);
        setLoadImage(true);
        axios
            .post(`/admin/api/groups/${group?.id}/uploadImage`, upload, getProgress)
            .then(({ data }) => {
                if (data.success) {
                    setTimeout(() => {
                        setUploadImage(null);
                        setLoadImage(false);
                        setLoadProgress(0);
                        setGroupImage(data?.payload?.image.src);
                        toast.success("Картинка загружена");
                    }, 400);
                }
            })
            .catch(() => {
                toast.error("Ошибка при загрузке картинки", { autoClose: 4000 });
                setLoadImage(false);
                setLoadProgress(0);
            });
    }, [group?.id, group?.image, uploadImage]);

    return (
        <React.Fragment>
            <div
                onClick={onClick}
                className="group-card image-overlay">
                {children}
                <CardImg src={groupImage} />
                <Dropzone
                    disableClick
                    ref={forwardRef}
                    disabled={Boolean(uploadImage)}
                    className="imageUploadGroup"
                    activeClassName="imageUpload--active"
                    acceptClassName="imageUpload--accept"
                    rejectClassName="imageUpload--reject"
                    accept="image/*"
                    onDrop={handleFilePreview}>
                    {uploadImage ? (
                        <div className="imageUploadGroup title">
                            <div>
                                <Button
                                    className="mr-2"
                                    color="light"
                                    onClick={() => setUploadImage(null)}>
                                    <i className="fa fa-times text-dark" />
                                </Button>
                                <Button
                                    color="success"
                                    onClick={submitUploadImage}>
                                    <i className="fa fa-check text-light" />
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </Dropzone>
            </div>
            {loadImage ? (
                <Progress
                    color="success"
                    value={loadProgress} />
            ) : (
                <CardHeader>
                    <div>
                        <CardTitle>
                            {name}
                        </CardTitle>
                        <CardSubtitle>{description || "Описание отсутствует"}</CardSubtitle>
                    </div>
                    <div className="card-header-toggler">
                        <Badge
                            title={`Привязанных отрезков: ${linesCount}`}
                            color="primary">
                            {linesCount}
                        </Badge>
                    </div>
                </CardHeader>
            )}
        </React.Fragment>
    );
};

BodyGroup.propTypes = {
    forwardRef: PropTypes.any,
    onClick: PropTypes.func,
    children: PropTypes.node,
    group: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        lines: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            }),
        ),
        image: PropTypes.shape({
            raw: PropTypes.string,
            src: PropTypes.string,
            tmb: PropTypes.string,
        }),
    }),
};

export default memo(BodyGroup);
