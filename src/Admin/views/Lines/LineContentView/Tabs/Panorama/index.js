import React from "react";
import * as PropTypes from "prop-types";
import axios from "axios";
import { Button, ButtonGroup } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import PanoramaTab from "./PanoramaTab";
import GPSCorrect from "../../../../../components/Map/ReactLeaflet";
import PanoramaCorrect from "../../../../../components/PanoramCorrect";
import StepsOrder from "../../../../../components/StepsOrder";
import AngleMod from "./AngleMod";
import { toRoundNum } from "../../../../../components/PanoramCorrect/helpers";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { resetEditMode, setActiveMarker } from "../../../../../store/actionCreators/mapActions";
import {
    getContentLoops,
    getContentRoutes,
    changePanoramaTab,
} from "../../../../../store/actionCreators/panoramaActions";
import ErrorBoundary from "../../../../../common/ErrorBoundary";

class Panorama extends React.Component {
    static propTypes = {
        currentLine: PropTypes.object,
        dateFrom: PropTypes.string,
        objectID: PropTypes.string,
        panoramaTab: PropTypes.string,
        lineID: PropTypes.string,
        contentType: PropTypes.string,
        updateItem: PropTypes.func,
        setActive: PropTypes.func,
        getContentLoops: PropTypes.func,
        getContentRoutes: PropTypes.func,
        resetEditMode: PropTypes.func,
        changePanoramaTab: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            correctAngel: 0,
            baseAngel: 0,
            startEdit: null,
            panoramEditMode: false,
            currentPanoramEdit: null,
            id: null,
            selectedSublineMarkers: [],
        };
    }

    componentDidMount() {
        this.props.getContentLoops({
            lineId: this.props.currentLine.id,
            contentType: "panorama",
        });
        this.props.getContentRoutes({
            lineId: this.props.currentLine.id,
            contentType: "panorama",
            date: this.props.dateFrom,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.id !== this.state.id) {
            const marker = this.props.content.find((m) => m.id === this.state.id);
            if (marker) {
                this.props.setActive(marker);
            } else {
                this.props.resetEditMode();
            }
        }
        if (prevProps.dateFrom !== this.props.dateFrom && this.props.dateFrom && this.props.contentType === "panorama") {
            this.props.getContentRoutes({
                lineId: this.props.currentLine.id,
                contentType: "panorama",
                date: this.props.dateFrom,
            });
        }
        if (!isEmpty(this.props.currentLine.schemes) && this.props.panoramaTab === "steps-order") {
            this.props.changePanoramaTab("map");
        }
    }

    componentWillUnmount() {
        this.props.resetEditMode();
    }

    changeSwitchPanel = (val) => {
        if (val === "panorama" && this.props.panoramaTab === "panorama") {
            return null;
        }
        this.props.resetEditMode();
        this.props.changePanoramaTab(val);
        this.setState({
            id: null,
        }, this.cancelAngle);
    };

    renderSelector = (switchPanel) => (
        <ButtonGroup className="mb-2">
            <Button
                color="primary"
                outline
                onClick={() => this.changeSwitchPanel("map")}
                active={switchPanel === "map"}>
                Коррекция GPS панорам
            </Button>
            <Button
                color="primary"
                outline
                onClick={() => this.changeSwitchPanel("panorama")}
                active={switchPanel === "panorama"}>
                Коррекция панорам
            </Button>
            <Button
                disabled={!isEmpty(this.props.currentLine.schemes)}
                color={!isEmpty(this.props.currentLine.schemes) ? "danger" : "primary"}
                title={!isEmpty(this.props.currentLine.schemes) ? "Недоступно для отрезка с помещением" : ""}
                outline
                onClick={() => this.changeSwitchPanel("steps-order")}
                active={switchPanel === "steps-order"}>
                Изменение проходки
            </Button>
        </ButtonGroup>
    );

    switcherPanoramTab = (switchPanel) => {
        switch (switchPanel) {
            case "map":
                return (
                    <GPSCorrect />
                );
            case "steps-order":
                return (
                    <StepsOrder />
                );
            case "panorama":
                return (
                    <PanoramaCorrect
                        id={this.state.id}
                        startEdit={this.state.startEdit}
                        baseAngel={this.state.baseAngel}
                        panoramEditMode={this.state.panoramEditMode}
                        cancelAngle={this.cancelAngle}
                        changePanId={this.changePanId}
                        setPanProp={this.setPanProp}
                        params={this.props.currentLine} />
                );
            default:
                return <div style={{ height: "800px" }} />;
        }
    };

    submitAngle = () => {
        const { currentPanoramEdit } = this.state;
        const {
            currentLine: {
                id,
                projectId,
            },
        } = this.props;
        const {
            correctAngel,
            baseAngel,
        } = this.state;
        const newAngle = toRoundNum(baseAngel + correctAngel) % 360;
        const viewAngle = newAngle < 0 ? 360 + newAngle : newAngle;
        const body = {
            viewAngle,
        };
        const url = `/admin/api/projects/${projectId}/lines/${id}/content/panorama/${currentPanoramEdit.id}`;
        axios.put(url, body)
            .then(() => {
                this.cancelAngle();
                toast.success("Изменения сохранены");
                this.props.updateItem(this.props.dateFrom);
            })
            .catch((err) => {
                console.error({ err });
                toast.error("Ошибка", { autoClose: 4000 });
            });
    };

    cancelAngle = () => {
        this.setState({
            panoramEditMode: false,
            correctAngel: 0,
            startEdit: null,
        });
    };

    setPanProp = (name, val) => {
        this.setState({ [name]: val });
    };

    setPanoramaEdit = () => {
        this.setState({
            panoramEditMode: true,
        });
    };

    changePanId = (id) => {
        if (this.state.panoramEditMode) {
            return null;
        }
        this.setState({ id });
    };

    render() {
        const { panoramaTab } = this.props;
        return (
            <React.Fragment>
                <div className="d-flex justify-content-between">
                    <ErrorBoundary>
                        {
                            this.renderSelector(panoramaTab)
                        }
                    </ErrorBoundary>
                    {
                        panoramaTab === "panorama" ? (
                            <ErrorBoundary>
                                <div className="button__group-correct-panel">
                                    <AngleMod
                                        {...this.state}
                                        {...this.props}
                                        onCancel={this.cancelAngle}
                                        onSubmit={this.submitAngle}
                                        setPanoramaEdit={this.setPanoramaEdit} />
                                </div>
                            </ErrorBoundary>
                        ) : null
                    }
                </div>
                <ErrorBoundary>
                    {
                        this.switcherPanoramTab(panoramaTab)
                    }
                </ErrorBoundary>
                <PanoramaTab
                    changePanId={this.changePanId}>
                    {this.props.children}
                </PanoramaTab>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (store) => ({
    currentLine: store.currentLine,
    activeMarker: store.map.activeMarker,
    content: store.content.content,
    dateFrom: store.content.dateFrom,
    contentType: store.content.contentType,
    panoramaTab: store.panorama.panoramaTab,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateItem: updateContent,
    setActive: setActiveMarker,
    resetEditMode,
    getContentLoops,
    getContentRoutes,
    changePanoramaTab,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Panorama);
