import { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";

const Line = ({ name }) => name;

Line.propTypes = {};

const mapStateToProps = (store) => ({
    name: store.currentLine.name,
});

Line.propTypes = {
    name: PropTypes.string,
};

export default connect(mapStateToProps, null)(memo(Line));
