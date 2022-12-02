import React, {
    memo, useCallback, useState, useMemo,
} from "react";
import * as PropTypes from "prop-types";
import { Row, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadLayer from "./LoadLayer";
import DeleteModal from "../../../../../common/DeleteModal";
import { delData, fetchData } from "../../../../../../api";
import { getLineByID, putLine } from "../../../../../store/actionCreators/linesActions";
import { uploadType, nameFields } from "./helpers";
import "./style.css";

const LoadMapLayer = ({
    line,
    putLineById,
    updateLine,
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [load, setLoad] = useState(false);
    const linePhoto = useMemo(() => line?.mapLayerImage?.src, [line?.mapLayerImage]);
    const layerImageGPS = useMemo(() => line?.mapLayerGPS, [line?.mapLayerGPS]);
    const lineScheme = useMemo(() => line?.mapSchemeImage?.src, [line?.mapSchemeImage]);
    const layerSchemeGPS = useMemo(() => line?.mapSchemeGPS, [line?.mapSchemeGPS]);

    const onDrop = useCallback((layerType, file) => {
        setLoad(true);
        const url = `/admin/api/lines/${line.id}/${uploadType(layerType)}`;
        const body = new FormData();
        body.append("file", file);
        fetchData({
            url,
            method: "post",
            body,
        })
            .then(() => {
                updateLine({
                    objectID: line.projectId,
                    id: line.id,
                });
                toast.success("Изменения сохранены");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Ошибка", { autoClose: 4000 });
            })
            .finally(() => setLoad(false));
    }, [line?.id]);

    const onDelete = useCallback((layerType) => (e) => {
        e.preventDefault();
        const types = {
            photo: "mapLayer",
            scheme: "mapScheme",
        };
        if ((layerType === "photo" && !linePhoto) || (layerType === "scheme" && !lineScheme)) {
            setDeleteConfirm(null);
            return toast.error("Слой не загружен, чтобы его удалять", { autoClose: 4000 });
        }
        setLoad(true);
        const url = `/admin/api/lines/${line.id}/${types[layerType]}`;
        delData(url)
            .then(() => {
                toast.success("Схема удалена");
                updateLine({
                    objectID: line.projectId,
                    id: line.id,
                });
            })
            .catch((e) => {
                warn(e, "upload err");
                const msg = `Ошибка: ${e?.response?.messages || e.message}`;
                toast.error(msg, { autoClose: 4000 });
            })
            .finally(() => {
                setLoad(false);
                setDeleteConfirm(null);
            });
    }, [linePhoto, lineScheme]);

    const onSubmit = useCallback((layerType) => (e) => {
        e.preventDefault();
        let validFields = 0;
        nameFields.forEach((field, i) => {
            const el = e.target[field].value;
            if (el.trim() && !isNaN(Number(el)) && Math.trunc(el) <= 180 && Math.trunc(el) >= -180) {
                validFields += 1;
            }
        });
        if (validFields < 4) {
            toast.error("Не все поля заполнены или не корректное значение координат", { autoClose: 4000 });
        } else {
            const types = {
                scheme: "mapSchemeGPS",
                photo: "mapLayerGPS",
            };
            setLoad(true);
            putLineById({
                objectID: line.projectId,
                line: {
                    ...line,
                    [types[layerType]]: {
                        ne: {
                            lat: Number(e.target.neLat.value),
                            long: Number(e.target.neLong.value),
                        },
                        sw: {
                            lat: Number(e.target.swLat.value),
                            long: Number(e.target.swLong.value),
                        },
                        bounds: [
                            [Number(e.target.neLat.value), Number(e.target.neLong.value)],
                            [Number(e.target.swLat.value), Number(e.target.swLong.value)],
                        ],
                    },
                },
            });
            setLoad(false);
        }
    }, [line]);

    return (
        <div className="map-layer__dropzone__wrapper">
            <div className="map-layer__row">
                {load && (
                    <div className="dropping-container">
                        <Spinner color="primary" />
                    </div>
                )}
                <Row>
                    <LoadLayer
                        load={load}
                        onSubmit={onSubmit}
                        onDrop={onDrop}
                        onDelete={setDeleteConfirm}
                        type="photo"
                        layerGPS={layerImageGPS}
                        layerImage={linePhoto} />
                    <LoadLayer
                        load={load}
                        onSubmit={onSubmit}
                        onDrop={onDrop}
                        onDelete={setDeleteConfirm}
                        type="scheme"
                        layerGPS={layerSchemeGPS}
                        layerImage={lineScheme} />
                </Row>
            </div>
            <DeleteModal
                submit={onDelete(deleteConfirm)}
                toggleModal={() => setDeleteConfirm(null)}
                isOpen={Boolean(deleteConfirm)}
                title="Подтверждение удаления слоя" />
        </div>
    );
};

LoadMapLayer.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number.isRequired,
        projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        mapLayerImage: PropTypes.shape({
            src: PropTypes.string,
        }),
        mapSchemeImage: PropTypes.shape({
            src: PropTypes.string,
        }),
        mapSchemeGPS: PropTypes.shape({}),
        mapLayerGPS: PropTypes.shape({}),
    }),
    putLineById: PropTypes.func.isRequired,
    updateLine: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateLine: getLineByID,
    putLineById: putLine,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(LoadMapLayer));
