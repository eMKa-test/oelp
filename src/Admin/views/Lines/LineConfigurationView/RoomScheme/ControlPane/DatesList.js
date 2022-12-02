import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { Input } from "reactstrap";

const DatesList = (props) => {
    const {
        schemes,
        selectedScheme,
        selectScheme,
    } = props;

    if (!schemes.length) {
        return null;
    }

    return (
        <div className="dates-list__wrapper d-flex ml-2">
            <Input
                value={selectedScheme?.id}
                onChange={({ target }) => selectScheme(Number(target.value))}
                type="select">
                {schemes.map((scheme, i) => (
                    <option
                        key={String(i)}
                        value={scheme.id}
                        label={scheme.date} />
                ))}
            </Input>
        </div>
    );
};

DatesList.propTypes = {
    schemes: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
    })),
    selectedScheme: PropTypes.shape({
        id: PropTypes.number,
    }),
    selectScheme: PropTypes.func.isRequired,
};

export default memo(DatesList);
