import React, { memo } from "react";
import * as PropTypes from "prop-types";
import {
    Card, CardBody,
    CardTitle, CardHeader, Button, FormGroup,
} from "reactstrap";
import PanoramaPreview from "./PanoramaPreview";
import "./style.css";

const MarkerCard = (props) => {
    const {
        marker,
        setDeadEnd,
        deadEnd,
        arrowsMode,
        setArrowsMode,
        onSave,
        canBeReset,
    } = props;

    return (
        <Card>
            <CardHeader>
                <CardTitle tag="h5">
                    pointId:
                    {" "}
                    {marker.pointId || marker.index}
                    &nbsp;
                    &#47;
                    id:
                    {" "}
                    {marker.id}
                </CardTitle>
            </CardHeader>
            <PanoramaPreview image={marker.src.src} />
            <CardBody>
                <FormGroup className="card-panel-control">
                    <div className="top-control">
                        <Button
                            disabled={deadEnd}
                            onClick={setArrowsMode}
                            outline={!arrowsMode}
                            className="mr-2"
                            title="Нажать и выбрать маркер для нового перехода"
                            color="warning">
                            <i className="fa fa-yahoo" />
                        </Button>
                        <Button
                            title="Сделать тупиком"
                            onClick={() => setDeadEnd(!deadEnd)}
                            outline
                            className="dead-end"
                            color="warning">
                            <div className="checkbox-emulate">
                                тупик
                                <span>
                                    <i className={`fa fa-check check-icon ${deadEnd ? "show-check" : "hide-check"}`} />
                                </span>
                            </div>
                        </Button>
                    </div>
                    <Button
                        className="reset"
                        title="Вернуть исходный переход"
                        disabled={!canBeReset}
                        onClick={onSave(marker.pointId)}
                        color="primary">
                        <i className="fa fa-undo" />
                    </Button>
                </FormGroup>
            </CardBody>
        </Card>
    );
};

MarkerCard.propTypes = {
    marker: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        position: PropTypes.arrayOf(PropTypes.number),
        pointId: PropTypes.number,
        description: PropTypes.string,
        src: PropTypes.shape({
            src: PropTypes.string,
        }),
    }),
    onSave: PropTypes.func.isRequired,
    setDeadEnd: PropTypes.func.isRequired,
    deadEnd: PropTypes.bool.isRequired,
    canBeReset: PropTypes.bool.isRequired,
    arrowsMode: PropTypes.bool.isRequired,
    setArrowsMode: PropTypes.func.isRequired,
};

export default memo(MarkerCard);
