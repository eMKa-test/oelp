import React from "react";
import * as PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Col, Row, Button } from "reactstrap";

import { fetchData } from "api";
import palceholder from "assets/placeholders/obj.jpg";
import ObjectNewModal from "Admin/common/ObjectNewModal";
import DeleteModal from "Admin/common/DeleteModal";

import Widget from "Admin/common/Widget";
import Pagination from "../../layout/DefaultPagination";
import ContentLoader from "../../components/Loaders";

class Objects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
            selectDelObject: null,
            accessCompanies: [],
        };
    }

    componentDidMount() {
        this.props.getObjects();
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    submitNewObject = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => {
                this.props.putObject({
                    object: {
                        name: ev.target.name.value,
                        description: ev.target.description.value,
                        gps: {
                            lat: ev.target.lat.value,
                            long: ev.target.long.value,
                        },
                        orderWeight: ev.target.orderWeight.value,
                        auditRatio: Number(ev.target.auditRatio.value),
                        companies: this.state.accessCompanies,
                    },
                });
                this.setAccessCompanies([]);
            });
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    setAccessCompanies = (val) => this.setState({ accessCompanies: val });

    deleteObject = (ev) => {
        ev.preventDefault();
        const { selectDelObject } = this.state;
        fetchData({
            url: `/admin/api/projects/${selectDelObject}`,
            method: "delete",
        })
            .then(({ success = false }) => {
                this.props.getObjects();
                if (success) {
                    this.setState({ isOpenDelete: false });
                }
            });
        this.setState({ isOpenDelete: false });
    };

    toggleDeleteModal = (i) => this.setState((state) => ({
        isOpenDelete: !state.isOpenDelete,
        selectDelObject: i,
    }));

    handlePagination = ({
        page,
        limit = 50,
    }) => {
        this.props.getObjects({
            limit,
            page,
        });
    };

    render() {
        const {
            objects,
            companies,
            pagination,
            load,
        } = this.props;
        const {
            isOpen,
            isOpenDelete,
        } = this.state;
        return (
            <React.Fragment>
                <ContentLoader active={load}/>
                <div className="objects-list__wrapper">
                    <p>
                        <Button
                            color="primary"
                            onClick={this.toggleModal}
                            className="mr-1">
                            Создать новый объект +
                        </Button>
                    </p>
                    <Row>
                        {Array.isArray(objects) &&
                        objects.map((object) => (
                            <Col
                                key={object.id}
                                xs={12}
                                sm={6}
                                md={4}
                                xl={3}>
                                <NavLink to={`/admin/objects/${object.id}`}>
                                    <Widget
                                        image={object.image ? object.image.tmb : palceholder}
                                        title={object.name}
                                        description={object.description}/>
                                </NavLink>
                                <Button
                                    className="deleteBtn"
                                    color="light"
                                    onClick={() => this.toggleDeleteModal(object.id)}>
                                    <i className="icon-trash icons icon-trash-style"/>
                                </Button>
                                <div className="object-status__indicate">
                                    <i
                                        title={object.projectStatus === "ACTIVE" ? "Активен" : "Неактивен"}
                                        style={{
                                            fontSize: "16px",
                                        }}
                                        className={`fa ${object.projectStatus === "ACTIVE" ? "fa-eye text-success" : "fa-eye-slash text-danger"}`}/>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <Pagination
                        total={pagination?.total}
                        onPagination={this.handlePagination}
                        page={pagination?.page}/>
                    {
                        isOpen && (
                            <ObjectNewModal
                                setAccessCompanies={this.setAccessCompanies}
                                companies={companies}
                                isOpen={isOpen}
                                toggleModal={this.toggleModal}
                                submit={this.submitNewObject}/>
                        )
                    }
                    <DeleteModal
                        isOpen={isOpenDelete}
                        toggleModal={this.toggleDeleteModal}
                        submit={this.deleteObject}/>
                </div>
            </React.Fragment>
        );
    }
}

Objects.propTypes = {
    objects: PropTypes.arrayOf(
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
    }).isRequired,
    getObjects: PropTypes.func.isRequired,
    putObject: PropTypes.func.isRequired,
    clearMemory: PropTypes.func.isRequired,
    companies: PropTypes.array.isRequired,
    load: PropTypes.bool.isRequired,
};

export default React.memo(Objects);
