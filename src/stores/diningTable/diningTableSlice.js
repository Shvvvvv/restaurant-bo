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
  listDiningTable: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_meja",
    sort_by: "desc",
  },
  loading: false,
  loadingTable: false,
  loadingSingle: false,
  error: null,
  message: null,
  diningTable: null,
};

export const getDiningTable = get("GET_DINING_TABLE", "meja/meja-by-id");
export const getListDiningTable = get(
  "GET_LIST_DINING_TABLE",
  "meja/list-filter",
);
export const addDiningTable = post("CREATE_DINING_TABLE", "meja/create");
export const updateDiningTable = put("EDIT_DINING_TABLE", "meja/update");
export const removeDiningTable = doDelete("DELETE_DINING_TABLE", "meja/delete");

const diningTableSlice = createSlice({
  name: "diningTable",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_meja",
        sort_by: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearDiningTable: (state) => {
      state.diningTable = null;
    },
    setPage: (state, page) => {
      state.paging.pages = page;
    },
  },
  extraReducers: (builder) => {
    //get list diningTable
    builder.addCase(getListDiningTable.pending, (state) => {
      state.loadingTable = true;
      state.error = null;
    });
    builder.addCase(getListDiningTable.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listDiningTable = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
      console.log("list => ", state.listDiningTable);
    });
    builder.addCase(getListDiningTable.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get diningTable
    builder.addCase(getDiningTable.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDiningTable.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.diningTable = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getDiningTable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add diningTable
    builder.addCase(addDiningTable.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addDiningTable.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addDiningTable.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //update diningTable
    builder.addCase(updateDiningTable.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(updateDiningTable.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updateDiningTable.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //remove diningTable
    builder.addCase(removeDiningTable.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeDiningTable.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removeDiningTable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const {
  clearPaging,
  clearError,
  clearMessage,
  clearDiningTable,
  setPage,
} = diningTableSlice.actions;
export default diningTableSlice.reducer;
