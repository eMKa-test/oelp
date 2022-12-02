import React, { Fragment, Component } from "react";
import { Button } from "reactstrap";
import ReactDOM from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import Auth from "./Auth";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            loading: true,
        };
    }

    componentDidMount() {
        document.querySelector(".spinner__wrapper").style.display = "none";
        const qParams = new URLSearchParams(window.location.search);
        const isAgentQuery = qParams.has("isAgent");
        fetch("/user/api/my")
            .then((res) => res.json())
            .then((res) => {
                if (res?.success) {
                    if (["AGENT", "SUPER"].includes(res?.payload?.kind)) {
                        this.setState({ isLogged: true });
                    }
                    if (isAgentQuery && qParams.get("isAgent") === "false") {
                        toast.error(
                            "Вам закрыт доступ в агентскую форму. Обратитесь к куратору",
                            { autoClose: 6000 },
                        );
                    }
                }
            })
            .catch(console.error)
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    redirect = (url) => () => {
        window.location.href = url;
    };

    render() {
        const {
            isLogged,
            loading,
        } = this.state;
        if (loading) {
            return null;
        }
        return (
            <Fragment>
                <ToastContainer
                    autoClose={2000}
                    hideProgressBar
                    draggable={false} />
                <div className="Admin-auth">
                    {isLogged ? (
                        <React.Fragment>
                            <Button
                                className="auth-btn"
                                onClick={this.redirect("/agent")}>
                                Агенты
                            </Button>
                            <Button
                                className="auth-btn"
                                onClick={this.redirect("/admin")}>
                                Админка
                            </Button>
                        </React.Fragment>
                    ) : (
                        <Auth />
                    )}
                </div>
            </Fragment>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById("root"));
