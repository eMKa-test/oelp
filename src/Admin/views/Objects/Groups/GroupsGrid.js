import React from "react";
import * as PropTypes from "prop-types";
import { Alert, Row } from "reactstrap";
import WidgetGroup from "../../../common/WidgetGroup";

const GroupsGrid = (props) => {
    const {
        groups, deleteGroup, editGroup, updateObject, currentObject,
    } = props;

    if (groups?.length === 0) {
        return (
            <Alert
                className="mb-0"
                color="light">
                Группы отсутствуют
            </Alert>
        );
    }

    return (
        <Row className="mt-3">
            {Array.isArray(groups) &&
                groups.map((group) => {
                    return (
                        <WidgetGroup
                            key={group.id}
                            group={group}
                            updateObject={updateObject}
                            lines={currentObject.lines}
                            deleteGroup={deleteGroup}
                            editGroup={editGroup} />
                    );
                })}
        </Row>
    );
};

GroupsGrid.propTypes = {
    deleteGroup: PropTypes.func,
    updateObject: PropTypes.func,
    editGroup: PropTypes.func,
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            image: PropTypes.shape({}),
        }),
    ),
    currentObject: PropTypes.shape({
        id: PropTypes.number,
        lines: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })),
    }),
};

export default GroupsGrid;
