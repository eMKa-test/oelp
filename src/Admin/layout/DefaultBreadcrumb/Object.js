import { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";

const Objects = ({ objects, match }) => {
    const matched = objects.find((obj) => Number(match.params?.objectId) === obj.id);

    if (!matched) {
        return null;
    }

    return matched.name;
};

Objects.propTypes = {};

const mapStateToProps = (store) => ({
    objects: store.companies.projects,
});

export default connect(mapStateToProps, null)(memo(Objects));
