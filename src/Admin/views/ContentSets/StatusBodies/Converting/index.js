import React, {
    memo, useCallback, useMemo, useState,
} from "react";
import * as PropTypes from "prop-types";
import { Button, Spinner } from "reactstrap";
import { getData } from "../../../../../api";
import "./style.css";

const ConvertingStatus = (props) => {
    const { set } = props;
    const [_set, setNewSet] = useState(() => ({ ...set }));
    const [load, setLoad] = useState(false);

    const updateSet = useCallback(() => {
        setLoad(true);
        const mainUrl = `/admin/api/contentSets/${set.id}`;
        getData({ mainUrl })
            .then((res) => {
                if (res.success) {
                    setNewSet({ ...res.payload });
                }
            })
            .finally(() => setLoad(false));
    }, [set]);

    const convertFiles = useMemo(() => {
        const result = {
            CONVERTING: [],
            CONVERTED: [],
        };
        _set.files.forEach(
            (file) => (result?.[file.status] ? result?.[file.status].push(file) : result[file.status] = [file]),
        );
        return result;
    }, [_set]);

    return (
        <div className="set-body-convert__wrapper">
            <div className="files__info">
                <div className="file">
                    <div className="body">
                        <div className="c-table w-75">
                            <div className="c-table__header">
                                <div className="c-table__col sm">
                                    <span className="col__header">
                                        Загружено
                                    </span>
                                </div>
                                <div
                                    className="c-table__col sm">
                                    <span className="col__header">
                                        Конвертируется
                                    </span>
                                </div>
                                <div
                                    className="c-table__col sm">
                                    <span className="col__header">
                                        Сконвертировано
                                    </span>
                                </div>
                                <div
                                    className="c-table__col sm">
                                    <Button
                                        title="Обновить сет"
                                        className="update__button ol__header"
                                        onClick={updateSet}
                                        color="light">
                                        {!load ? (
                                            <i className="fa fa-refresh text-primary" />
                                        ) : (
                                            <Spinner
                                                type="grow"
                                                className="update-icon"
                                                color="primary" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="c-table__body">
                                <div className="c-table__col sm">
                                    <div className="c-table__vertical-col">
                                        {convertFiles?.UPLOADED?.map((f, i) => (
                                            <div key={String(i)}>
                                                {f.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="c-table__col sm">
                                    <div className="c-table__vertical-col">
                                        {convertFiles?.CONVERTING?.map((f, i) => (
                                            <div key={String(i)}>
                                                {f.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="c-table__col sm">
                                    <div className="c-table__vertical-col">
                                        {convertFiles?.CONVERTED?.map((f, i) => (
                                            <div key={String(i)}>
                                                {f.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="c-table__col sm">
                                    <div className="c-table__vertical-col" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ConvertingStatus.propTypes = {
    set: PropTypes.shape({
        id: PropTypes.number,
        files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};

export default memo(ConvertingStatus);
