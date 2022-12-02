import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import DropZone from "../DropZone";
import {
    addUploadForRegister, removeUploadForRegister,
} from "../../store/actionsCreator/uploadActions";
import { renameFile } from "../../common/helpers";

const initialContent = {
    files: [],
};

const typeRules = ["mp4", "jpg", "jpeg"];

const ContentCard = (props) => {
    const {
        addContent,
        removeContent,
        line,
        contentType,
    } = props;
    const [content, setContent] = useState(initialContent);
    const contentLen = content.files.length;

    const onDrop = useCallback((files) => {
        if (!files.length) {
            return null;
        }
        const _files = [];
        files.forEach((f) => {
            const type = f.name.split(".")[1];
            if (typeRules.includes(type.toLowerCase())) {
                _files.push(renameFile(f, f.name.toLowerCase()));
            } else {
                const msg = `Допустимы JPG | JPEG форматы. ${f.name} - не был добавлен в сет`;
                toast.error(msg);
            }
        });
        if (_files.length === 0) {
            return null;
        }
        const uploadInfo = {
            files: [..._files],
            lineId: line.id,
            projectId: line.projectId,
            contentType: contentType.type,
        };
        setContent({
            ...content,
            files: [...content.files, ..._files],
        });
        return addContent({ ...uploadInfo });
    }, [line, contentType.type, content]);

    const onRemove = useCallback(() => {
        setContent(initialContent);
        removeContent({
            lineId: line.id,
            projectId: line.projectId,
            contentType: contentType.type,
        });
    }, []);

    return (
        <DropZone
            accept={contentType.accept}
            contentLen={contentLen}
            contentType={contentType.type}
            title={contentType.name}
            onRemove={onRemove}
            onDrop={onDrop}
            files={content.files} />
    );
};

ContentCard.propTypes = {
    addContent: PropTypes.func,
    removeContent: PropTypes.func,
    line: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
        projectId: PropTypes.number,
    }),
    contentType: PropTypes.shape({
        name: PropTypes.string,
        accept: PropTypes.string,
        type: PropTypes.string,
        subTypes: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addContent: addUploadForRegister,
    removeContent: removeUploadForRegister,
}, dispatch);

export default connect(null, mapDispatchToProps)(memo(ContentCard));
