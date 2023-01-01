import axios from "axios";

export const instance = axios.create();

export const req = async (url, config = {}, token = "") => {
  const headers = { ...(config?.headers ?? {}) };
  if (token && !headers?.["Authorization"])
    headers["Authorization"] = "Bearer " + token;
  return await axios({ url, ...config, headers });
};
