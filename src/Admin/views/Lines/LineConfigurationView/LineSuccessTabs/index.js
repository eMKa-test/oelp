import React, { memo, useCallback } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import classNames from "classnames";
import { ROUTES_TABS } from "../../../../constants";
import { putLine } from "../../../../store/actionCreators/linesActions";
import "./style.css";

const availableTabs = {
    AERIAL: "Аэросьемка",
    TIMELAPSE: "Таймлапс",
    PANORAMA: "Просмотр",
    IMAGE: "Фото",
    VIDEO: "Видео",
    AEROPANORAMA: "Аэро",
};
const classes = [
    "rounded-0",
    "border-white",
    "mr-1",
];

function LineSuccessTabs(props) {
    const {
        line,
        dispatch,
    } = props;
    const lineID = line.id;
    const objectID = Number(line?.projectId);
    const checkboxID = `lineID_${lineID}`;
    const active = (line.status === "ACTIVE");
    const tabs = line.tabs || [];

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
        <div className="row">
            <div className="col-12">
                {Object.entries(availableTabs)
                    .map(([key, val]) => {
                        const _active = tabs.includes(key);
                        return (
                            <Button
                                key={String(key)}
                                className={classNames(classes)}
                                color={`${_active ? "primary" : "light"}`}
                                onClick={handleClickTab(key, tabs)}>
                                {val}
                            </Button>
                        );
                    })}
                <div className="mt-1 p-1">
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
            </div>
        </div>
    );
}

LineSuccessTabs.propTypes = {
    dispatch: PropTypes.func.isRequired,
    line: PropTypes.shape({
        id: PropTypes.number,
        projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        status: PropTypes.string,
        tabs: PropTypes.arrayOf(PropTypes.string),
    }),
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(memo(LineSuccessTabs));
