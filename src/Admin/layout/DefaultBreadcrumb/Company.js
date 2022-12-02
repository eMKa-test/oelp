import { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";

const Company = ({ companies, match }) => {
    const matched = companies.find((comp) => Number(match.params?.companyId) === comp.id);

    if (!matched) {
        return null;
    }

    return matched.name;
};

Company.propTypes = {};

const mapStateToProps = (store) => ({
    companies: store.companies.companies,
});

export default connect(mapStateToProps, null)(memo(Company));
