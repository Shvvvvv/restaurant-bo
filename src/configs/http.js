import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "./axios-config";

export const post = (type, url) => {
  const create = createAsyncThunk(type, async (body, { rejectWithValue }) => {
    try {
      const res = await instance.post(url, body);

      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const postFormData = (type, url) => {
  const create = createAsyncThunk(type, async (body, { rejectWithValue }) => {
    const formData = new FormData();
    Object.keys(body).map((val) => {
      formData.append(val, body[val]);
    });
    try {
      const res = await instance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const get = (type, url) => {
  const create = createAsyncThunk(type, async (params, { rejectWithValue }) => {
    try {
      let param = "";
      let query = "";
      if (params.param) {
        param = "/" + params.param;
      }
      if (params.query) {
        query = "?" + new URLSearchParams(params.query).toString();
      }
      const res = await instance.get(`${url}${param}${query}`);
      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const getBlob = (type, url) => {
  const create = createAsyncThunk(type, async (params, { rejectWithValue }) => {
    try {
      let param = "";
      let query = "";
      if (params.param) {
        param = "/" + params.param;
      }
      if (params.query) {
        query = "?" + new URLSearchParams(params.query).toString();
      }

      const res = await instance.get(`${url}${param}${query}`, {
        responseType: "blob",
      });
      return res;
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const put = (type, url) => {
  const create = createAsyncThunk(type, async (body, { rejectWithValue }) => {
    try {
      const res = await instance.put(url, body);

      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const putFormData = (type, url) => {
  const create = createAsyncThunk(type, async (body, { rejectWithValue }) => {
    const formData = new FormData();
    Object.keys(body).map((val) => {
      formData.append(val, body[val]);
    });
    try {
      const res = await instance.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};

export const doDelete = (type, url) => {
  const create = createAsyncThunk(type, async (body, { rejectWithValue }) => {
    try {
      const res = await instance.delete(url, {
        data: body,
      });
      return {
        data: res.data,
        message: res.meta_data.message,
        status: res.meta_data.status < 400,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.meta_data,
              data: err.response.data,
            }
          : null,
      });
    }
  });
  return create;
};
