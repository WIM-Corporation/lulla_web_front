import { useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/DraggableTag.module.scss";
import {
  degToRadian,
  getLength,
  getNewStyle,
} from "@/components/App/Album/TagCanvas/DraggableUtils";

export default function DraggableTag({
  top,
  left,
  right,
  bottom,
  onResize,
  onDrag,
  draggable,
}) {
  const [rectPosition, setRectPosition] = useState(null);
  const [boxStyle, setBoxStyle] = useState(null);
  const centerYX = useRef([(top+bottom)/2, (right+left)/2])

  const startDrag = (e) => {
    if (!draggable) {
      return;
    }
    let startX = e.changedTouches[0].screenX;
    let startY = e.changedTouches[0].screenY;
    let _isMouseDown = true;

    const onMove = (e) => {
      if (!_isMouseDown) return;
      e.stopImmediatePropagation();
      const clientX = e.changedTouches[0].screenX;
      const clientY = e.changedTouches[0].screenY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      startX = clientX;
      startY = clientY;

      const _width = rectPosition[2] - rectPosition[0];
      const _height = rectPosition[3] - rectPosition[1];
      const _top = centerYX.current[0] - (_height / 2) + deltaY;
      const _left = centerYX.current[1] - (_width / 2) + deltaX;
      const _right = _left + _width;
      const _bottom = _top + _height;

      centerYX.current=[centerYX.current[0]+deltaY,centerYX.current[1]+deltaX]
      const newBbox = [_left, _top, _right, _bottom];

      setBoxStyle({
        width: Math.abs(_width),
        height: Math.abs(_height),
        left: _left,
        top: _top,
      });
      setRectPosition(newBbox)

      onDrag(deltaX, deltaY, newBbox);
    };
    const onUp = (e) => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
      if (!_isMouseDown) return;
    };

    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onUp);
  };

  const startResize = (e, cursor) => {
    if (!draggable) {
      return;
    }
    document.body.style.cursor = cursor;
    const startX = e.changedTouches[0].screenX;
    const startY = e.changedTouches[0].screenY;

    const width = rectPosition[2] - rectPosition[0];
    const height = rectPosition[3] - rectPosition[1];
    const centerX = rectPosition[0] + width / 2;
    const centerY = rectPosition[1] + height / 2;

    const rect = { width, height, centerX, centerY };
    const type = e.target.style.cssText.split(": ")[1].replace("-resize;", "");

    let _isMouseDown = true;
    const onMove = (e) => {
      if (!_isMouseDown) return;
      e.stopImmediatePropagation();
      const deltaX = e.changedTouches[0].screenX - startX;
      const deltaY = e.changedTouches[0].screenY - startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);

      const beta = alpha - degToRadian(0);
      const deltaW = deltaL * Math.cos(beta);
      const deltaH = deltaL * Math.sin(beta);
      const newStyle = getNewStyle(type, rect, deltaW, deltaH);

      const _width = newStyle.size.width;
      const _height = newStyle.size.height;
      const _top = newStyle.position.centerY - _height / 2;
      const _left = newStyle.position.centerX - _width / 2;
      const _right = _left + _width;
      const _bottom = _top + _height;

      const _rectPosition = [_left, _top, _right, _bottom];
      setRectPosition(_rectPosition);
      setBoxStyle({
        width: Math.abs(_width),
        height: Math.abs(_height),
        left: _left,
        top: _top,
      });
      centerYX.current=[(_top+_bottom)/2,(_left+_right)/2]
      onResize(_rectPosition, type);
    };

    const onUp = () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
      if (!_isMouseDown) return;
      _isMouseDown = false;
    };

    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onUp);
  };

  useEffect(() => {
    const _rectPosition = [left, top, right, bottom];
    setRectPosition(_rectPosition);

    const _width = right - left;
    const _height = bottom - top;
    setBoxStyle({
      width: Math.abs(_width),
      height: Math.abs(_height),
      left: left,
      top: top,
    });
  }, []);

  return (
    <div
      onTouchStart={startDrag}
      className={`${styles.tag_box} rect single-resizer`}
      style={boxStyle}
    >
      <div
        className={`${styles.tl} ${styles.resizable_handler}`}
        style={{ cursor: "nw-resize" }}
        onTouchStart={(e) => startResize(e, "nw-resize")}
      ></div>
      <div
        className={`${styles.tr} ${styles.resizable_handler}`}
        style={{ cursor: "ne-resize" }}
        onTouchStart={(e) => startResize(e, "ne-resize")}
      ></div>
      <div
        className={`${styles.br} ${styles.resizable_handler}`}
        style={{ cursor: "se-resize" }}
        onTouchStart={(e) => startResize(e, "se-resize")}
      ></div>
      <div
        className={`${styles.bl} ${styles.resizable_handler}`}
        style={{ cursor: "sw-resize" }}
        onTouchStart={(e) => startResize(e, "sw-resize")}
      ></div>

      <div className={`${styles.tl} ${styles.square}`}></div>
      <div className={`${styles.tr} ${styles.square}`}></div>
      <div className={`${styles.br} ${styles.square}`}></div>
      <div className={`${styles.bl} ${styles.square}`}></div>
    </div>
  );
}