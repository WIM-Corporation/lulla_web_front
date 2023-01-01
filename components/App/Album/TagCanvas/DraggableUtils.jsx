export const getLength = (x, y) => Math.sqrt(x * x + y * y);
export const degToRadian = (deg) => (deg * Math.PI) / 180;

const cos = (deg) => Math.cos(degToRadian(deg));
const sin = (deg) => Math.sin(degToRadian(deg));

const setWidthAndDeltaW = (width, deltaW, minWidth) => {
  const expectedWidth = width + deltaW;
  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }
  return { width, deltaW };
};

const setHeightAndDeltaH = (height, deltaH, minHeight) => {
  const expectedHeight = height + deltaH;
  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }
  return { height, deltaH };
};

export const getNewStyle = (type, rect, deltaW, deltaH) => {
  let { width, height, centerX, centerY } = rect;
  const rotateAngle = 0;
  const widthFlag = width < 0 ? -1 : 1;
  const heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);
  let minWidth = 10;
  let minHeight = 10;

  switch (type) {
    case "ne": {
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      centerX +=
        (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY +=
        (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case "se": {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      centerX +=
        (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY +=
        (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case "sw": {
      deltaW = -deltaW;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      centerX -=
        (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY -=
        (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case "nw": {
      deltaW = -deltaW;
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      centerX -=
        (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY -=
        (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
  }

  return {
    position: {
      centerX,
      centerY,
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag,
    },
  };
};
