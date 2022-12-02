import React, {
    memo, useCallback, useState,
} from "react";
import Header from "./Header";
import ErrorBoundary from "../../../Admin/common/ErrorBoundary";
import UploadingFile from "./Cards/UploadingFile";
import FilesForUpload from "./Cards/FilesForUpload";
import "./style.css";

const ProgressCard = () => {
    const [showSlide, setSlideShow] = useState(false);

    const toggleSlide = useCallback((value) => {
        setSlideShow(value);
    }, [showSlide]);

    return (
        <div className={`card-progress card-progress__wrapper ${showSlide ? "show" : "hide"}`}>
            <Header
                showSlide={showSlide}
                toggleSlide={toggleSlide} />
            <div className="body">
                <ErrorBoundary>
                    <div className="card-files__wrapper">
                        <UploadingFile />
                        <FilesForUpload />
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default memo(ProgressCard);
