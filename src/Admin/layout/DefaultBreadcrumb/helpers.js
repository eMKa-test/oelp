import Line from "./Line";
import Object from "./Object";
import Company from "./Company";
import Promo from "./Promo";

export const routeConfig = [
    {
        path: [
            "/admin/companies/:companyId/:objectId/:lineId/configuration",
            "/admin/objects/:objectId/:lineId/configuration",
        ],
        breadcrumb: "Конфигурация",
    },
    {
        path: "/admin/companies/:companyId/:objectId/:lineId",
        breadcrumb: Line,
        props: { is: "line" },
    },
    {
        path: ["/admin/companies/:companyId/stream", "/admin/companies/:companyId/promo"],
        breadcrumb: Promo,
        props: { is: "promo" },
    },
    {
        path: "/admin/companies/:companyId/:objectId",
        breadcrumb: Object,
        props: { is: "object" },
    },
    {
        path: "/admin/companies/:companyId",
        breadcrumb: Company,
        props: { is: "company" },
    },
    {
        path: "/admin/objects/:objectId/:lineId",
        breadcrumb: Line,
        props: { is: "line" },
    },
    {
        path: "/admin/objects/:objectId",
        breadcrumb: Object,
        props: { is: "object" },
    },
    {
        path: "/admin/companies",
        breadcrumb: "Компании",
    },
    {
        path: "/admin/objects",
        breadcrumb: "Объекты",
    },
    {
        path: "/admin/lines-movement",
        breadcrumb: "Перенос отрезков",
    },
    {
        path: "/admin/users",
        breadcrumb: "Пользователи",
    },
    {
        path: "/admin/stats",
        breadcrumb: "Метрика",
    },
    {
        path: "/admin/content-sets",
        breadcrumb: "Загруженные сеты",
    },
    {
        path: "/admin",
        breadcrumb: "Главная",
    },
    {
        path: "/",
        breadcrumb: null,
    },
];
