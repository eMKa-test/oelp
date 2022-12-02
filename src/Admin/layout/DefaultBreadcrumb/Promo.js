import { memo } from "react";
import { useRouteMatch } from "react-router-dom";

const promoTitles = {
    promo: "Промо",
    stream: "Стримы",
};

const Promo = () => {
    const { params: { promoType } } = useRouteMatch("/admin/companies/:companyId/:promoType");

    return promoTitles[promoType];
};

Promo.propTypes = {};

export default memo(Promo);
