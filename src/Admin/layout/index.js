import React from "react";
import { AppFooter, AppHeader } from "@coreui/react";
import { connect } from "react-redux";

import DefaultSidebar from "./DefaultSidebar";
import DefaultContent from "./DefaultContent";
import DefaultHeader from "./DefaultHeader";
import Auth from "../views/Auth";
import RightSideBar from "./RightSideBar";
import "./style.css";

const DefaultLayout = (props) => {
    if (props.loading && !props.operator?.email) {
        return null;
    }

    if (!props.loading && !props.operator?.email) {
        return <Auth />;
    }

    return (
        <div className="app">
            <AppHeader fixed>
                <DefaultHeader />
            </AppHeader>
            <div className="app-body">
                <DefaultSidebar {...props} />
                <main className="main admin-bg_default">
                    <DefaultContent />
                </main>
                <RightSideBar />
            </div>
            <AppFooter>
                <span className="ml-auto">
                    Sfera.com.ru
                    {" "}
                    &copy;
                    {" "}
                    {new Date().getFullYear()}
                </span>
            </AppFooter>
        </div>
    );
};

const mapStateToProps = (state) => ({
    operator: state.general.operator,
    loading: state.general.loading,
});

export default connect(mapStateToProps, null)(DefaultLayout);
