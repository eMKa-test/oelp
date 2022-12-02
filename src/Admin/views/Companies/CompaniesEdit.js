import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { matchPath, withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import HeaderCompany from "../../common/HeaderCompany";
import CompaniesEditModal from "../../common/CompanyEditModal";
import ObjectNewModal from "../../common/ObjectNewModal";
import DeleteModal from "../../common/DeleteModal";

import ObjectGrid from "../Objects/ObjectsGrid";
import Pagination from "../../layout/DefaultPagination";
import ContentLoader from "../../components/Loaders";

class CompaniesEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isNewObject: false,
            isOpenDelete: false,
            accessCompanies: [],
            contentType: [],
            deleteObjectID: null,
        };
    }

    componentDidMount() {
        this.fetchCompanyData();
    }

    fetchCompanyData = () => {
        const id = get(matchPath(get(this.props, "location.pathname"), {
            path: "/admin/companies/:id",
        }), "params.id", -1);
        this.props.getCompaniesByID(id);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.fetchCompanyData();
        }
    }

    componentWillUnmount() {
        this.syncContentType([]);
    }

    syncContentType = (val) => this.setState({ contentType: val });

    setAccessCompanies = (val) => this.setState({ accessCompanies: val });

    submitCompany = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value) {
            this.setState({ isOpen: false }, () => {
                this.props.putCompanies({
                    company: {
                        ...this.props.currentCompany,
                        name: ev.target.name.value,
                        contents: this.state.contentType,
                    },
                });
                this.syncContentType([]);
            });
        }
    };

    submitNewObject = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => {
                this.props.putObject({
                    object: {
                        companyID: this.props.currentCompany.id,
                        name: ev.target.name.value,
                        description: ev.target.description.value,
                        gps: {
                            lat: ev.target.lat.value,
                            long: ev.target.long.value,
                        },
                        orderWeight: ev.target.orderWeight.value,
                        companies: this.state.accessCompanies,
                    },
                });
                this.setAccessCompanies([]);
                this.toggleObjectModal();
            });
        }
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleObjectModal = () => this.setState((state) => ({ isNewObject: !state.isNewObject }));

    toggleDeleteModal = (val) => this.setState((state) => ({
        isOpenDelete: !state.isOpenDelete,
        deleteObjectID: val,
    }));

    deleteHandleObject = (ev) => {
        ev.preventDefault();
        this.props.deleteObject(this.state.deleteObjectID, this.props.currentCompany.id);
        this.toggleDeleteModal(null);
        this.props.getCompaniesByID(this.props.currentCompany.id);
    };

    handlePagination = ({
        page,
        limit = 50,
    }) => {
        this.props.getCompaniesByID(this.props.currentCompany.id, {
            page,
            limit,
        });
    };

    render() {
        const {
            currentCompany,
            objects,
            companies,
            pagination,
            load,
        } = this.props;
        const {
            isOpen,
            isNewObject,
            isOpenDelete,
        } = this.state;
        return (
            <React.Fragment>
                <ContentLoader active={load}/>
                <HeaderCompany
                    updateCompany={this.fetchCompanyData}
                    contents={currentCompany.contents}
                    onClickEdit={this.toggleModal}
                    title={currentCompany.name}
                    id={currentCompany.id}
                    image={currentCompany.image}
                    video={currentCompany.video}
                    uploadUrl={`/admin/api/companies/${currentCompany.id}`}/>
                <Button
                    color="primary"
                    onClick={this.toggleObjectModal}>
                    Добавить новый Объект +
                </Button>
                <ObjectGrid
                    toggleDeleteModal={this.toggleDeleteModal}
                    objects={objects}
                    companyID={currentCompany.id}/>
                <Pagination
                    total={pagination?.total}
                    onPagination={this.handlePagination}
                    page={pagination.page}/>
                {
                    isOpen && (
                        <CompaniesEditModal
                            syncContentType={this.syncContentType}
                            isOpen={isOpen}
                            company={currentCompany}
                            defaultName={currentCompany.name}
                            toggleModal={this.toggleModal}
                            submit={this.submitCompany}/>
                    )
                }
                {
                    isNewObject && (
                        <ObjectNewModal
                            setAccessCompanies={this.setAccessCompanies}
                            companies={companies}
                            currentCompany={currentCompany}
                            isOpen={isNewObject}
                            toggleModal={this.toggleObjectModal}
                            submit={this.submitNewObject}/>
                    )
                }
                {
                    isOpenDelete && (
                        <DeleteModal
                            title="Подтверждение удаления объекта"
                            isOpen={isOpenDelete}
                            toggleModal={this.toggleDeleteModal}
                            submit={this.deleteHandleObject}/>
                    )
                }
            </React.Fragment>
        );
    }
}

CompaniesEdit.propTypes = {
    currentCompany: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        image: PropTypes.object,
        gps: PropTypes.shape({
            lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        }),
        video: PropTypes.object,
    }).isRequired,
    pagination: PropTypes.shape({
        total: PropTypes.number,
        page: PropTypes.number,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }).isRequired,
    objects: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    putCompanies: PropTypes.func.isRequired,
    getCompaniesByID: PropTypes.func.isRequired,
    putObject: PropTypes.func.isRequired,
    deleteObject: PropTypes.func.isRequired,
    load: PropTypes.bool.isRequired,
};

export default withRouter(CompaniesEdit);
