export const initialState = () => ({
    markers: [],
    baseBounds: [],
    activeMarker: null,
    neighbours: [],
    contentRoutes: null,
    routes: [],
    arrowsMode: false,
    contents: [],
    contentBounds: [],
});

const LOAD__CONTENT__ROUTES = "LOAD__CONTENT__ROUTES";
export const loadContentRoutes = (contentRoutes, mapMarkers) => ({ type: LOAD__CONTENT__ROUTES, contentRoutes, mapMarkers });
const SET__ACTIVE__MARKER = "SET__ACTIVE__MARKER";
export const setActiveMarker = (activeMarker) => ({ type: SET__ACTIVE__MARKER, activeMarker });
const SET__NEIGHBOUR = "SET__NEIGHBOUR";
export const setNeighbour = (neighbour) => ({ type: SET__NEIGHBOUR, neighbour });
const SET__ARROWS__MODE = "SET__ARROWS__MODE";
export const setArrowsMode = (arrowsMode) => ({ type: SET__ARROWS__MODE, arrowsMode });
const RESET = "RESET";
export const reset = () => ({ type: RESET });

export default (state, action) => {
    switch (action.type) {
        case LOAD__CONTENT__ROUTES: {
            const { contentRoutes, mapMarkers } = action;
            const markers = [...mapMarkers];
            markers.reverse();
            const contentBounds = [...markers];
            let deadEndItems = [];
            if (contentRoutes?.route?.length > 0) {
                deadEndItems = contentRoutes.route.reduce((acc, cur) => {
                    if (cur.deadEnd) {
                        acc.push(cur.pointId);
                    }
                    return acc;
                }, []);
            }
            markers.forEach((m) => {
                if (m?.directions?.length > 0) {
                    m.arrowPosition = [];
                    m.directions.forEach((dir) => {
                        const neighbour = markers.find((a) => a.id === dir.contentId);
                        if (deadEndItems.includes(m.pointId)) {
                            m.deadEnd = true;
                        }
                        if (neighbour && !deadEndItems.includes(m.pointId)) {
                            m.arrowPosition.push([m.position, neighbour.position]);
                        }
                    });
                }
            });
            const baseBounds = [];
            // const baseBounds = markers.map((marker) => {
            //     marker.deadEnd = false;
            //     return marker.position;
            // });
            return {
                ...state, contentRoutes, markers, baseBounds, contentBounds,
            };
        }
        case SET__ARROWS__MODE: {
            const { arrowsMode } = action;
            return { ...state, arrowsMode };
        }
        case SET__ACTIVE__MARKER: {
            const { activeMarker } = action;
            const marker = { ...activeMarker };
            if (state.contentRoutes) {
                const match = state.contentRoutes.route.find((c) => c.pointId === activeMarker.pointId);
                if (match) {
                    marker.contentOptions = { ...match };
                }
            }
            return { ...state, activeMarker: marker };
        }
        case SET__NEIGHBOUR: {
            const neighbours = [...state.neighbours];
            if (state.activeMarker?.id !== action.neighbour.id) {
                const matchIndex = neighbours.findIndex((n) => n.id === action.neighbour.id);
                if (matchIndex > -1) {
                    neighbours.splice(matchIndex, 1);
                } else {
                    neighbours.push(action.neighbour);
                }
            }
            return { ...state, neighbours };
        }
        case RESET: {
            return {
                ...state, activeMarker: null, neighbours: [], arrowsMode: false,
            };
        }
        default: return state;
    }
};
