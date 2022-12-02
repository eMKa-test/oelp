import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import ConfigCard from "./Card";
import TabsConfig from "./Tabs";
import { ROUTES_TABS } from "../../../constants";
import { putLine } from "../../../store/actionCreators/linesActions";
import "./style.css";

function LineConfig(props) {
    const {
        line,
        dispatch,
    } = props;
    const lineID = line.id;
    const objectID = Number(line?.projectId);
    const checkboxID = `lineID_${lineID}`;
    const active = (line.status === "ACTIVE");

    const update = useCallback((body) => {
        dispatch(putLine({
            objectID,
            line: {
                ...line,
                ...body,
            },
        }));
    }, [lineID, objectID, line]);

    const handleActive = useCallback(({ target: { checked } }) => {
        update({ status: checked ? "ACTIVE" : "HIDDEN" });
    }, [objectID, lineID, line]);

    const handleClickTab = useCallback((key, tabs) => async () => {
        const tabsSet = new Set(tabs);
        if (tabsSet.has(key)) {
            tabsSet.delete(key);
        } else {
            tabsSet.add(key);
        }
        const hardTabs = ROUTES_TABS.filter((tab) => {
            return Array.from(tabsSet)
                .includes(tab.to.toUpperCase());
        })
            .map((finalTAbs) => finalTAbs.to.toUpperCase());
        update({ tabs: hardTabs });
    }, [lineID, objectID, line]);

    if (line.id < 0) {
        return null;
    }

    return (
        <div className="row mt-3">
            <div
                className="col-sm-6 col-lg-8 col-xl-5"
                key={String(lineID)}>
                <ConfigCard
                    data={line}>
                    <React.Fragment>
                        <TabsConfig
                            lineID={lineID}
                            onClick={handleClickTab}
                            tabs={line?.tabs || []} />
                        <div className="mt-1 p-1 border-top">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={handleActive}
                                    className="custom-control-input"
                                    id={checkboxID} />
                                <label
                                    className="custom-control-label"
                                    htmlFor={checkboxID}>
                                    Доступно для пользователей
                                </label>
                            </div>
                        </div>
                    </React.Fragment>
                </ConfigCard>
            </div>
        </div>
    );
}

LineConfig.propTypes = {
    dispatch: PropTypes.func.isRequired,
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        status: PropTypes.string,
        tabs: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default connect(null, (dispatch) => ({ dispatch }))(memo(LineConfig));
