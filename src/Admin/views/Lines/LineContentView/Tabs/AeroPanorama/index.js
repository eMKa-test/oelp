import React from "react";
import * as PropTypes from "prop-types";
import axios from "axios";
import { Button, ButtonGroup } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import AeroPanoramaTab from "./AeroPanoramaTab";
import GPSCorrect from "../../../../../components/Map/ReactLeaflet";
import PanoramaCorrect from "../../../../../components/PanoramCorrect";
import AngleMod from "./AngleMod";
import { toRoundNum } from "../../../../../components/PanoramCorrect/helpers";
import { updateContent } from "../../../../../store/actionCreators/contentActions";
import { resetEditMode, setActiveMarker } from "../../../../../store/actionCreators/mapActions";
import {
    changePanoramaTab,
    getContentLoops,
    getContentRoutes,
} from "../../../../../store/actionCreators/panoramaActions";
import ErrorBoundary from "../../../../../common/ErrorBoundary";
import StepsOrder from "../../../../../components/StepsOrder";

class AeroPanorama extends React.PureComponent {
    static propTypes = {
        currentLine: PropTypes.object,
        changeEditGroupsMark: PropTypes.func,
        resetFromSwitchPanel: PropTypes.func,
        setActive: PropTypes.func,
        resetEditMode: PropTypes.func,
        dateFrom: PropTypes.string,
        objectID: PropTypes.string,
        lineID: PropTypes.string,
        contentType: PropTypes.string,
        getContentRoutes: PropTypes.func,
        getContentLoops: PropTypes.func,
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
            contentType: "aeropanorama",
        });
        this.props.getContentRoutes({
            lineId: this.props.currentLine.id,
            contentType: "aeropanorama",
            date: this.props.dateFrom,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.id !== this.state.id) {
            const marker = this.props.content.find((m) => m.id === this.state.id);
            if (marker) {
                this.props.setActive(marker);
            } else {
                this.props.resetEditMode();
            }
        }
        if (prevProps.dateFrom !== this.props.dateFrom && this.props.dateFrom && this.props.contentType === "aeropanorama") {
            this.props.getContentRoutes({
                lineId: this.props.currentLine.id,
                contentType: "aeropanorama",
                date: this.props.dateFrom,
            });
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
                color="primary"
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
            ...currentPanoramEdit,
            viewAngle,
        };
        const url = `/admin/api/projects/${projectId}/lines/${id}/content/aeropanorama/${currentPanoramEdit.id}`;
        axios.put(url, body)
            .then(() => {
                this.cancelAngle();
                toast.success("Изменения сохранены");
                this.props.updateItem(this.props.dateFrom);
            })
            .catch((err) => {
                console.error(err);
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
                <AeroPanoramaTab
                    changePanId={this.changePanId}>
                    {this.props.children}
                </AeroPanoramaTab>
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

export default connect(mapStateToProps, mapDispatchToProps)(AeroPanorama);
