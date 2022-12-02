import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    addUploadForRegister,
    removeUploadForRegister,
} from "../../store/actionsCreator/uploadActions";
import DropZone from "../DropZone";
import { renameFile } from "../../common/helpers";

const types = ["mp4", "srt"];

const AerialCard = (props) => {
    const {
        contentType,
        addContent,
        removeContent,
        projectId,
        lineId,
    } = props;
    const initialContent = {
        files: [],
        [types[0]]: [],
        [types[1]]: [],
    };
    const [content, setContent] = useState({ ...initialContent });
    const contentLen = content.files.length;

    useEffect(() => {
        if (content[types[1]].length > 0) {
            const mp4Files = content[types[0]].map((f) => f.name.split(".")[0]);
            content[types[1]].forEach((f) => {
                const name = f.name.split(".")[0];
                if (!mp4Files.includes(name)) {
                    toast.error(
                        "Доступные файлы для загрузки MP4 | SRT ",
                        { autoClose: 4000 },
                    );
                }
            });
        }
    }, [content]);

    const onDrop = useCallback((files) => {
        if (!files.length) {
            return null;
        }
        const renamedFiles = files.map((f) => renameFile(f, f.name.toLowerCase()));
        let isCorrect = true;
        const _files = {
            ...content,
            files: [...content.files, ...renamedFiles],
        };
        renamedFiles.forEach((f) => {
            const type = f.name.split(".")
                .slice(1)
                .join();
            if (!types.includes(type.toLowerCase())) {
                isCorrect = false;
                const msg = `У файла ${f.name} - не верный формат.`;
                toast.error(msg, { autoClose: 4000 });
            } else {
                _files[type.toLowerCase()].push(f);
            }
        });
        if (isCorrect) {
            const uploadConfig = {
                files: [...renamedFiles],
                lineId,
                projectId,
                contentType: "AERIAL",
            };
            setContent({
                ...content,
                files: [...content.files, ...renamedFiles],
            });
            return addContent(uploadConfig);
        }
        return null;
    }, [lineId, projectId, contentType.type, content]);

    const onRemove = useCallback(() => {
        setContent({ ...initialContent });
        removeContent({
            lineId,
            projectId,
            contentType: contentType.type,
        });
    }, [content]);

    return (
        <DropZone
            contentLen={contentLen}
            contentType={contentType.type}
            title={contentType.name}
            isAerial
            onRemove={onRemove}
            onDrop={onDrop}
            subTitle="MP4 | SRT"
            files={[content[types[0]], content[types[1]]]} />
    );
};

AerialCard.propTypes = {
    contentType: PropTypes.shape({
        name: PropTypes.string,
        subTypes: PropTypes.arrayOf(PropTypes.shape({})),
        type: PropTypes.string,
    }),
    line: PropTypes.shape({
        id: PropTypes.number,
    }),
    lineId: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired,
    removeContent: PropTypes.func.isRequired,
    addContent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addContent: addUploadForRegister,
    removeContent: removeUploadForRegister,
}, dispatch);

export default connect(null, mapDispatchToProps)(memo(AerialCard));
