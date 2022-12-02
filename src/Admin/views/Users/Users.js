import React from "react";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import axios from "axios";
import { Button, Table } from "reactstrap";

import { toast } from "react-toastify";
import ModalUserNew from "../../components/Modal/ModalUserNew";
import ModalUserEdit from "../../components/Modal/ModalUserEdit";
import Pagination from "../../layout/DefaultPagination";

function fetchRequest(method, url, body = {}) {
    return axios[method](url, body);
}

const validPassword = (val1, val2) => {
    const v1 = String(val1);
    const v2 = String(val2);
    if (!v1 || !v2 || v1.trim() !== v2.trim()) {
        return false;
    }
    return true;
};

const convertKind = {
    USER: "Пользователь",
    AGENT: "Агент",
    SUPER: "Администратор",
    AUDITOR: "Аудитор",
    MODERATOR: "Модератор",
};

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenNew: false,
            isOpenEdit: false,
            isOpenDelete: false,
            selectUser: null,
            role: "USER",
            pwdChkErr: false,
            selectedUser: null,
            accessCompanies: [],
            accessProject: [],
            tabs: [],
            includeDisabled: false,
            includeSupers: false,
            queryUserId: null,
        };
    }

    componentDidMount() {
        this.getUsers();
        this.props.getObjects({ limit: 9999 });
        const queryParams = new URLSearchParams(this.props.location.search);
        const queryUserId = new URLSearchParams(queryParams).get("userId");
        if (queryUserId) {
            this.setState({ queryUserId: Number(queryUserId) });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.users.length > 0 && !prevState.queryUserId && this.state.queryUserId && !this.state.isOpenEdit) {
            this.openEditModalFromSearch();
        }
    }

    openEditModalFromSearch = () => {
        const url = `/admin/api/users/${this.state.queryUserId}`;
        axios.get(url)
            .then(({ data }) => {
                if (data.payload) {
                    this.toggleModal("isOpenEdit", { selectedUser: data.payload })();
                }
            })
            .catch((err) => {
                const msg = `Ошибка запроса. ${err.message || err.response.message}`;
                toast.error(msg, { autoClose: 4000 });
            });
    };

    getIncludes = () => {
        const {
            includeSupers,
            includeDisabled,
        } = this.state;
        return {
            includeSupers,
            includeDisabled,
        };
    };

    getUsers = (params = {}) => {
        const newParams = { ...this.getIncludes(), ...params };
        this.props.getUsers(newParams);
    };

    submitUser = (ev, mode, id, status, kind) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target) {
            const password = get(ev.target, "password.value");
            const pwdChk = get(ev.target, "pwdChk.value");
            const email = get(ev.target, "email.value");
            const name = get(ev.target, "name.value");
            const canCreateTmpUser = get(ev.target, "canCreateTmpUser.checked", false);
            switch (mode) {
                case "edit": {
                    if (password && !validPassword(password, pwdChk)) {
                        return this.setState({ pwdChkErr: true }, () => {
                            toast.error("Пароли не совпадают");
                            console.error("PASSWORDS_NOT_EQUAL");
                        });
                    }
                    const param = {
                        status,
                        name,
                        email,
                        kind,
                        canCreateTmpUser,
                        password: String(password)
                            .trim(),
                        companies: this.state.accessCompanies,
                        meta: JSON.stringify({ tabs: this.state.tabs }),
                        projects: this.state.accessProject,
                    };
                    return fetchRequest("put", `/admin/api/users/${id}`, param)
                        .then(() => {
                            toast.success("Данные обновлены");
                            this.setState({
                                isOpenEdit: false,
                                companies: [],
                                queryUserId: null,
                            }, () => {
                                this.getUsers(this.props.pagination);
                                this.props.history.replace(this.props.location.pathname);
                            });
                        })
                        .catch((e) => {
                            toast.error(`Ошибка ${e.message || e.response.message}`, { autoClose: 4000 });
                            warn(e);
                        });
                }
                default: {
                    if (!validPassword(password, pwdChk)) {
                        return this.setState({ pwdChkErr: true }, () => {
                            toast.error("Пароли не совпадают");
                            console.error("PASSWORDS_NOT_VALID");
                        });
                    }
                    if (name && email) {
                        this.props.putUser({
                            user: {
                                email,
                                name,
                                canCreateTmpUser,
                                kind: this.state.role,
                                password: String(password)
                                    .trim(),
                                companies: this.state.accessCompanies,
                                projects: this.state.accessProject,
                            },
                            params: this.getIncludes(),
                            callback: () => this.setState({ isOpenNew: false }),
                        });
                    }
                }
            }
        }
    };

    changeState = (key) => (val) => {
        this.setState({ [key]: val });
    };

    toggleFilter = (key) => () => {
        const newState = { [key]: !this.state[key] };
        this.setState(newState, () => this.getUsers(this.props.pagination));
    };

    toggleModal = (key, newState) => () => {
        this.setState((state) => ({
            [key]: !state[key],
            ...newState,
        }));
        if (key === "isOpenEdit" && Object.is(newState.selectedUser, null) && this.state.queryUserId) {
            this.setState({
                queryUserId: null,
            });
            this.props.history.replace(this.props.location.pathname);
        }
    };

    disactivateUser = (user) => {
        user.status = (user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
        this.props.putUser({
            user,
            params: this.getIncludes(),
        });
    };

    handlePagination = ({
        page,
        limit = 12,
    }) => {
        this.getUsers({
            limit,
            page,
        });
    };

    render() {
        const {
            users,
            companies,
            objects,
            pagination,
        } = this.props;
        const {
            isOpenNew,
            isOpenEdit,
            selectedUser,
            includeSupers,
            includeDisabled,
        } = this.state;
        return (
            <div className="admin-main-diskusage_wrapper">
                <div className="d-flex justify-content-between align-items-start">
                    <Button
                        color="primary"
                        onClick={this.toggleModal("isOpenNew", { role: "USER" })}
                        className="mr-1">
                        Создать нового пользователя +
                    </Button>
                    <div>
                        <label className="d-flex justify-content-end">
                            Показать SUPER пользователей
                            &nbsp;
                            <input
                                type="checkbox"
                                checked={includeSupers}
                                onChange={this.toggleFilter("includeSupers")} />
                        </label>
                        <label className="d-flex justify-content-end">
                            Показать отключенных пользователей
                            &nbsp;
                            <input
                                type="checkbox"
                                checked={includeDisabled}
                                onChange={this.toggleFilter("includeDisabled")} />
                        </label>
                    </div>
                </div>
                <Table
                    hover
                    className="admin-main-hits_table">
                    <tbody>
                        <tr>
                            <th>Имя пользователя</th>
                            <th>Email</th>
                            <th>Права</th>
                            <th>Действия</th>
                        </tr>
                        {Array.isArray(users) ? users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{convertKind[user.kind]}</td>
                                <td>
                                    <Button
                                        color={`${user.status === "ACTIVE" ? "secondary" : "success"}`}
                                        onClick={() => this.disactivateUser(user)}>
                                        {user.status === "ACTIVE" ? "Отключить" : "Включить"}
                                    </Button>
                                    <Button
                                        className="ml-1"
                                        color="primary"
                                        onClick={this.toggleModal("isOpenEdit", { selectedUser: user })}>
                                        Редактировать
                                    </Button>
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </Table>
                <Pagination
                    total={pagination?.total}
                    onPagination={this.handlePagination}
                    page={pagination?.page} />
                {isOpenNew && (
                    <ModalUserNew
                        {...this.state /* TODO: лютейшее дерьмище, надо как-то от этого избавиться */}
                        objects={objects}
                        companies={companies}
                        changeRole={this.changeState("role")}
                        submitUser={this.submitUser}
                        changeAccessProject={this.changeState("accessProject")}
                        changeAccessState={this.changeState("accessCompanies")}
                        toggleModalNewUser={this.toggleModal("isOpenNew")} />
                )}
                {isOpenEdit && (
                    <ModalUserEdit
                        {...this.state/* TODO: лютейшее дерьмище, надо как-то от этого избавиться */}
                        {...this.props/* TODO: лютейшее дерьмище, надо как-то от этого избавиться */}
                        companies={companies}
                        user={selectedUser}
                        submitUser={this.submitUser}
                        changeAccessState={this.changeState("accessCompanies")}
                        changeAccessProject={this.changeState("accessProject")}
                        toggleModalEditUser={this.toggleModal("isOpenEdit", { selectedUser: null })} />
                )}
            </div>
        );
    }
}

Users.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            pwdChk: PropTypes.string,
        }),
    ).isRequired,
    pagination: PropTypes.shape({
        total: PropTypes.number,
        page: PropTypes.number,
    }).isRequired,
    getUsers: PropTypes.func.isRequired,
    getObjects: PropTypes.func.isRequired,
    putUser: PropTypes.func.isRequired,
    companies: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
    })),
    objects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
    })),
};

export default Users;
