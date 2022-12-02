import React, {
    memo, useCallback, useState, useRef, useEffect,
} from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import memoize from "lodash/memoize";
import "./style.css";

const InitialCollapse = () => (
    <section>
        <h3>Заголовок</h3>
        <p>Lorem ipsum...</p>
    </section>
);

const transitionStyle = memoize((duration) => ({
    body: {
        visibility: "hidden",
        transition: `max-height ${duration}ms ease-in`,
    },
    caret: {
        transition: `transform ${duration}ms ease`,
    },
}));

const Collapse = (props) => {
    const {
        disabled,
        isError,
        title = "Раскрыть",
        nodeTitle,
        duration = 350,
        children = <InitialCollapse />,
        classname = "",
        rightTitle,
        showStatus = true,
    } = props;
    const [_open, setOpen] = useState(false);
    const node = useRef(null);

    const _toggle = useCallback(() => {
        setOpen(!_open);
    }, [_open]);

    useEffect(() => {
        if (node.current) {
            if (_open) {
                node.current.style.maxHeight = `${node?.current.scrollHeight}px`;
                setTimeout(() => {
                    node.current.style.visibility = "visible";
                }, duration);
            } else {
                node.current.style.maxHeight = 0;
                node.current.style.visibility = "hidden";
            }
        }
    }, [node.current, _open, duration]);

    return (
        <div
            className="collapsed__wrapper">
            <button
                disabled={disabled}
                title={showStatus ? (isError ? "Неуспешная передача" : "Успешная передача") : ""}
                onClick={_toggle}
                type="button"
                className={`btn_like_div collapse-button ${classname} ${_open ? "opened" : ""}`}>
                {nodeTitle || (
                    <span className={`title ${isError ? "text-danger" : ""}`}>
                        {title}
                    </span>
                )}
                <div className="right-title">
                    {rightTitle && rightTitle}
                    {showStatus && (
                        <span>
                            {isError ? (
                                <i className="fa fa-warning text-danger" />
                            ) : (
                                <i className="fa fa-check text-success" />
                            )}
                        </span>
                    )}
                    <span
                        style={{
                            ...transitionStyle(duration).caret,
                        }}
                        className={classnames("caret", {
                            show: !_open,
                            hide: _open,
                        })}>
                        <i className="fa fa-caret-down" />
                    </span>
                </div>
            </button>
            <div
                ref={node}
                className="collapsed-body"
                style={{ ...transitionStyle(duration).body }}>
                {children}
            </div>
        </div>
    );
};

Collapse.propTypes = {
    showStatus: PropTypes.bool,
    classname: PropTypes.string,
    rightTitle: PropTypes.string,
    children: PropTypes.element.isRequired,
    nodeTitle: PropTypes.element,
    duration: PropTypes.number,
    isError: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
    ]),
};

export default memo(Collapse);
