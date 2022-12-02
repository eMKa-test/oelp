import React, { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import placeholder from "../../../../assets/placeholders/obj.jpg";

const TransferLines = () => {
    const objects = useSelector((store) => store.objects.objects);
    const lines = objects.flatMap((obj) => obj.lines);

    const dragStart = useCallback((id) => (e) => {
        e.dataTransfer.setData("application/my-app", id);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const onDragEnd = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <div className="TransferLines">
            <span className="title">Перемещение отрезков</span>
            <div className="line-list__wrapper">
                {[...lines].map((line, i) => (
                    <div
                        key={String(i)}
                        onDragEnd={onDragEnd}
                        onDragStart={dragStart(line.id)}
                        draggable
                        className="line">
                        <div className="image">
                            <img
                                src={line?.image?.tmb || placeholder}
                                alt="pic" />
                        </div>
                        <div className="title">
                            {line.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(TransferLines);
