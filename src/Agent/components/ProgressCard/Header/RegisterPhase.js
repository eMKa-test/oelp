import React, { memo, useEffect } from "react";
import RegisterLoader from "../../Loader/RegisterLoader";

const RegisterPhase = () => {
    useEffect(() => {
        document.title = "Сфера > Регистрация сетов";
    }, []);

    return (
        <div className="registration-phase d-flex">
            Регистрация сетов
            &nbsp;
            <RegisterLoader />
        </div>
    );
};

RegisterPhase.propTypes = {};

export default memo(RegisterPhase);
