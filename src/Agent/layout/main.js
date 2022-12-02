import React, { memo } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import ObjectsGrid from "../components/ObjectsGrid";

const Main = ({
    objects,
}) => (
    <main>
        <div className="main">
            {objects.map((obj, i) => (
                <ObjectsGrid
                    key={String(i)}
                    object={obj} />
            ))}
        </div>
    </main>
);

Main.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (store) => ({
    objects: store.app.objects,
});

export default connect(mapStateToProps)(memo(Main));
