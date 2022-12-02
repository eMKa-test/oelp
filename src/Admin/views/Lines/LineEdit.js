import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import Header from "../../common/Header";
import LinesEditModal from "../../common/LinesEditModal";
import ViewsRouter from "./routes";
import ErrorBoundary from "../../common/ErrorBoundary";

class LineEdit extends React.Component {
    static propTypes = {
        currentLine: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            description: PropTypes.string,
            image: PropTypes.object,
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
            agentPlans: PropTypes.shape({
                points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                photos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                videos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                panoramas: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
        }).isRequired,
        getLineByID: PropTypes.func.isRequired,
        content: PropTypes.shape({
            contentType: PropTypes.string,
        }),
        router: PropTypes.shape({
            objectID: PropTypes.string,
            lineID: PropTypes.string,
            dateFrom: PropTypes.string,
        }),
        putLine: PropTypes.func.isRequired,
        clearMemory: PropTypes.func.isRequired,
        clearContentMemory: PropTypes.func.isRequired,
        getInitialContent: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            bg: { backgroundImage: "none" },
        };
    }

    componentDidMount() {
        const {
            objectID,
            lineID,
        } = this.props.router;
        const { contentType } = this.props.content;
        this.props.getLineByID({
            objectID,
            id: lineID,
        });
        this.props.getInitialContent({
            objectID,
            lineID,
            contentType,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const image = get(nextProps, "currentLine.image", false);
        if (image && this.state.bg.backgroundImage !== image.src) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        } else {
            this.setState({ bg: { backgroundImage: "none" } });
        }
        return null;
    }

    componentWillUnmount() {
        this.props.clearMemory();
        this.props.clearContentMemory();
    }

    submitLine = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value !== "" && ev.target.description.value !== "") {
            const {
                planPoints: { value: points },
                planPhotos: { value: photos },
                planVideos: { value: videos },
                planPanoramas: { value: panoramas },
            } = ev.target;
            this.setState({ isOpen: false }, () => this.props.putLine({
                objectID: this.props.router.objectID,
                line: {
                    id: this.props.currentLine.id,
                    name: ev.target.name.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                    agentPlans: {
                        points,
                        photos,
                        videos,
                        panoramas,
                    },
                    orderWeight: ev.target.orderWeight.value,
                    mergeAero: ev.target.mergeAero.checked,
                    tabs: this.props.currentLine.tabs,
                },
            }));
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    render() {
        const { currentLine } = this.props;
        let {
            gps,
            agentPlans,
        } = currentLine;
        if (!gps) {
            gps = {
                lat: "",
                long: "",
            };
        }
        if (!agentPlans) {
            agentPlans = {
                points: "",
                photos: "",
                videos: "",
                panoramas: "",
            };
        }
        const { isOpen } = this.state;
        const { objectID } = this.props.router;
        const { contentType } = this.props.content;
        return (
            <React.Fragment>
                <ErrorBoundary>
                    <Header
                        contentType={contentType}
                        line={currentLine}
                        onClickEdit={this.toggleModal}
                        title={currentLine?.name}
                        description={currentLine.description}
                        image={currentLine.image}
                        uploadUrl={`/admin/api/projects/${objectID}/lines/${currentLine.id}/upload/`} />
                </ErrorBoundary>
                <ViewsRouter
                    getLineByID={this.props.getLineByID}
                    updateLine={this.props.putLine}
                    currentLine={currentLine} />
                <LinesEditModal
                    edit
                    title="Редактирование отрезка"
                    isOpen={isOpen}
                    defaultName={currentLine?.name}
                    defaultDescription={currentLine.description}
                    defaultOrderWeight={currentLine.orderWeight}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultPlanPoints={agentPlans.points}
                    defaultPlanPhotos={agentPlans.photos}
                    defaultPlanVideos={agentPlans.videos}
                    defaultPlanPanoramas={agentPlans.panoramas}
                    mergeAero={currentLine.mergeAero}
                    withAgentPlans
                    toggleModal={this.toggleModal}
                    submit={this.submitLine} />
            </React.Fragment>
        );
    }
}

export default LineEdit;
