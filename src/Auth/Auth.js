import React from "react";
import {
    Form, FormGroup, Input, Button, Alert,
} from "reactstrap";
import "./style.css";
import axios from "axios";

const Auth = () => {
    const [error, setError] = React.useState(null);

    const onSubmit = React.useCallback((e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        axios.post("/api/login", {
            email,
            password,
        })
            .then((res) => {
                if (res?.data?.success) {
                    window.location.href = res.data.redirect;
                }
            })
            .catch((err) => {
                setError("Ошибка авторизации");
                console.error(err);
            });
    }, []);

    React.useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 1500);
        }
    }, [error]);

    return (
        <div className="Admin-auth">
            <div className="Admin-auth-form">
                <div className="Admin-auth-header">
                    <p>Авторизация</p>
                </div>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Input
                            autoComplete="username"
                            type="email"
                            name="email"
                            placeholder="Почта" />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            autoComplete="current-password"
                            type="password"
                            name="password"
                            placeholder="Пароль" />
                    </FormGroup>
                    <FormGroup className="mt-4">
                        <Button
                            style={{ width: "100%" }}
                            type="submit">
                            Войти
                        </Button>
                    </FormGroup>
                </Form>
                <Alert
                    isOpen={error}
                    className="Admin-auth-error"
                    color="danger">
                    {error}
                </Alert>
            </div>
        </div>
    );
};

export default React.memo(Auth);
