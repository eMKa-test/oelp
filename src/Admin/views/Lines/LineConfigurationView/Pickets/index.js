import React, {
    memo, useCallback, useEffect, useReducer,
} from "react";
import * as PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { getData } from "../../../../../api";
import reducer, { initialState } from "./reducer";
import PicketMap from "./Map";
import "./style.css";

function PicketsTab(props) {
    const {
        userId,
        line,
    } = props;
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);

    const getPickets = useCallback(async () => {
        try {
            if (typeof dispatch === "function") {
                dispatch({
                    type: "LOADING",
                    loading: true,
                });
            }
            const mainUrl = "/admin/api/pickets";
            const params = { lineId: line.id };
            const res = await getData({
                mainUrl,
                params,
            });
            if (res.payload) {
                if (typeof dispatch === "function") {
                    dispatch({
                        type: "GET_PICKETS",
                        pickets: res.payload,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [line?.id]);

    useEffect(() => {
        getPickets();
    }, []);

    return (
        <Row>
            <Col xs={12}>
                <div className="PicketsTab">
                    <PicketMap
                        updatePickets={getPickets}
                        pickets={state.pickets}
                        line={line}
                        userId={userId}
                        loading={state.loading} />
                </div>
            </Col>
        </Row>
    );
}

PicketsTab.propTypes = {
    userId: PropTypes.number.isRequired,
    line: PropTypes.shape({
        id: PropTypes.number,
    }),
};

const mapStateToProps = (store) => ({
    line: store.currentLine,
    userId: store.general.operator.id,
});

export default connect(mapStateToProps)(memo(PicketsTab));
