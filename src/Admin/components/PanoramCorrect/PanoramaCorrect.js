import React from "react";
import * as PropTypes from "prop-types";
import M from "marzipano";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import isArray from "lodash/isArray";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import memoize from "lodash/memoize";
import {
    toRad,
    sortPans,
    toDeg,
    toRoundNum,
    convertRotate,
    getSourceAndGeometry,
    controlConfig, mouseControlsIds,
} from "./helpers";
import SeparateControl from "./SeparateControl";
import {
    transitionStyle, opacity, fromCenterAndOpacity, fromWhite,
} from "./settings";
import { delData, getData, postData } from "../../../api";
import ContentDefView from "./ContentDefView";
import "./style.css";
import { togglePanoramaMouseControl } from "../../store/actionCreators/panoramaActions";
import { getContent } from "../../store/actionCreators/contentActions";

const limiter = M.RectilinearView.limit.traditional(
    1024 * 3,
    toRad(100),
);

const initialView = {
    yaw: 0,
    pitch: 0,
    fov: (100 * Math.PI) / 180,
};

const wrapperStyle = memoize((mouseControl) => {
    return { pointerEvents: mouseControl ? "all" : "none" };
});

class PanoramaCorrect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewer: null,
            view: new M.RectilinearView(initialView, limiter),
            scenes: [],
            index: 0,
            yaw: 0,
            contentViews: [],
            contentView: null,
            currentPanorama: null,
        };
    }

    node = React.createRef();

    cancel = [];

    componentDidMount() {
        this.initialPanoramas();
        this.state.view.addEventListener("change", this.handleYaw);
    }

    getContentDefView = (callback = () => null) => {
        const { date, contentType, params: { id: lineId } } = this.props;
        const mainUrl = "/admin/api/contentDefViewAngle/";
        const params = {
            contentType: contentType.toUpperCase(),
            date,
            lineId,
        };
        getData({
            mainUrl,
            params,
        }).then((res) => {
            if (res.success) {
                this.setContentView(this.state.index);
                this.setState({ contentViews: res.payload });
            } else {
                throw new Error(res.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Неизвестная ошибка при загрузке данных", { autoClose: 4000 });
        }).finally(callback);
    };

    initialPanoramas = (callback) => {
        const { content } = this.props;
        this.getContentDefView(() => {
            const viewer = new M.Viewer(this.node.current);
            const controls = viewer.controls();
            controlConfig.forEach((item) => {
                controls.registerMethod(item.id, new M.KeyControlMethod(...item.options), true);
            });
            const arr = [...content].sort(sortPans);
            const scenes = arr.map((pan) => ({
                ...pan,
                scene: viewer.createScene({
                    ...getSourceAndGeometry(pan),
                    view: this.state.view,
                }),
            }));
            this.setState({
                viewer,
                controls,
                scenes,
            }, () => {
                callback ? callback() : this.props.changePanId(scenes[0].id);
                this.toggleMouseControl();
            });
        });
    };

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.content, this.props.content)) {
            this.initialPanoramas(() => this.switchScene());
        }
        if (prevProps.panoramEditMode !== this.props.panoramEditMode && this.props.panoramEditMode) {
            this.props.setPanProp("startEdit", this.state.view.yaw());
        }
        if (prevProps.id !== this.props.id) {
            const newIndex = this.state.scenes.findIndex(({ id }) => id === this.props.id);
            this.switchScene(newIndex);
        }
        if (prevProps.mouseControl !== this.props.mouseControl) {
            this.toggleMouseControl();
        }
    }

    toggleMouseControl = () => {
        const { mouseControl } = this.props;
        const { controls } = this.state;
        if (mouseControl) {
            mouseControlsIds.forEach((methodId) => {
                controls.enableMethod(methodId);
            });
        } else {
            mouseControlsIds.forEach((methodId) => {
                controls.disableMethod(methodId);
            });
        }
    }

    handleYaw = () => {
        this.setState({ yaw: this.state.view.yaw() });
    };

    componentWillUnmount() {
        this.state.view.removeEventListener("change", this.handleYaw);
        this.props.toggleMouseControl(false);
        if (this.state.viewer) {
            controlConfig.forEach((m) => {
                this.state.viewer.controls().unregisterMethod(m.id);
            });
            this.state.viewer.destroy();
        }
    }

    setContentView = (index = this.state.index) => {
        const contentView = this.state.contentViews.find((cv) => cv.pointId === index + 1);
        this.setState({
            contentView: contentView || null,
        });
    }

    onSubmitContentDefView = () => {
        if (!this.state.currentPanorama?.pointId) {
            return toast.error(
                "PointId панорамы неизвестен. Обновите сет контента перед этим действием",
                { autoClose: 4000 },
            );
        }
        const { date, contentType, params: { id: lineID, projectId: objectID } } = this.props;
        const mainUrl = "/admin/api/contentDefViewAngle";
        const body = {
            lineId: lineID,
            pointId: this.state.currentPanorama.pointId,
            contentType,
            date,
            viewAngle: Math.round(toDeg(this.state.yaw)),
        };
        postData({
            mainUrl,
            body,
        }).then((res) => {
            if (res.success) {
                toast.success("Изменения сохранены");
                this.getContentDefView(this.setContentView);
                this.props.updateContent({
                    objectID,
                    lineID,
                    contentType,
                    dateFrom: date,
                });
            } else {
                toast.error("Неизвестна ошибка", { autoClose: 4000 });
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Неизвестна ошибка", { autoClose: 4000 });
        });
    };

    onDelete = () => {
        const { date, contentType, params: { id: lineID, projectId: objectID } } = this.props;
        const url = `/admin/api/contentDefViewAngle/${this.state.contentView.id}`;
        delData(url).then((res) => {
            if (res.success) {
                toast.success("Изменения сохранены");
                this.getContentDefView(this.setContentView);
                this.props.updateContent({
                    objectID,
                    lineID,
                    contentType,
                    dateFrom: date,
                });
            } else {
                toast.error("Неизвестна ошибка", { autoClose: 4000 });
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Неизвестна ошибка", { autoClose: 4000 });
        });
    };

    removeSpots = (scene, callback = () => null) => {
        const spotList = scene.hotspotContainer().listHotspots();
        spotList.forEach((spot) => {
            scene.hotspotContainer().destroyHotspot(spot);
        });
        callback();
    };

    switchScene = (index = this.state.index) => {
        this.setContentView(index);
        const panorama = this.state.scenes[index];
        this.props.setPanProp("currentPanoramEdit", panorama);
        this.props.setPanProp("baseAngel", panorama.viewAngle || 0);
        this.removeSpots(panorama.scene);
        this.setState({
            index,
            currentPanorama: panorama,
        }, () => {
            this.state.view.setParameters({ yaw: toRad(panorama.defaultViewAngle) });
            panorama.scene.switchTo({
                transitionDuration: 300,
                transitionUpdate: fromWhite(transitionStyle().elastic),
            }, () => {
                this.createSteps();
            });
        });
    };

    createSteps = () => {
        const { currentPanorama, scenes } = this.state;
        if (isArray(currentPanorama.directions)) {
            currentPanorama.directions.forEach((pan) => {
                let yaw = toRad(pan.angle);
                const spot = document.createElement("div");
                const panIndex = scenes.findIndex((pano) => pano.id === pan.contentId);
                spot.classList.add("stepper__spot", "stepper__next");
                spot.innerHTML = panIndex + 1;
                if (typeof currentPanorama.viewAngle === "number") {
                    yaw += toRad(currentPanorama.viewAngle);
                }
                const position = { yaw, pitch: 0 };
                spot.addEventListener("click", () => {
                    this.props.changePanId(pan.contentId);
                });
                currentPanorama.scene.hotspotContainer().createHotspot(spot, position, {});
            });
        }
    };

    render() {
        const {
            yaw,
            view,
            contentView,
        } = this.state;
        const { panoramEditMode, baseAngel, mouseControl } = this.props;
        const baseCoords = view.coordinatesToScreen({ yaw: toRad(baseAngel), pitch: 0 });
        const baseShiftX = baseCoords ? toRoundNum(((baseCoords.x) / view._width) * 100) : -2;
        let editBG = "yellow";
        if (baseAngel - convertRotate(toDeg(yaw)) >= -0.5 && baseAngel - convertRotate(toDeg(yaw)) <= 0.5) {
            editBG = "lime";
        }
        return (
            <React.Fragment>
                <div
                    className="marz-container_correct">
                    <span
                        className="correct-pan_separate__base-pos"
                        style={{ left: `${baseShiftX}%` }}>
                        <span className="correct-pan_separate__base__description">
                            Базовый угол
                            {
                                ` ${baseAngel}°`
                            }
                        </span>
                    </span>
                    <span
                        className={`correct-pan_separate__cur-pos ${editBG === "lime" && "start-edit"}`}
                        style={{ left: "50%", borderColor: editBG }} />
                    {
                        panoramEditMode && (
                            <SeparateControl
                                yaw={this.state.yaw}
                                view={view}
                                startEdit={this.props.startEdit}
                                setPanProp={this.props.setPanProp} />
                        )
                    }
                    <div
                        className="marz-container_wrapper-panorams">
                        <div
                            style={wrapperStyle(mouseControl)}
                            ref={this.node}
                            className="panos" />
                        <ContentDefView
                            onDelete={this.onDelete}
                            onSubmit={this.onSubmitContentDefView}
                            contentView={contentView}
                            yaw={yaw} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PanoramaCorrect.propTypes = {
    setPanProp: PropTypes.func.isRequired,
    changePanId: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
    toggleMouseControl: PropTypes.func.isRequired,
    contentType: PropTypes.string,
    date: PropTypes.string,
    id: PropTypes.number,
    startEdit: PropTypes.number,
    params: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.number,
    }),
    content: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
    })),
    panoramEditMode: PropTypes.bool,
    mouseControl: PropTypes.bool,
    baseAngel: PropTypes.number,
};

const mapStateToProps = (store) => ({
    content: store.content.content,
    contentType: store.content.contentType,
    date: store.content.dateFrom,
    mouseControl: store.panorama.mouseControl,
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        toggleMouseControl: togglePanoramaMouseControl,
        updateContent: getContent,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaCorrect);
