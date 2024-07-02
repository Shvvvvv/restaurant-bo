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
  listTax: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_pajak",
    sort_by: "desc",
  },
  loading: false,
  loadingTable: false,
  loadingSingle: false,
  error: null,
  message: null,
  tax: null,
};

export const getTax = get("GET_TAX", "pajak/pajak-by-id");
export const getListTax = get("GET_LIST_TAX", "pajak/list-filter");
export const addTax = post("CREATE_TAX", "pajak/create");
export const updateTax = put("EDIT_TAX", "pajak/update");
export const removeTax = doDelete("DELETE_TAX", "pajak/delete");

const taxSlice = createSlice({
  name: "tax",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_pajak",
        sort_by: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearTax: (state) => {
      state.tax = null;
    },
    setPage: (state, page) => {
      state.paging.pages = page;
    },
  },
  extraReducers: (builder) => {
    //get list tax
    builder.addCase(getListTax.pending, (state) => {
      state.loadingTable = true;
      state.error = null;
    });
    builder.addCase(getListTax.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listTax = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListTax.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get tax
    builder.addCase(getTax.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTax.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.tax = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getTax.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add tax
    builder.addCase(addTax.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addTax.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addTax.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //update tax
    builder.addCase(updateTax.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(updateTax.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updateTax.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //remove tax
    builder.addCase(removeTax.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeTax.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removeTax.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { clearPaging, clearError, clearMessage, clearTax, setPage } =
  taxSlice.actions;
export default taxSlice.reducer;
