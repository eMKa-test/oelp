import React, { memo, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Card, CardBody } from "reactstrap";
import ObjectsMap from "../components/Map/ObjectsMap";

import CompanyThumb from "../views/Companies/CompanyThumb";
import VideoBackground from "../views/Companies/VideoBackground";

const BGVideo = memo(({
    video,
    uploadUrl,
}) => (
    <div className="col-md-5 col-xl-4">
        <VideoBackground
            video={video}
            uploadUrl={uploadUrl} />
    </div>
));

function HeaderCompany(props) {
    const {
        onClickEdit,
        title,
        contents,
        id,
        objects,
        updateCompany,
    } = props;
    const [open, setOpen] = useState(false);

    return (
        <div className="mb-3">
            <div className="row d-flex justify-content-between align-items-start mb-5">
                <div className="col-12 d-flex align-items-center justify-content-start">
                    <div className="mr-2">
                        <Button
                            color="light"
                            onClick={onClickEdit}>
                            <i className="icon-pencil" />
                        </Button>
                        <Button
                            title="Карта с объектами"
                            color={open ? "primary" : "light"}
                            onClick={() => setOpen(!open)}>
                            <i className="fa fa-map-o" />
                        </Button>
                    </div>
                    <h1 className="h3 mb-0">{title}</h1>
                </div>
                <div className="col-md-12 col-xl-8 align-self-start">
                    <ObjectsMap
                        objectId={id}
                        update={updateCompany}
                        open={open}
                        markers={objects} />
                </div>
                <div className="col-md-5 mt-3 col-xl-4">
                    <CompanyThumb
                        image={props.image}
                        uploadUrl={props.uploadUrl} />
                </div>
            </div>
            {contents?.length > 0 && (
                <div className="row d-flex justify-content-between mb-3">
                    {contents.map((content, i) => (
                        <div
                            key={String(i)}
                            className="mb-3 col-12 col-sm-6 col-md-4 col-xl-3">
                            <Card className="mb-0">
                                <NavLink to={`/admin/companies/${id}/${content.toLowerCase()}`}>
                                    <CardBody
                                        className="image-thumb__promo cursor-pointer">
                                        {content}
                                    </CardBody>
                                </NavLink>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

HeaderCompany.propTypes = {
    onClickEdit: PropTypes.func,
    contents: PropTypes.array,
    title: PropTypes.string,
    image: PropTypes.object,
    id: PropTypes.number,
    uploadUrl: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.shape({
        gps: PropTypes.shape({
            lat: PropTypes.number,
            long: PropTypes.number,
        }),
    })),
};

const mapStateToProps = (store) => ({
    objects: store.objects.objects,
});

export default connect(mapStateToProps)(React.memo(HeaderCompany));
