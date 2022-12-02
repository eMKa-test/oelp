import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { matchPath } from "react-router-dom";
import HeaderObject from "../../common/HeaderObject";
import ObjectEditModal from "../../common/ObjectEditModal";
import Lines from "./Lines";
import Groups from "./Groups";
import ContentLoader from "../../components/Loaders";
import ErrorBoundary from "../../common/ErrorBoundary";

class ObjectEdit extends React.Component {
    static propTypes = {
        currentObject: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            image: PropTypes.object,
            lines: PropTypes.arrayOf(PropTypes.shape({})),
            groups: PropTypes.arrayOf(PropTypes.shape({})),
            projectStatus: PropTypes.string,
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
        }).isRequired,
        match: PropTypes.shape({
            pathname: PropTypes.string,
        }),
        getObjectByID: PropTypes.func.isRequired,
        putObject: PropTypes.func.isRequired,
        putLine: PropTypes.func.isRequired,
        clearMemory: PropTypes.func.isRequired,
        companies: PropTypes.array.isRequired,
        load: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            accessCompanies: [],
            currentType: false,
        };
    }

    componentDidMount() {
        this.freshObjectData();
    }

    componentDidUpdate(prevProps) {
        const nextID = get(this.props, "match.params.objectID", -1);
        const prevID = get(prevProps, "match.params.objectID", -1);
        if (nextID !== prevID) {
            this.props.getObjectByID(nextID);
        }
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    freshObjectData = () => {
        const { params } = matchPath(get(this.props, "location.pathname"), {
            path: ["/admin/objects/:objectID", "/admin/companies/:companyID/:objectID"],
        });
        const companyType = params.companyID || false;
        this.props.getObjectByID(params.objectID || -1, companyType);
        this.setState({
            currentType: companyType,
        });
    };

    setAccessCompanies = (val) => this.setState({ accessCompanies: val });

    submitObject = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value !== "" && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => {
                this.props.putObject({
                    object: {
                        id: this.props.currentObject.id,
                        name: ev.target.name.value,
                        description: ev.target.description.value,
                        gps: {
                            lat: ev.target.lat.value,
                            long: ev.target.long.value,
                        },
                        orderWeight: ev.target.orderWeight.value,
                        auditRatio: Number(ev.target.auditRatio.value),
                        companies: this.state.accessCompanies,
                        projectStatus: ev.target.projectStatus.value,
                    },
                });
                this.setAccessCompanies([]);
            });
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    render() {
        const {
            currentObject,
            companies,
            load,
        } = this.props;
        let { gps } = currentObject;
        if (!gps) {
            gps = {
                lat: "",
                long: "",
            };
        }
        const {
            isOpen,
            currentType,
        } = this.state;
        return (
            <div style={{ position: "relative" }}>
                <ContentLoader active={load} />
                <HeaderObject
                    onClickEdit={this.toggleModal}
                    title={currentObject.name}
                    updateObject={this.freshObjectData}
                    objectId={currentObject.id}
                    lines={currentObject.lines}
                    description={currentObject.description}
                    isActive={currentObject.projectStatus === "ACTIVE"}
                    image={currentObject.image}
                    uploadUrl={`/admin/api/projects/${currentObject.id}/upload/`} />
                <ErrorBoundary>
                    <Groups
                        loading={load}
                        updateObject={this.props.getObjectByID}
                        currentObject={currentObject} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Lines
                        loading={load}
                        updateObject={this.props.getObjectByID}
                        putLine={this.props.putLine}
                        currentType={Number(currentType)}
                        currentObject={currentObject} />
                    {
                        isOpen && (
                            <ObjectEditModal
                                {...this.state}
                                setAccessCompanies={this.setAccessCompanies}
                                companies={companies}
                                isOpen={isOpen}
                                project={currentObject}
                                defaultOrderWeight={currentObject.orderWeight}
                                defaultName={currentObject.name}
                                defaultDescription={currentObject.description}
                                defaultProjectStatus={currentObject.projectStatus}
                                defaultLat={gps.lat}
                                defaultLong={gps.long}
                                defaultAuditRatio={currentObject.auditRatio}
                                toggleModal={this.toggleModal}
                                submit={this.submitObject} />
                        )
                    }
                </ErrorBoundary>
            </div>
        );
    }
}

export default ObjectEdit;
