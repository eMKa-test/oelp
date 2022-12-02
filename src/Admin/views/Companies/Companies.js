import React from "react";
import * as PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import classnames from "classnames";
import CompanyNewModal from "Admin/common/CompanyNewModal";
import DeleteModal from "Admin/common/DeleteModal";

import Widget from "Admin/common/Widget";
import placeholder from "assets/placeholders/obj.jpg";
import Pagination from "../../layout/DefaultPagination";
import ContentLoader from "../../components/Loaders";

class Companies extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
            selectDelCompany: null,
            contentType: [],
        };
    }

    componentDidMount() {
        this.props.getCompanies();
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    syncContentType = (val) => this.setState({ contentType: val });

    submitNewCompany = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value) {
            this.setState({ isOpen: false }, () => {
                this.props.putCompanies({
                    company: {
                        name: ev.target.name.value,
                        contents: this.state.contentType,
                    },
                });
                this.syncContentType([]);
            });
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    deleteCompany = (ev) => {
        ev.preventDefault();
        const { selectDelCompany } = this.state;
        this.props.deleteCompanies(selectDelCompany);
        this.setState({ isOpenDelete: false, selectDelCompany: null });
    };

    toggleDeleteModal = (i) => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete, selectDelCompany: i }));

    handlePagination = ({ page, limit = 12 }) => {
        this.props.getCompanies({ limit, page });
    }

    render() {
        const { companies, pagination, load } = this.props;
        const { isOpen, isOpenDelete } = this.state;
        const isMain = this.props?.match?.url?.includes("companies");
        return (
            <div
                className={classnames("Admin-Companies", {
                    FullHeight: isMain,
                })}>
                <ContentLoader active={load} />
                <div>
                    <p>
                        <button
                            type="button"
                            onClick={this.toggleModal}
                            className="mr-1 btn btn-primary">
                            Создать новую Компанию +
                        </button>
                    </p>
                    <div className="row">
                        {Array.isArray(companies) &&
                        companies.map((comp) => (
                            <div
                                key={comp.id}
                                className="col-xs-12 col-sm-6 col-md-4 col-xl-3">
                                <NavLink to={`/admin/companies/${comp.id}`}>
                                    <Widget
                                        company
                                        image={comp.image ? comp.image.src : placeholder}
                                        title={comp.name} />
                                </NavLink>
                                <button
                                    type="button"
                                    className="deleteBtn btn btn-light"
                                    onClick={() => this.toggleDeleteModal(comp.id)}>
                                    <i className="icon-trash icons icon-trash-style" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <Pagination
                    total={pagination?.total}
                    onPagination={this.handlePagination}
                    page={pagination.page} />
                <CompanyNewModal
                    syncContentType={this.syncContentType}
                    isOpen={isOpen}
                    toggleModal={this.toggleModal}
                    submit={this.submitNewCompany} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteCompany} />
            </div>
        );
    }
}

Companies.propTypes = {
    companies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({
                tmb: PropTypes.string,
            }),
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
        }),
    ).isRequired,
    pagination: PropTypes.shape({
        total: PropTypes.number,
        page: PropTypes.number,
    }),
    match: PropTypes.shape({
        url: PropTypes.string,
    }).isRequired,
    getCompanies: PropTypes.func.isRequired,
    deleteCompanies: PropTypes.func.isRequired,
    putCompanies: PropTypes.func.isRequired,
    clearMemory: PropTypes.func.isRequired,
    load: PropTypes.bool.isRequired,
};

export default withRouter(Companies);
