import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getLineByID, putLine } from "Admin/store/actionCreators/linesActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";
import { clearContentMemory, getInitialContent } from "../../store/actionCreators/contentActions";
import LineEdit from "./LineEdit";
import "./style.css";

const mapStateToProps = (storeState, ownProps) => ({
    currentLine: storeState.currentLine,
    content: storeState.content,
    router: storeState.router,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    clearMemory,
    getLineByID,
    putLine,
    getInitialContent,
    clearContentMemory,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(LineEdit));
