import React, { memo } from "react";
import Collapse from "../Collapse";
import { promoTypes } from "../../common/helpers";
import DropItem from "./DropItem";
import "./style.css";

const PromoUploadsRow = () => (
    <div className="promo-uploads-row">
        <Collapse
            disabled
            showStatus={false}
            title="Промо | Стримы"
            classname="promo-title"
            duration={200}>
            <div className="promo-uploads__body">
                {promoTypes.map((item, i) => (
                    <DropItem
                        {...item}
                        key={String(i)} />
                ))}
            </div>
        </Collapse>
    </div>
);

export default memo(PromoUploadsRow);
