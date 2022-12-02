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
        overflow: "hidden",
        transition: `max-height ${duration}ms ease-in`,
    },
    caret: {
        transition: `transform ${duration}ms ease`,
    },
}));

const Collapse = (props) => {
    const {
        title = "Раскрыть",
        duration = 350,
        children = <InitialCollapse />,
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
            } else {
                node.current.style.maxHeight = `${0}px`;
            }
        }
    }, [node.current, _open]);

    return (
        <div className="collapsed__wrapper">
            <button
                onClick={_toggle}
                type="button"
                className="btn_like_div collapse-button">
                <span className="title">
                    {title}
                </span>
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
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    duration: PropTypes.number.isRequired,
};

export default memo(Collapse);
