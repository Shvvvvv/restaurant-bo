import { doDelete, get, postFormData, putFormData } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listPayment: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_metode_pembayaran",
    sort_by: "desc",
  },
  loading: false,
  loadingSingle: false,
  loadingTable: false,
  error: null,
  message: null,
  payment: null,
};

export const getPayment = get(
  "GET_PAYMENT",
  "metode-pembayaran/metode-pembayaran-by-id",
);
export const getListPayment = get(
  "GET_LIST_PAYMENT",
  "metode-pembayaran/list-filter",
);
export const addPayment = postFormData(
  "CREATE_PAYMENT",
  "metode-pembayaran/create",
);
export const updatePayment = putFormData(
  "EDIT_PAYMENT",
  "metode-pembayaran/update",
);
export const removePayment = doDelete(
  "DELETE_PAYMENT",
  "metode-pembayaran/delete",
);

const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_metode_pembayaran",
        sort_by: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearPayment: (state) => {
      state.payment = null;
    },
    setPage: (state, page) => {
      state.paging.pages = page;
    },
  },
  extraReducers: (builder) => {
    //get list payment
    builder.addCase(getListPayment.pending, (state) => {
      state.loadingTable = true;
      state.error = null;
    });
    builder.addCase(getListPayment.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listPayment = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListPayment.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get payment
    builder.addCase(getPayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPayment.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.payment = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add payment
    builder.addCase(addPayment.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addPayment.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addPayment.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //update payment
    builder.addCase(updatePayment.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(updatePayment.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updatePayment.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //remove payment
    builder.addCase(removePayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removePayment.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { clearPaging, clearError, clearMessage, clearPayment, setPage } =
  paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
