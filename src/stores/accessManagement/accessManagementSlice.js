import {
  doDelete,
  get,
  post,
  postFormData,
  put,
  putFormData,
} from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listUser: [],
  paging: {
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_user",
    sort_by: "desc",
  },
  loadingUser: false,
  loadingUser2: false,
  errorUser: null,
  messageUser: null,
  user: null,
};

export const getUser = get("GET_USER", "users/users-by-id");
export const getListUser = get("GET_LIST_USER", "users/list-filter");
export const addUser = post("CREATE_USER", "users/create");
export const updateUser = putFormData("EDIT_USER", "users/update");
export const removeUser = doDelete("DELETE_USER", "users/delete");
export const changePassword = put(
  "CHANGE_PASSWORD_USER",
  "users/ubah-password",
);

const accessManagementSlice = createSlice({
  name: "accessManagement",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_user",
        sort_by: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    //get list User
    builder.addCase(getListUser.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    });
    builder.addCase(getListUser.fulfilled, (state, action) => {
      state.loadingUser = false;
      const res = action.payload;
      if (res.status) {
        state.listUser = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.errorUser = null;
      } else {
        state.errorUser = res.message;
      }
    });
    builder.addCase(getListUser.rejected, (state, action) => {
      state.loadingUser = false;
      state.errorUser = action.payload.message;
    });

    //get User
    builder.addCase(getUser.pending, (state) => {
      state.loadingUser2 = true;
      state.errorUser = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loadingUser2 = false;
      const res = action.payload;
      if (res.status) {
        state.user = res.data;
        state.errorUser = null;
      } else {
        state.errorUser = res.message;
      }
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loadingUser2 = false;
      state.errorUser = action.payload.message;
    });

    //add User
    builder.addCase(addUser.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.loadingUser = false;
      const res = action.payload;
      if (res.status) {
        state.messageUser = res.message;
        state.errorUser = null;
      } else {
        state.errorUser = res.message;
      }
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.loadingUser = false;
      state.errorUser = action.payload.message;
    });

    //update User
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //remove User
    builder.addCase(removeUser.pending, (state) => {
      state.loadingUser2 = true;
      state.errorUser = null;
    });
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.loadingUser2 = false;
      const res = action.payload;
      if (res.status) {
        state.messageUser = res.message;
        state.errorUser = null;
      } else {
        state.errorUser = res.message;
      }
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.loadingUser2 = false;
      state.errorUser = action.payload.message;
    });

    //change password user
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { clearPaging, clearError, clearMessage, clearUser } =
  accessManagementSlice.actions;
export default accessManagementSlice.reducer;
