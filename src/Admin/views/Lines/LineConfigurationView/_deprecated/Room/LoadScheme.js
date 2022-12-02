import React, {
    memo, useRef, useCallback, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { getLineByID, getLineSchemes } from "../../../../../store/actionCreators/linesActions";
import { delData } from "../../../../../../api";
import { uploadLineScheme } from "../../../../../api/lineScheme";
import DeleteModal from "../../../../../common/DeleteModal";

const LoadScheme = (props) => {
    const {
        line,
        updateLine,
        contentType,
        dateFrom,
    } = props;
    const dispatch = useDispatch();
    const dropzone = useRef();
    const [load, setLoad] = useState(false);
    const [open, setOpen] = useState(false);
    const dropzoneTitle = line?.schemeImage ? "Поменять схему" : "Загрузить схему";
    console.log(line);

    const submitFile = useCallback((file) => {
        setLoad(true);
        uploadLineScheme({
            contentType,
            dateFrom,
            file,
            lineId: line.id,
        })
            .then(({ data }) => {
                if (data.success) {
                    dispatch(getLineSchemes());
                    toast.success("Схема загружена");
                }
            })
            .catch((e) => {
                warn(e, "upload err");
                const msg = `Ошибка: ${e?.response?.messages || e.message}`;
                toast.error(msg, { autoClose: 4000 });
            })
            .finally(() => {
                setLoad(false);
            });
    }, [contentType, dateFrom]);

    const changeScheme = useCallback((dropFiles) => {
        if (dropzone?.current) {
            let file;
            if (Array.isArray(dropFiles)) {
                if (dropFiles.length > 1) {
                    return toast.error("Доступна загрузка только одной схемы", { autoClose: 4000 });
                }
                [file] = dropFiles;
            } else {
                const drop = dropzone.current?.fileInputEl;
                drop.onchange = ({ target: { files } }) => {
                    if (files?.length > 1) {
                        return toast.error("Доступна загрузка только одной схемы", { autoClose: 4000 });
                    }
                    [file] = files;
                    return null;
                };
                return drop.click();
            }
            submitFile(file);
        }
        return null;
    }, [dropzone]);

    const removeScheme = useCallback((e) => {
        e.preventDefault();
        setLoad(true);
        const url = `/admin/api/lines/${line.id}/scheme`;
        delData(url)
            .then(() => {
                toast.success("Схема удалена");
                dispatch(getLineByID({
                    objectID: line.projectId,
                    id: line.id,
                }));
            })
            .catch((e) => {
                warn(e, "upload err");
                const msg = `Ошибка: ${e?.response?.messages || e.message}`;
                toast.error(msg, { autoClose: 4000 });
            })
            .finally(() => {
                setLoad(false);
                setOpen(false);
            });
    }, [updateLine]);

    return (
        <div className="scheme__dropzone__wrapper">
            <div className="scheme__dropzone">
                <Button
                    disabled={load}
                    className="dropzone__button"
                    onClick={changeScheme}
                    title={dropzoneTitle}>
                    <i
                        className="fa fa-upload"
                        aria-hidden="true" />
                </Button>
                <Dropzone
                    disabled={load}
                    title={dropzoneTitle}
                    ref={dropzone}
                    className="imageUpload schemeDropzone"
                    activeClassName="imageUpload--active"
                    acceptClassName="imageUpload--accept"
                    rejectClassName="imageUpload--reject"
                    accept="image/*"
                    onDrop={changeScheme} />
            </div>
            <Button
                outline
                color="danger"
                disabled={load}
                className="remove-scheme__button"
                onClick={() => setOpen(true)}
                title="Удалить схему">
                <i
                    className="fa fa-trash-o"
                    aria-hidden="true" />
            </Button>
            <DeleteModal
                submit={removeScheme}
                title="Подтверждение удаления схемы помещения"
                isOpen={open}
                toggleModal={() => setOpen(false)} />
        </div>
    );
};

LoadScheme.propTypes = {
    updateLine: PropTypes.func,
    contentType: PropTypes.string,
    dateFrom: PropTypes.string,
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        schemeImage: PropTypes.shape({
            src: PropTypes.string,
        }),
    }),
};

export default memo(LoadScheme);
