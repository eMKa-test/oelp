import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { getUsers, putUser } from "Admin/store/actionCreators/usersActions";
import { getObjects } from "Admin/store/actionCreators/objectsActions";
import { getCompanies } from "Admin/store/actionCreators/companiesActions";

import Users from "./Users";

const mapStateToProps = (storeState, ownProps) => ({
    users: storeState.users.users,
    pagination: storeState.users.pagination,
    companies: storeState.companies.companies,
    objects: storeState.objects.objects,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getUsers,
    putUser,
    getObjects,
    getCompanies,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Users));
