import React, { memo, useEffect } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getInitialState } from "../store/actionsCreator/appActions";
import Header from "./header";
import Main from "./main";
import ProgressCard from "../components/ProgressCard";
import "./style.css";

const Layout = ({
    getAppState,
    chunkMode,
}) => {
    useEffect(() => {
        getAppState();
        document.querySelector(".spinner__wrapper").style.opacity = 0;
        document.querySelector(".spinner__wrapper").style.visibility = "hidden";
    }, []);

    return (
        <div className={`agent-layout ${chunkMode ? "theme__warning" : "theme__simple"}`}>
            <Header />
            <Main />
            <ProgressCard />
        </div>
    );
};

Layout.propTypes = {
    getAppState: PropTypes.func.isRequired,
    chunkMode: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
    chunkMode: store.app.chunkMode,
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({ getAppState: getInitialState }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(memo(Layout));
