import React, {
    memo, useCallback, useMemo, useState, useEffect,
} from "react";
import * as PropTypes from "prop-types";
import {
    Col, Button, Label, Input,
} from "reactstrap";
import Dropzone from "react-dropzone";

const LoadLayer = ({
    onDelete, onDrop, type, layerImage = "none", onSubmit, layerGPS, load,
}) => {
    const [bg, setBg] = useState(layerImage);
    const [coords, setCoords] = useState({
        sw: {
            lat: layerGPS?.sw?.lat || "",
            long: layerGPS?.sw?.long || "",
        },
        ne: {
            lat: layerGPS?.ne?.lat || "",
            long: layerGPS?.ne?.long || "",
        },
    });
    const title = useMemo(() => (type === "photo" ? "фото" : "схему"), [type]);
    const isLayerImage = useMemo(() => (layerImage !== "none"), [layerImage]);

    useEffect(() => {
        setBg(layerImage);
    }, [layerImage]);

    useEffect(() => {
        setCoords({
            sw: {
                lat: layerGPS?.sw?.lat || "",
                long: layerGPS?.sw?.long || "",
            },
            ne: {
                lat: layerGPS?.ne?.lat || "",
                long: layerGPS?.ne?.long || "",
            },
        });
    }, [layerGPS]);

    const _onDrop = useCallback(([file]) => {
        if (file) {
            onDrop(type, file);
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onloadend = () => {
                setBg(fr.result);
            };
        }
    }, [onDrop, type]);

    const onChange = useCallback((a, b) => ({ target: { value } }) => {
        const res = { ...coords, [a]: { ...coords[a], [b]: value } };
        setCoords(res);
    }, [coords]);

    return (
        <Col
            xs={12}
            xl={6}>
            <div className="map-layer__container">
                <div className="map-layer__dropzone">
                    <Dropzone
                        disabled={load}
                        title="Загрузить слой-картинку"
                        className="imageUpload layer-dropzone"
                        activeClassName="imageUpload--active"
                        acceptClassName="imageUpload--accept"
                        rejectClassName="imageUpload--reject"
                        accept="image/*"
                        onDrop={_onDrop}>
                        <div
                            style={{ backgroundImage: `url(${bg})` }}
                            className="map-layer__dropzone overlay" />
                        {!isLayerImage && (
                            <span>
                                Загрузить
                                {" "}
                                слой -
                                {" "}
                                {title}
                            </span>
                        )}
                    </Dropzone>
                </div>
                <form
                    onSubmit={onSubmit(type)}
                    className="map-layer__control">
                    <div className="fields-row">
                        <p className="title">с-з угол</p>
                        <Label>
                            <Input
                                onChange={onChange("ne", "lat")}
                                value={coords?.ne?.lat}
                                name="neLat"
                                placeholder="-180 >= Широта (lat) <= 180"
                                disabled={!isLayerImage || load}
                                type="text" />
                        </Label>
                        <br />
                        <Label>
                            <Input
                                onChange={onChange("ne", "long")}
                                value={coords?.ne?.long}
                                name="neLong"
                                placeholder="-180 >= Долгота (long) <= 180"
                                disabled={!isLayerImage || load}
                                type="text" />
                        </Label>
                    </div>
                    <div className="fields-row">
                        <p className="title">ю-в угол</p>
                        <Label>
                            <Input
                                onChange={onChange("sw", "lat")}
                                value={coords?.sw?.lat}
                                name="swLat"
                                placeholder="-180 >= Широта (lat) <= 180"
                                disabled={!isLayerImage || load}
                                type="text" />
                        </Label>
                        <br />
                        <Label>
                            <Input
                                onChange={onChange("sw", "long")}
                                value={coords?.sw?.long}
                                name="swLong"
                                placeholder="-180 >= Долгота (long) <= 180"
                                disabled={!isLayerImage || load}
                                type="text" />
                        </Label>
                    </div>
                    <div className="submit-wrapper">
                        <Button
                            disabled={load || layerImage === "none"}
                            outline
                            color="danger"
                            className="button remove-layer__button"
                            onClick={() => onDelete(type)}
                            title="Удалить">
                            <i className="fa fa-trash-o" />
                        </Button>
                        <Button
                            disabled={load || layerImage === "none"}
                            type="submit"
                            color="success"
                            className="button submit-layer__button"
                            title="Сохранить">
                            <i className="fa fa-check" />
                        </Button>
                    </div>
                </form>
            </div>
        </Col>
    );
};

LoadLayer.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    load: PropTypes.bool,
    type: PropTypes.string.isRequired,
    layerImage: PropTypes.string,
    layerGPS: PropTypes.shape({
        ne: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
        sw: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
    }),
};

export default memo(LoadLayer);
