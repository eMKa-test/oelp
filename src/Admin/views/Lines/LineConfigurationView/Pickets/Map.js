import React, {
    memo, useCallback, useState, useRef,
} from "react";
import * as PropTypes from "prop-types";
import {
    Map, TileLayer, Marker, Tooltip, Popup,
} from "react-leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import { Spinner, Button } from "reactstrap";
import { toast } from "react-toastify";
import { satelliteUrl } from "../../../../components/Map/constants";
import PicketInput from "./PicketInput";
import DeleteModal from "../../../../common/DeleteModal";
import { postData, delData, putData } from "../../../../../api";
import {
    icon, iconEdit, iconNew, getInitialView,
} from "./helpers";

function PicketMap(props) {
    const {
        loading,
        line,
        updatePickets,
        userId,
        pickets,
    } = props;
    const [picket, setPicket] = useState(null);
    const [editPicket, setEditPicket] = useState(null);
    const [confirmDelete, openConfirmDelete] = useState(null);
    const initialView = getInitialView(pickets, line.gps);
    const mapRef = useRef();

    const _setPicket = useCallback(({ latlng }) => {
        const result = {
            gps: {
                lat: latlng.lat,
                long: latlng.lng,
            },
        };
        if (editPicket) {
            setEditPicket({ ...editPicket, ...result });
        } else {
            setPicket(result);
        }
    }, [editPicket]);

    const onChange = useCallback((name) => {
        if (editPicket) {
            setEditPicket({
                ...editPicket,
                name,
            });
        } else {
            setPicket({
                ...picket,
                name,
            });
        }
    }, [picket, editPicket]);

    const onCancel = useCallback(() => {
        setPicket(null);
        setEditPicket(null);
    }, []);

    const onSubmit = useCallback(() => {
        if ((picket && !picket?.name?.trim()) || (editPicket && !editPicket?.name?.trim())) {
            return toast.error("Не указано название пикета");
        }
        let mainUrl = "/admin/api/pickets/";
        const params = {
            userId,
            lineId: line.id,
        };
        let body;
        let fetchData;
        if (editPicket) {
            mainUrl += editPicket.id;
            fetchData = putData;
            body = {
                ...params,
                ...editPicket,
            };
        } else {
            fetchData = postData;
            body = {
                ...params,
                ...picket,
            };
        }
        fetchData({
            mainUrl,
            body,
        })
            .then((res) => {
                if (res.success) {
                    let msg = "Пикет";
                    if (editPicket) {
                        msg += " изменен";
                        setEditPicket(null);
                    } else {
                        msg += " добавлен";
                        setPicket(null);
                    }
                    updatePickets();
                    toast.success(msg);
                }
            })
            .catch((err) => {
                const msg = `Ошибка. ${err.message || err.response.message}`;
                toast.error(msg, { autoClose: 4000 });
            });
        return null;
    }, [picket, editPicket, line, updatePickets]);

    const onDelete = useCallback((pick) => {
        if (picket) {
            setPicket(null);
        }
        openConfirmDelete({ ...pick });
    }, [picket]);

    const onEdit = useCallback((pick) => {
        if (picket) {
            setPicket(null);
        }
        setEditPicket(pick);
    }, [picket]);

    const onConfirmDelete = useCallback((pickId) => (e) => {
        e.preventDefault();
        const url = `/admin/api/pickets/${pickId}`;
        delData(url)
            .then((res) => {
                if (res.success) {
                    toast.success("Пикет удален");
                }
            })
            .catch((err) => {
                const msg = `Ошибка. ${err.message || err.response.message}`;
                toast.error(msg);
            })
            .finally(() => {
                updatePickets();
                setPicket(null);
                openConfirmDelete(null);
            });
    }, []);

    const onOpenPopup = useCallback(() => {
        if (picket) {
            setPicket(null);
        }
    }, [picket]);

    return (
        <div className="PicketMap">
            {loading ? (
                <div
                    className="content-tab-loader__map map-loader_show">
                    <Spinner
                        type="grow"
                        color="primary" />
                </div>
            ) : null}
            <PicketInput
                onDelete={onDelete}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onChange={onChange}
                updatePickets={updatePickets}
                picket={picket || editPicket} />
            <Map
                {...initialView}
                ref={mapRef}
                onClick={_setPicket}
                id="map"
                zoomSnap={1.4}
                gestureHandling
                className="PicketMap__map"
                maxZoom={21}
                doubleClickZoom={false}>
                <TileLayer
                    maxZoom={21}
                    crossOrigin
                    url={satelliteUrl} />
                {picket ? (
                    <Marker
                        position={Object.values(picket.gps)}
                        icon={iconNew}>
                        {picket?.name && (
                            <Tooltip
                                className="picket-marker"
                                direction="top"
                                permanent>
                                <p className="picket-marker__tooltip__description">
                                    {picket.name}
                                </p>
                            </Tooltip>
                        )}
                    </Marker>
                ) : null}
                {editPicket ? (
                    <Marker
                        position={Object.values(editPicket.gps)}
                        icon={iconNew}>
                        {editPicket?.name && (
                            <Tooltip
                                className="picket-marker"
                                direction="top"
                                permanent>
                                <p className="picket-marker__tooltip__description">
                                    {editPicket.name}
                                </p>
                            </Tooltip>
                        )}
                    </Marker>
                ) : null}
                {pickets?.map((pick) => (
                    <Marker
                        key={pick.id}
                        position={Object.values(pick.gps)}
                        icon={editPicket?.id === pick.id ? iconEdit : icon}>
                        <Popup onOpen={onOpenPopup}>
                            <div className="picket-marker__popup">
                                <Button
                                    className="btn-danger btn-sm"
                                    onClick={(e) => onDelete(pick)}>
                                    <i className="fa fa-times" />
                                </Button>
                                <Button
                                    className="btn-warning btn-sm ml-2"
                                    onClick={() => onEdit(pick)}>
                                    <i className="fa fa-pencil" />
                                </Button>
                            </div>
                        </Popup>
                        <Tooltip
                            className="picket-marker"
                            direction="top"
                            permanent>
                            <p className="picket-marker__tooltip__description">
                                {pick.name}
                            </p>
                        </Tooltip>
                    </Marker>
                ))}
            </Map>
            <DeleteModal
                title={`Подтверждение удаление пикета "${confirmDelete?.name}"`}
                isOpen={Boolean(confirmDelete)}
                toggleModal={() => openConfirmDelete(false)}
                submit={onConfirmDelete(confirmDelete?.id)} />
        </div>
    );
}

PicketMap.propTypes = {
    loading: PropTypes.bool,
    updatePickets: PropTypes.func,
    userId: PropTypes.number,
    line: PropTypes.shape({
        id: PropTypes.number,
        gps: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
    }),
    pickets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            gps: PropTypes.shape({
                lat: PropTypes.number,
                long: PropTypes.number,
            }),
        }),
    ),
};

export default memo(PicketMap);
