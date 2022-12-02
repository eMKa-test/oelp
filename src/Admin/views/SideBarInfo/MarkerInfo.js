import React, { memo, useCallback } from "react";
import "./style.css";

const MarkerInfo = () => {
    const onMouseEnter = useCallback((selector) => () => {
        const elem = document.querySelector(selector);
        elem.style.animation = "pulsate 500ms linear infinite";
    }, []);

    const onMouseLeave = useCallback((selector) => () => {
        const elem = document.querySelector(selector);
        elem.style.animation = "none";
    }, []);

    return (
        <div className="configuration-info__wrapper">
            <h4 className="text-center">Шпаргалка</h4>
            <ol>
                <li
                    className="info-item"
                    onMouseLeave={onMouseLeave(".scheme__dropzone")}
                    onMouseOver={onMouseEnter(".scheme__dropzone")}>
                    Загрузить схему
                </li>
                <li
                    className="info-item"
                    onMouseLeave={onMouseLeave(".create-markers__collapse")}
                    onMouseOver={onMouseEnter(".create-markers__collapse")}>
                    Добавить необходимое кол-во маркеров
                </li>
                <li>
                    Для удаления - кликнуть два раза по маркеру
                </li>
                <li
                    className="info-item"
                    onMouseLeave={onMouseLeave(".button-cancel")}
                    onMouseOver={onMouseEnter(".button-cancel")}>
                    Для отмены изменений нажать крестик (отменятся все не сохранённые перемещения, все новые добавленные маркеры)
                </li>
                <li
                    className="info-item"
                    onMouseLeave={onMouseLeave(".remove-scheme__button")}
                    onMouseOver={onMouseEnter(".remove-scheme__button")}>
                    Удаление схемы не работает
                </li>
                <li className="info__container">
                    В помощь:
                    <ul>
                        <li
                            className="info-item"
                            onMouseLeave={onMouseLeave(".button-grid")}
                            onMouseOver={onMouseEnter(".button-grid")}>
                            <div>
                                <span className="list-style">&ndash;</span>
                                <span>
                                    Сетка
                                </span>
                            </div>
                            <span className="list-icon">
                                <i className="fa fa-table" />
                            </span>
                        </li>
                        <li
                            className="info-item"
                            onMouseLeave={onMouseLeave(".button-grab")}
                            onMouseOver={onMouseEnter(".button-grab")}>
                            <div>
                                <span className="list-style">&ndash;</span>
                                <span>
                                    Режим карты
                                </span>
                            </div>
                            <span className="list-icon">
                                <i className="fa fa-hand-paper-o" />
                            </span>
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
    );
};

MarkerInfo.propTypes = {};

export default memo(MarkerInfo);
