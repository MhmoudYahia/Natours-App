import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 5000, // 5 seconds
  withCredentials: true,
  credentials: "include",
});

const request = async (method, url, data, headers) => {
  try {
    const response = await api.request({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: (url, headers) => request("get", url, null, headers),
  post: (url, data, headers) => request("post", url, data, headers),
  patch: (url, data, headers) => request("patch", url, data, headers),
  delete: (url, headers) => request("delete", url, null, headers),
};
