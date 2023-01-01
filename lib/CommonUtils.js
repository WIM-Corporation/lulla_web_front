export const getDeviceContext = function () {
  return window && window["HybridApp"];
};

export const idGenerator = function () {
  return "_" + Math.random().toString(32).substring(2, 9);
};
