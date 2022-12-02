import React, {
    memo, useCallback, useEffect, useReducer,
} from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import ObjectsList from "./ObjectsList";
import LinesList from "./LinesList";
import reducer, {
    initialState,
    selectObject,
    loadObjects,
    setDraggingLine,
    resetDraggingLine,
    setLoadFetch,
    setSelectedLines,
    cancelSelectMode,
    setObjectToMove,
    reset,
} from "./reducer";
import "./style.css";
import { postData } from "../../../api";
import { getAllProjects } from "../../store/actionCreators/companiesActions";

const MovementLines = ({ updateProjects, objects }) => {
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);

    useEffect(() => {
        dispatch(loadObjects(objects));
    }, [objects]);

    const removeDraggingLine = useCallback(() => {
        dispatch(resetDraggingLine());
    }, []);

    const resetSelectMode = useCallback(() => {
        dispatch(cancelSelectMode());
    }, []);

    const onSubmitMove = useCallback(() => {
        setLoadFetch(true);
        const fetches = state.selectedLines.map((l) => {
            return postData({
                mainUrl: `/admin/api/lines/${l}/move`,
                body: { projectId: state.objectToMove },
            });
        });
        Promise.all(fetches).then(() => {
            dispatch(reset());
            updateProjects();
            toast.success("Изменения сохранены");
        }).catch((err) => {
            toast.error("Ошибка", { autoClose: 4000 });
            console.error(err);
        }).finally(() => {
            setLoadFetch(false);
        });
    }, [state.selectedLines, state.objectToMove]);

    return (
        <div className="movement-lines__wrapper">
            <ObjectsList
                setLoadFetch={setLoadFetch}
                objectToMove={state.objectToMove}
                selectedLines={state.selectedLines}
                setObjectToMove={(objectId) => dispatch(setObjectToMove(objectId))}
                loadFetch={state.loadFetch}
                removeDraggingLine={removeDraggingLine}
                draggingLineObject={state.draggingLineObject}
                selectedObjectId={state.selectedObjectId}
                setObject={(id) => dispatch(selectObject(id))}
                objects={state.objects} />
            <LinesList
                onSubmitMove={onSubmitMove}
                objectToMove={state.objectToMove}
                resetSelectMode={resetSelectMode}
                selectedLines={state.selectedLines}
                selectLine={(lineId) => dispatch(setSelectedLines(lineId))}
                loadFetch={state.loadFetch}
                setDraggingLine={(line) => dispatch(setDraggingLine(line))}
                lines={state.lines} />
        </div>
    );
};

MovementLines.propTypes = {
    updateProjects: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
    objects: store.companies.projects,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateProjects: getAllProjects }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(MovementLines));
