import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Spinner, Button } from "reactstrap";
import { toast } from "react-toastify";
import { getData, putData } from "../../common/ContentProvider/fetch";
import useKonva from "./useKonva";
import data from "../../../assets/roomSchemes/schemes";
import "./style.css";

const RoomCorrect = (props) => {
    const { lineID, params, dateFrom } = props;
    const [stage, drawScheme, loadMarkers, markers, onCancel] = useKonva();
    const [load, setLoad] = useState(true);
    const [saveLoad, setSaveLoad] = useState(false);

    const fetchData = async (url, body) => {
        try {
            const promise = await getData({ url, params: body });
            return await promise;
        } catch (e) {
            console.warn("Wrong request in LeafLet Component...", e);
            return null;
        }
    };

    const fetchMarkers = useCallback(() => {
        const { id, projectId } = params;
        const url = `/admin/api/projects/${projectId}/lines/${id}/content/panorama`;
        return fetchData(url, { dateFrom }).then((res) => {
            if (res.success) {
                loadMarkers(res.payload.reverse());
            }
        });
    }, [stage, dateFrom]);

    useEffect(() => {
        if (stage) {
            setLoad(true);
            drawScheme(data[lineID]?.src, () => {
                setLoad(false);
                fetchMarkers();
            });
        }
    }, [stage, dateFrom]);

    const onSave = useCallback(() => {
        setSaveLoad(true);
        const groups = stage.findOne("#dots").children;
        groups.forEach((layer, i) => {
            markers[i].meta = {
                schemePosition: {
                    ...markers[i]?.meta?.position,
                    ...layer.attrs?.schemePosition,
                },
            };
        });
        const fetches = markers.map((marker) => {
            const url = `/admin/api/projects/${params.projectId}/lines/${lineID}/content/panorama/${marker.id}`;
            return putData({
                url,
                body: { ...marker },
            });
        });
        Promise.all(fetches)
            .then(() => toast.success("Изменения сохранены"))
            .catch((err) => {
                const errMsg = `Ошибка: ${err?.response?.message || err?.message}`;
                toast.error(errMsg, { autoClose: 4000 });
            }).finally(() => setSaveLoad(false));
    }, [stage, markers]);

    return (
        <div className="room-correct__container">
            <div className="room-correct__control">
                <div style={{ display: "flex" }}>
                    <Button
                        title="Отмена"
                        disabled={saveLoad || !markers?.length}
                        className="room-correct__cancel-btn mr-2"
                        color="warning"
                        onClick={onCancel}>
                        <i className="fa fa-times text-dark" />
                    </Button>
                    <Button
                        title="Сохранить"
                        disabled={saveLoad || !markers?.length}
                        className="room-correct__save-btn"
                        color={saveLoad ? "light" : "success"}
                        onClick={onSave}>
                        {saveLoad ? (
                            <Spinner
                                className="save-btn__loader"
                                size="sm" />
                        ) : null}
                        <i className="fa fa-check text-light" />
                    </Button>
                </div>
            </div>
            {load ? (
                <Spinner
                    size="sm"
                    color="primary" />
            ) : null}
            <div
                id="konva-container"
                className="konva-container" />
        </div>
    );
};

RoomCorrect.propTypes = {
    lineID: PropTypes.string,
    dateFrom: PropTypes.string,
    params: PropTypes.shape({
        projectId: PropTypes.number,
    }),
};

export default memo(RoomCorrect);
