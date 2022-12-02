export const boundFunc = (pos, scale, { width, height }) => {
    const x = Math.min(0, Math.max(pos.x, (width) * (1 - scale)));
    const y = Math.min(0, Math.max(pos.y, height * (1 - scale)));
    return { x, y };
};

export const onWheel = (grabActive) => (e) => {
    if (!grabActive) {
        return null;
    }
    e.evt.preventDefault();
    const scaleBy = 1.25;
    const layer = e.currentTarget;
    const oldScale = layer.scaleX();
    const pointer = layer.getRelativePointerPosition();

    const mousePointTo = {
        x: (pointer.x - layer.x()) / oldScale,
        y: (pointer.y - layer.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale < 1) {
        return null;
    }
    const x = -(mousePointTo.x - layer.getRelativePointerPosition().x / newScale) * newScale;
    const y = -(mousePointTo.y - layer.getRelativePointerPosition().y / newScale) * newScale;

    const pos = boundFunc({ x, y }, newScale, { width: layer.width(), height: layer.height() });
    layer.scale({ x: newScale, y: newScale });
    return layer.position({ x: pos.x, y: pos.y });
};

export const reconstructArray = (array, index) => {
    array.splice(index, 1);
    array.forEach((item, i) => {
        item.pointId = i + 1;
    });
    return array;
};
