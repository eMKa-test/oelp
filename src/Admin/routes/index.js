import { lazy } from "react";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Companies = lazy(() => import("../views/Companies"));
const CompaniesEdit = lazy(() => import("../views/Companies/CompaniesEditContainer"));
const Objects = lazy(() => import("../views/Objects/ObjectsContainer"));
const ObjectEdit = lazy(() => import("../views/Objects/ObjectEditContainer"));
const LineEdit = lazy(() => import("../views/Lines/LineEditContainer"));
const Stats = lazy(() => import("../views/Stats"));
const Users = lazy(() => import("../views/Users"));
const ContentSets = lazy(() => import("../views/ContentSets"));
const MovementLines = lazy(() => import("../views/MovementLines"));
const Promo = lazy(() => import("../views/Promo"));

export const routes = [
    {
        exact: true,
        path: "/admin/companies/:companyID/:objectID/:lineID",
        component: LineEdit,
    },
    {
        exact: true,
        path: ["/admin/companies/:companyID/promo", "/admin/companies/:companyID/stream"],
        component: Promo,
    },
    {
        exact: true,
        path: "/admin/companies/:companyID/:objectID",
        component: ObjectEdit,
    },
    {
        exact: true,
        path: "/admin/companies/:companyID",
        component: CompaniesEdit,
    },
    {
        exact: true,
        path: "/admin/companies",
        component: Companies,
    },
    {
        exact: false,
        path: "/admin/objects/:objectID/:lineID",
        component: LineEdit,
    },
    {
        exact: true,
        path: "/admin/objects/:objectID",
        component: ObjectEdit,
    },
    {
        exact: true,
        path: "/admin/objects",
        component: Objects,
    },
    {
        exact: true,
        path: "/admin/lines-movement",
        component: MovementLines,
    },
    {
        exact: false,
        path: "/admin/users",
        component: Users,
    },
    {
        exact: false,
        path: "/admin/stats",
        component: Stats,
    },
    {
        exact: false,
        path: "/admin/content-sets",
        component: ContentSets,
    },
    {
        exact: true,
        path: "/admin",
        component: Dashboard,
    },
];

export const headerRoutes = [
    {
        name: "Компании",
        to: "/admin/companies",
    },
    {
        name: "Объекты",
        to: "/admin/objects",
    },
    {
        name: "Перенос отрезков",
        to: "/admin/lines-movement",
    },
    {
        name: "Пользователи",
        to: "/admin/users",
    },
    {
        name: "Метрика",
        to: "/admin/stats",
    },
    {
        name: "Загруженные сеты",
        to: "/admin/content-sets",
    },
];
