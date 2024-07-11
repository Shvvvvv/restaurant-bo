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
  listVisit: [],
  paging: {
    pages: 1,
    limit: 5,
    count: 0,
    sort_key: "id_kunjungan",
    sort_by: "desc",
  },
  loadingVisit: false,
  loadingSingle: false,
  loadingTable: false,
  error: null,
  message: null,
  visit: null,
  visitCreated: null,
  listMenuSales: null,
};

export const getVisit = get("GET_VISIT", "kunjungan/kunjungan-by-id");
export const getListVisit = get("GET_LIST_VISIT", "kunjungan/list-filter");
export const addVisit = post("CREATE_VISIT", "kunjungan/registrasi");
export const updateVisit = put("EDIT_VISIT", "kunjungan/update");
export const removeVisit = doDelete("DELETE_VISIT", "kunjungan/delete");
export const sales = post("SALES", "penjualan/create");

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        pages: 1,
        limit: 5,
        count: 0,
        sort_key: "id_kunjungan",
        sort_by: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearVisit: (state) => {
      state.visit = null;
    },
    setPage: (state, action) => {
      state.paging.pages = action.payload;
    },
  },
  extraReducers: (builder) => {
    //get list visit
    builder.addCase(getListVisit.pending, (state) => {
      state.loadingTable = true;
      state.error = null;
    });
    builder.addCase(getListVisit.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listVisit = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListVisit.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get visit
    builder.addCase(getVisit.pending, (state) => {
      state.loadingVisit = true;
      state.error = null;
    });
    builder.addCase(getVisit.fulfilled, (state, action) => {
      state.loadingVisit = false;
      const res = action.payload;
      if (res.status) {
        state.visit = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getVisit.rejected, (state, action) => {
      state.loadingVisit = false;
      state.error = action.payload.message;
    });

    //add visit
    builder.addCase(addVisit.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addVisit.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.visitCreated = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addVisit.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //update visit
    builder.addCase(updateVisit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateVisit.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updateVisit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //remove visit
    builder.addCase(removeVisit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeVisit.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removeVisit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //sales
    builder.addCase(sales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sales.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(sales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { clearPaging, clearError, clearMessage, clearVisit, setPage } =
  visitSlice.actions;
export default visitSlice.reducer;
