import { useEffect, useCallback } from "react";
import { matchPath } from "react-router";
import { useHistory } from "react-router-dom";
import { getRouteParams } from "../../store/actionCreators/routerActions";
import store from "../../store";

const path = [
    "/admin/companies/:companyID/:objectID/:lineID/:lineConfig",
    "/admin/companies/:companyID/:objectID/:lineID",
    "/admin/companies/:companyID/:objectID",
    "/admin/objects/:objectID/:lineID/:lineConfig",
    "/admin/objects/:objectID/:lineID",
    "/admin/objects/:objectID",
    "/admin/companies/:companyID",
];

export default () => {
    const history = useHistory();

    const getParams = useCallback((pathname) => {
        const match = matchPath(pathname, {
            path,
            exact: true,
            strict: false,
        });
        const params = {
            companyID: null,
            objectID: null,
            lineID: null,
            lineConfig: null,
            url: pathname,
        };
        return match?.params ? Object.assign(params, match.params) : params;
    }, []);

    useEffect(() => {
        store.dispatch(getRouteParams(getParams(history.location.pathname)));
        history.listen(({ pathname }) => {
            store.dispatch(getRouteParams(getParams(pathname)));
        });
    }, []);
};
