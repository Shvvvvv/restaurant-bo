import {
  doDelete,
  get,
  getBlob,
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
  messageSuccess: null,
  messageSuccessFinished: null,
  visit: null,
  visitCreated: null,
  listMenuSales: null,
};

export const getVisit = get("GET_VISIT", "kunjungan/kunjungan-by-id");
export const getListVisit = get("GET_LIST_VISIT", "kunjungan/list-filter");
export const addVisit = post("CREATE_VISIT", "kunjungan/registrasi");
export const sales = post("SALES", "penjualan/create");
export const visitPayment = put("VISIT_PAYMENT", "kunjungan/bayar-kunjungan");
export const bookingPayment = put(
  "BOOKING_PAYMENT",
  "kunjungan/bayar-kunjungan-booking",
);
export const finishedVisit = put(
  "FINISHED_VISIT",
  "kunjungan/selesai-kunjungan",
);
export const cancelVisit = put("CANCEL_VISIT", "kunjungan/batal-kunjungan");
export const printBill = getBlob("PRINT_BILL", "kunjungan/cetak-tagihan");
export const addBooking = post("CREATE_BOOKING", "kunjungan/booking");
export const updateBooking = put("UPDATE_BOOKING", "kunjungan/update-boooking");
export const bookingToRegistrasi = put(
  "BOOKING_TO_REGISTRASI",
  "kunjungan/booking-to-registrasi",
);

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
    clearMessageSuccess: (state) => {
      state.messageSuccess = null;
    },
    clearMessageSuccessFinished: (state) => {
      state.messageSuccessFinished = null;
    },
    clearVisit: (state) => {
      state.visit = null;
    },
    clearVisitCreated: (state) => {
      state.visitCreated = null;
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

    //add booking
    builder.addCase(addBooking.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addBooking.fulfilled, (state, action) => {
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
    builder.addCase(addBooking.rejected, (state, action) => {
      state.loadingSingle = false;
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

    //visit payment
    builder.addCase(visitPayment.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(visitPayment.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.messageSuccess = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(visitPayment.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //booking payment
    builder.addCase(bookingPayment.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(bookingPayment.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.messageSuccess = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(bookingPayment.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //finished visit
    builder.addCase(finishedVisit.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(finishedVisit.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        console.log(res.message);
        state.messageSuccessFinished = res.message;
        console.log(state.messageSuccessFinished);
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(finishedVisit.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });
  },
});

export const {
  clearPaging,
  clearError,
  clearMessage,
  clearVisit,
  setPage,
  clearVisitCreated,
  clearMessageSuccess,
  clearMessageSuccessFinished,
} = visitSlice.actions;
export default visitSlice.reducer;
