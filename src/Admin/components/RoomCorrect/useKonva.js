import { useEffect, useState, useCallback } from "react";
import Konva from "konva";
import { toast } from "react-toastify";

const width = 600;
let height = 300;

const useKonva = () => {
    const [stage, setStage] = useState(null);
    const [markers, setMarkers] = useState();
    const [load, setLoad] = useState(false);
    const [gridActive, _toggleGrid] = useState(true);
    const [viewPort, setViewPort] = useState({ width, height });

    useEffect(() => {
        const _stage = new Konva.Stage({
            container: "konva__container",
            width, height,
        });
        _stage.on("wheel", onWheel);
        setStage(_stage);
        const layer = new Konva.Layer({
            id: "baseLayer",
        });
        layer.zIndex(0);
        _stage.add(layer);
        return () => {
            _stage.destroy();
            height = 300;
        };
    }, []);

    // Анимация загрузки картинки
    const loaderCircle = useCallback((stage) => {
        const layer = new Konva.Layer({
            id: "loaderLayer",
        });
        layer.zIndex(1);
        stage.add(layer);
        const circle = new Konva.Circle({
            x: width / 2,
            y: height / 2,
            stroke: "black",
            strokeWidth: 1,
            radius: 40,
        });
        layer.add(circle);
        const anim = new Konva.Animation((frame) => {
            // console.log(frame)
            const scale = Math.sin((frame.time * 2 * Math.PI) / 4000) + 0.001;
            circle.scaleX(scale);
            circle.scaleY(scale);
        }, layer);
        anim.start();
    }, []);

    useEffect(() => {
        if (!load && stage) {
            const layer = stage.find("#loaderLayer");
            if (layer[0]) {
                layer.destroy();
            }
        }
    }, [stage, load]);
    // ***

    const drawScheme = useCallback((config, callback) => {
        try {
            setLoad(true);
            loaderCircle(stage);
            const layer = new Konva.Layer({
                id: "schemeLayer",
            });
            stage.add(layer);
            Konva.Image.fromURL(config.src, (img) => {
                const ratio = img.image().height / img.image().width;
                height = width * ratio;
                stage.setAttrs({
                    width,
                    height,
                });
                img.setAttrs({
                    width,
                    height,
                });
                layer.add(img);
                // createGridLayer({width, height});
            });
        } catch (err) {
            console.error(err);
            toast.error("Что-то не так", { autoClose: 2000 });
        } finally {
            setLoad(false);
            if (typeof callback === "function") {
                callback();
            }
        }
    }, [stage]);

    const createDot = useCallback((_x, _y, text, index, meta, id) => {
        const x = meta?.schemePosition?.x || Number(_x);
        const y = meta?.schemePosition?.y || Number(_y);
        const group = new Konva.Group({
            draggable: true,
        });
        group.setAttrs({
            schemePosition: {
                ...meta?.schemePosition,
                frameSize: {
                    width: stage.width(),
                    height: stage.height(),
                },
            },
        });
        const dotLayer = new Konva.Circle({
            x,
            y,
            fill: "#94d6fa",
            radius: 12,
        });
        const textlayer = new Konva.Text({
            x,
            y,
            text,
            fontSize: 14,
            fontStyle: "bold",
            fill: "#b630e8",
            offsetX: 7,
            offsetY: 5,
        });
        group.add(dotLayer, textlayer);
        group.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        });
        group.on("dragend", function () {
            const position = stage?.getPointerPosition();
            this.setAttrs({
                schemePosition: {
                    ...position,
                    frameSize: {
                        width: stage.width(),
                        height: stage.height(),
                    },
                },
            });
        });
        group.on("mouseout", () => {
            document.body.style.cursor = "default";
        });
        return group;
    }, [stage]);

    const loadMarkers = useCallback((array) => {
        if (Array.isArray(array)) {
            setMarkers(array);
            const _x = 30;
            let y = 40;
            const layer = new Konva.Layer({
                id: "dots",
            });
            stage.add(layer);
            const dots = array.map((m, i) => {
                const x = ((i + 10) % 10) * _x;
                if (i % 10 === 0) {
                    y += 30;
                }
                return createDot(x + 10, y, i + 1, i, m.meta, m.id);
            });
            layer.add(...dots);
        }
    }, [stage]);

    // Увеличение схемы

    const toggleGrid = useCallback(() => {
        _toggleGrid(!gridActive);
    }, [gridActive]);

    useEffect(() => {
        if (stage) {
            const grid = stage.find("#gridLayer");
            if (grid.length) {
                gridActive ? grid[0].show() : grid[0].hide();
            }
        }
    }, [stage, gridActive]);

    // const createGridLayer = useCallback((viewParams) => {
    //     const gridLayer = new Konva.Layer({
    //         id: "gridLayer",
    //         visible: gridActive,
    //     });
    //     gridLayer.zIndex(10);
    //     stage.add(gridLayer);
    //     const space = 20;
    //     const lines = [];
    //     const gridColor = "#929dd2";
    //     const { width, height } = viewParams;
    //     for (let i = 0; i <= width / space; i++) {
    //         lines.push(
    //             new Konva.Line({
    //                 points: [0, i * space, width, i * space],
    //                 stroke: gridColor,
    //                 strokeWidth: 0.5,
    //             }),
    //         );
    //     }
    //     for (let i = 0; i <= height / space; i++) {
    //         lines.push(
    //             new Konva.Line({
    //                 points: [i * space, 0, i * space, height],
    //                 stroke: gridColor,
    //                 strokeWidth: 0.5,
    //             }),
    //         );
    //     }
    //     gridLayer.add(...lines);
    // }, [stage, viewPort]);

    const onCancel = useCallback(() => {
        const layerForClear = stage.findOne("#dots");
        layerForClear.destroy();
        loadMarkers(markers);
    }, [stage, markers]);

    return {
        stage, drawScheme, loadMarkers, toggleGrid, markers, onCancel,
    };
};

export default useKonva;
