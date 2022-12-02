import React, {
    memo, useCallback, useReducer, useEffect, useState,
} from "react";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import reducer, {
    initialState, loadUsersProjectsLines, setPagination, setLoading, loadContentSet, changeFilter,
} from "./reducer";
import Pagination from "../../layout/DefaultPagination";
import { getData, delData, putData } from "../../../api";
import { contentSetHeader } from "./helpers";
import FilterPane from "./FilterPane";
import ContentLoader from "../../components/Loaders";
import ConfirmTimerModal from "../../common/ConfirmTimerModal";
import ErrorBoundary from "../../common/ErrorBoundary";
import RowCollapsed from "./RowCollapsed";
import { CONTENT_SETS_PAGINATION_DEFAULT } from "../../constants";
import "./style.css";

const ContentSets = ({ my }) => {
    const [state, dispatch] = useReducer(reducer, initialState(), initialState);
    const [confirmDeleteId, setConfirmDelete] = useState(null);
    const [confirmSetUploadedId, setConfirmUploaded] = useState(null);

    const fetchContentSet = useCallback((params = {}, callback) => {
        dispatch(setLoading(true));
        const {
            page,
            limit,
        } = state;
        getData({
            mainUrl: "/admin/api/contentSets",
            params: {
                page,
                limit,
                ...params,
            },
        })
            .then((res) => {
                if (res.success) {
                    dispatch(setPagination(res.pagination));
                    dispatch(loadContentSet(res.payload));
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(setLoading(false));
            })
            .finally(callback);
    }, [state]);

    const handlePagination = useCallback(({
        page,
        limit = CONTENT_SETS_PAGINATION_DEFAULT,
    }) => {
        fetchContentSet({
            page,
            limit,
            ...state.urlParams,
        });
    }, [state]);

    useEffect(() => {
        const limit = 999999999;
        Promise.all([
            getData({
                mainUrl: "/admin/api/users",
                params: {
                    limit,
                    includeSupers: my.kind === "SUPER",
                },
            }),
            getData({
                mainUrl: "/admin/api/projects",
                params: { limit },
            }),
            getData({
                mainUrl: "/admin/api/lines",
                params: { limit },
            }),
        ])
            .then(([{ payload: users }, { payload: projects }, { payload: lines }]) => {
                dispatch(loadUsersProjectsLines(users, projects, lines));
            });
    }, []);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        let params = "/admin/api/contentSets/";
        let fetchData = delData;
        if (confirmDeleteId) {
            params += confirmDeleteId;
        } else {
            const mainUrl = params + confirmSetUploadedId;
            params = {
                mainUrl,
                body: {
                    status: "UPLOADED",
                },
            };
            fetchData = putData;
        }
        fetchData(params)
            .then((res) => {
                if (res.success) {
                    toast.success("Изменения сохранены");
                    fetchContentSet({
                        ...state.urlParams,
                        page: state.page,
                        limit: state.limit,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Неизвестная ошибка. Попробуйте позже", { autoClose: 4000 });
            })
            .finally(() => {
                if (confirmDeleteId) {
                    setConfirmDelete(null);
                } else {
                    setConfirmUploaded(null);
                }
            });
    }, [confirmDeleteId, confirmSetUploadedId, state.filter, state.page, state.limit]);

    const onFilterHandler = useCallback(({
        type,
        value,
    }) => {
        const filter = {
            ...state.filter,
            [type]: value,
        };
        dispatch(changeFilter(filter));
    }, [state.filter]);

    useEffect(() => {
        fetchContentSet({ page: 1, ...state.urlParams });
    }, [state.urlParams]);

    const refreshSets = useCallback(() => {
        fetchContentSet(state.urlParams);
    }, [state.urlParams]);

    return (
        <div className="content-sets__wrapper">
            <ContentLoader
                stickToTop
                active={state.loading} />
            <h4 className="mb-4">
                Cеты
            </h4>
            <ErrorBoundary>
                <FilterPane
                    lines={state.lines}
                    users={state.users}
                    onFilterHandler={onFilterHandler}
                    filter={state.filter} />
            </ErrorBoundary>
            <ErrorBoundary>
                <div className="title__row">
                    <Pagination
                        limit={state.limit}
                        disabled={state.loading}
                        total={state.total}
                        onPagination={handlePagination}
                        page={state.page} />
                    <Button
                        className="reset-bootstrap-button-styles"
                        onClick={refreshSets}
                        color="primary"
                        title="Обновить">
                        <i className="fa fa-refresh" />
                    </Button>
                </div>
            </ErrorBoundary>
            <ErrorBoundary>
                <div className="c-table">
                    <div className="c-table__header">
                        {contentSetHeader.map((item, i) => {
                            const isLast = i === contentSetHeader.length - 1;
                            return (
                                <div
                                    key={String(i)}
                                    className={item.class}>
                                    <span className={`col__header ${isLast ? "text-right" : "text-left"}`}>
                                        {item.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="c-table__body">
                        {state.contentSets.map((set, i) => {
                            return (
                                <RowCollapsed
                                    setConfirmUploaded={setConfirmUploaded}
                                    setConfirmDelete={setConfirmDelete}
                                    set={set}
                                    users={state.users}
                                    key={String(i)} />
                            );
                        })}
                    </div>
                </div>
            </ErrorBoundary>
            {isEmpty(state.contentSets) && (
                <span className="sets-empty">Загрузок не найдено</span>
            )}
            <ConfirmTimerModal
                title="Подтверждение удаления загрузки"
                isOpen={typeof confirmDeleteId === "number"}
                toggleModal={() => setConfirmDelete(null)}
                bodyText="Данная загрузка удалится без возможости восстановления!"
                submit={onSubmit} />
            <ConfirmTimerModal
                title="Подтверждение завершения загрузки"
                submitTitle="Завершить загрузку"
                isOpen={typeof confirmSetUploadedId === "number"}
                toggleModal={() => setConfirmUploaded(null)}
                bodyText="Данная загрузка принудительно завершится и начнется конвертация загруженных файлов"
                submit={onSubmit} />
        </div>
    );
};

ContentSets.propTypes = {
    my: PropTypes.shape({
        kind: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
};

const mapStateToProps = (store) => ({
    my: store.general.operator,
});
export default connect(mapStateToProps)(memo(ContentSets));
