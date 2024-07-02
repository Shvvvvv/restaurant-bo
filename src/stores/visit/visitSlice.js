import { doDelete, get, postFormData, putFormData } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listVisit: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_metode_pembayaran",
    sort_by: "desc",
  },
  loading: false,
  loadingTable: false,
  error: null,
  message: null,
  visit: null,
};

const getVisit = get("GET_VISIT", "kunjungan/kunjungan-by-id");
const getListVisit = get("GET_LIST_VISIT", "kunjungan/list-filter");
const addVisit = postFormData("CREATE_VISIT", "kunjungan/create");
const updateVisit = putFormData("EDIT_VISIT", "kunjungan/update");
const removeVisit = doDelete("DELETE_VISIT", "kunjungan/delete");

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
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
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVisit.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.visit = res.data.list;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getVisit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add visit
    builder.addCase(addVisit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addVisit.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addVisit.rejected, (state, action) => {
      state.loading = false;
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
  },
});

export const { clearPaging, clearError, clearMessage, clearVisit } =
  visitSlice.actions;
export default visitSlice.reducer;
