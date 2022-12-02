import { SET_ROUTER_PARAMS } from "../../constants";

export function getRouteParams(params = {}) {
    return {
        type: SET_ROUTER_PARAMS,
        params,
    };
}
