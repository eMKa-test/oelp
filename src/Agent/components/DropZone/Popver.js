import React, {
    memo, useCallback, useEffect, useRef,
} from "react";
import * as PropTypes from "prop-types";
import { formatTitle } from "../../common/helpers";

const Popover = ({
    open,
    onClose,
    files = [],
    isAerial = false,
}) => {
    const wrapperRef = useRef(null);

    const handleClick = useCallback((e) => {
        const node = wrapperRef.current;
        const {
            left,
            top,
            width,
            height,
        } = node.getBoundingClientRect();
        if (
            e.clientX < Math.floor(left)
            || e.clientX > Math.floor(left + width)
            || e.clientY > Math.floor(left + width)
            || e.clientY < Math.floor(top)
            || e.clientY > Math.floor(top + height)
        ) {
            onClose();
        }
    }, [wrapperRef, open]);

    useEffect(() => {
        if (open) {
            document.addEventListener("click", handleClick);
        }
        return () => document.removeEventListener("click", handleClick);
    }, [open]);

    return (
        <div
            ref={wrapperRef}
            className={`upload-card__popover ${!open ? "hide" : "show"}`}>
            <div className="popover__body">
                {isAerial ? (
                    <div className="list__wrapper">
                        <div className="list__col">
                            <p>Видео:</p>
                            {files[0]?.length ? (
                                <ol>
                                    {files[0].map((f, i) => (
                                        <li key={String(i)}>{formatTitle(f?.name)}</li>
                                    ))}
                                </ol>
                            ) : (<p className="no-files">Пусто</p>)}
                            <p>Субтитры:</p>
                            {files[1]?.length ? (
                                <ol>
                                    {files[1].map((f, i) => (
                                        <li key={String(i)}>{formatTitle(f?.name)}</li>
                                    ))}
                                </ol>
                            ) : (<p className="no-files">Пусто</p>)}
                        </div>
                    </div>
                ) : (
                    <div className="list__wrapper">
                        <div className="list__col">
                            {files?.length ? (
                                <ol>
                                    {files.map((f, i) => (
                                        <li key={String(i)}>{formatTitle(f?.name)}</li>
                                    ))}
                                </ol>
                            ) : (<p className="no-files">Пусто</p>)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

Popover.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isAerial: PropTypes.bool,
    files: PropTypes.any,
};

export default memo(Popover);
