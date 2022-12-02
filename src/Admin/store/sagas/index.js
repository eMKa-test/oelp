import { all } from "redux-saga/effects";

import { watchGetOperator } from "./generalSagas";
import { watchGetUsers, watchPutUser } from "./usersSagas";
import {
    watchPutLine,
    watchGetLineByID,
    watchGetLineSchemes,
    watchDeleteLineSchemes,
    watchUploadLineScheme,
    watchUpdateLineSchemePoints,
} from "./linesSagas";
import {
    watchPutPromo,
    watchDeletePromo,
    watchGetPromoByCompanyId,
} from "./promoSagas";
import {
    watchGetObjects,
    watchPutObject,
    watchGetObjectByID,
    watchDeleteObject,
} from "./objectsSagas";
import {
    watchGetCompanies,
    watchPutCompanies,
    watchGetCompaniesByID,
    watchDeleteCompanies,
    watchGetProjects,
} from "./companiesSagas";
import {
    watchGetContent,
    watchGetDates,
    watchChangeContentType,
    watchChangeDateFrom,
    watchGetInitialContent,
    watchUpdateContent,
    watchGetGpsTmpContentWorker,
    watchPostGpsTmpWorker,
    watchDeleteGpsTmpWorker,
} from "./contentSagas";
import {
    watchMapGetContent,
    watchUpdateMarkersPosition,
} from "./mapSagas";
import {
    watchGetContentRoutes,
    watchGetContentLoops,
} from "./panoramaSagas";

const watchers = [
    watchGetUsers(),
    watchPutUser(),
    watchGetOperator(),
    watchGetObjects(),
    watchPutObject(),
    watchGetObjectByID(),
    watchPutLine(),
    watchGetLineByID(),
    watchGetCompanies(),
    watchPutCompanies(),
    watchPutPromo(),
    watchGetCompaniesByID(),
    watchDeleteCompanies(),
    watchDeleteObject(),
    watchDeletePromo(),
    watchGetPromoByCompanyId(),
    watchGetContent(),
    watchGetDates(),
    watchChangeContentType(),
    watchChangeDateFrom(),
    watchUpdateContent(),
    watchGetInitialContent(),
    watchMapGetContent(),
    watchUpdateMarkersPosition(),
    watchGetGpsTmpContentWorker(),
    watchPostGpsTmpWorker(),
    watchDeleteGpsTmpWorker(),
    watchGetProjects(),
    watchGetContentRoutes(),
    watchGetContentLoops(),
    watchGetLineSchemes(),
    watchDeleteLineSchemes(),
    watchUploadLineScheme(),
    watchUpdateLineSchemePoints(),
];

const rootSaga = function* rootSaga() {
    yield all(watchers);
};

export default rootSaga;
