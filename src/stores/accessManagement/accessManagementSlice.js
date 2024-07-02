import { doDelete, get, postFormData, put, putFormData } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listUser: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_user",
    sort_by: "desc",
  },
  loading: false,
  loadingTable: false,
  error: null,
  message: null,
  user: null,
};

const getUser = get("GET_USER", "users/users-by-id");
const getListUser = get("GET_LIST_USER", "users/list-filter");
const addUser = postFormData("CREATE_USER", "users/create");
const updateUser = putFormData("EDIT_USER", "users/update");
const removeUser = doDelete("DELETE_USER", "users/delete");
const changePassword = put("CHANGE_PASSWORD_USER", "users/ubah-password");

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
      state.loadingTable = true;
      state.error = null;
    });
    builder.addCase(getListUser.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listUser = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListUser.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get User
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.user = res.data.list;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add User
    builder.addCase(addUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
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
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
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

export const { clearPaging, clearError, clearMessage, clearPaymen } =
  accessManagementSlice.actions;
export default accessManagementSlice.reducer;
