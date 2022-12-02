import React, { memo, useCallback, useState } from "react";
import * as PropTypes from "prop-types";
import RCPagination from "rc-pagination";
import RCSelect from "rc-select";

const pageSizeOptions = ["50", "100", "150"];
const locale = {
    items_per_page: "/ стр",
    jump_to: "Перейти",
    jump_to_confirm: "подтвердить",
    page: "",
    prev_page: "Назад",
    next_page: "Вперед",
    prev_5: "Предыдущие 5",
    next_5: "Следующие 5",
    prev_3: "Предыдущие 3",
    next_3: "Следующие 3",
};

const DefaultPagination = (props) => {
    const {
        total,
        limit = 50,
        page,
        onPagination,
        disabled = false,
    } = props;
    const [lim, setLimit] = useState(limit);

    const handlePagination = (_page, _limit) => {
        setLimit(_limit);
        onPagination({
            page: _page,
            limit: _limit,
        });
    };

    const renderTotal = useCallback((_total) => `Всего: ${_total} шт.`, []);

    if (total === 0) {
        return null;
    }

    return (
        <RCPagination
            disabled={disabled}
            showTotal={renderTotal}
            onChange={handlePagination}
            locale={locale}
            selectComponentClass={RCSelect}
            showSizeChanger
            onShowSizeChange={handlePagination}
            current={page}
            pageSize={lim}
            pageSizeOptions={pageSizeOptions}
            showTitle={false}
            total={total} />
    );
};

DefaultPagination.propTypes = {
    disabled: PropTypes.bool,
    total: PropTypes.number,
    limit: PropTypes.number,
    page: PropTypes.number,
    onPagination: PropTypes.func,
};

export default memo(DefaultPagination);
