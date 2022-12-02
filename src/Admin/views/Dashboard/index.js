import React, { Component } from "react";

import Search from "./Search";
import Companies from "../Companies";
import Disks from "./Disks";
import ServerProcessing from "./ServerProcessing";
import ErrorBoundary from "../../common/ErrorBoundary";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <Search />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Companies />
                </ErrorBoundary>
                <ErrorBoundary>
                    <div className="admin-dashboard_wrapper mt-3">
                        <Disks />
                    </div>
                </ErrorBoundary>
                <ErrorBoundary>
                    <ServerProcessing />
                </ErrorBoundary>
            </div>
        );
    }
}

export default Dashboard;
