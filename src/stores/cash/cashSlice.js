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
  listCash: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_kas",
    sort_by: "desc",
  },
  pagingHistoryCash: {
    pages: 1,
    limit: 5,
    count: 0,
  },
  loading: false,
  loadingTable: false,
  loadingSingle: false,
  error: null,
  message: null,
  cash: null,
  listHistory: [],
  summaryCash: null,
  messageAdjustmant: null,
  messageMutationCash: null,
};

export const getCash = get("GET_CASH", "kas/kas-by-id");
export const getListCash = get("GET_LIST_CASH", "kas/list-filter");
export const addCash = post("CREATE_CASH", "kas/create");
export const updateCash = put("EDIT_CASH", "kas/update");
export const removeCash = doDelete("DELETE_CASH", "kas/delete");
export const getHistoryCash = get(
  "GET_HISTORY_CASH",
  "histori-kas/list-histori-by-kas",
);
export const getSummaryCash = get(
  "GET_SUMMARY_KAS",
  "histori-kas/list-summary-kas",
);
export const addAdjustment = post("CREATE_ADJUSTMENT", "adjustment-kas/create");
export const addMutationCash = post(
  "CREATE_MUTATION_CASH",
  "mutasi-kas/create",
);

const cashSlice = createSlice({
  name: "cash",
  initialState,
  reducers: {
    clearPaging: (state) => {
      state.paging = {
        search_key: "",
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_kas",
        sort_by: "desc",
      };
    },
    clearPagingHistoryCash: (state) => {
      state.pagingHistoryCash = {
        pages: 1,
        limit: 5,
        count: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearCash: (state) => {
      state.cash = null;
    },
    clearMessageAdjustment: (state) => {
      state.messageAdjustmant = null;
    },
    clearMessageMutationCash: (state) => {
      state.messageMutationCash = null;
    },
    setPage: (state, action) => {
      state.pagingHistoryCash.pages = action.payload;
    },
  },
  extraReducers: (builder) => {
    //get list cash
    builder.addCase(getListCash.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListCash.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.listCash = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListCash.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //get cash
    builder.addCase(getCash.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCash.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.cash = res.data.list;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getCash.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //add cash
    builder.addCase(addCash.pending, (state) => {
      state.loadingSingle = true;
      state.error = null;
    });
    builder.addCase(addCash.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(addCash.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //update cash
    builder.addCase(updateCash.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCash.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(updateCash.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //remove cash
    builder.addCase(removeCash.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeCash.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(removeCash.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //get list histori kas
    builder.addCase(getHistoryCash.pending, (state) => {
      state.loadingTable = true;
      state.error = null;
    });

    builder.addCase(getHistoryCash.fulfilled, (state, action) => {
      state.loadingTable = false;
      const res = action.payload;
      if (res.status) {
        state.listHistory = res.data.list;
        state.pagingHistoryCash = {
          ...state.pagingHistoryCash,
          ...res.data.meta_data,
        };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });

    builder.addCase(getHistoryCash.rejected, (state, action) => {
      state.loadingTable = false;
      state.error = action.payload.message;
    });

    //get summary kas
    builder.addCase(getSummaryCash.pending, (state) => {
      state.loadingSingle = true;
      state.error = false;
    });

    builder.addCase(getSummaryCash.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.summaryCash = res.data;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });

    builder.addCase(getSummaryCash.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //create adjustment
    builder.addCase(addAdjustment.pending, (state) => {
      state.loadingSingle = true;
      state.error = false;
    });

    builder.addCase(addAdjustment.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.messageAdjustmant = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });

    builder.addCase(addAdjustment.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });

    //create mutation cash
    builder.addCase(addMutationCash.pending, (state) => {
      state.loadingSingle = true;
      state.error = false;
    });

    builder.addCase(addMutationCash.fulfilled, (state, action) => {
      state.loadingSingle = false;
      const res = action.payload;
      if (res.status) {
        state.messageMutationCash = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });

    builder.addCase(addMutationCash.rejected, (state, action) => {
      state.loadingSingle = false;
      state.error = action.payload.message;
    });
  },
});

export const {
  clearPaging,
  clearError,
  clearMessage,
  clearCash,
  clearMessageAdjustment,
  clearMessageMutationCash,
  setPage,
  clearPagingHistoryCash,
} = cashSlice.actions;
export default cashSlice.reducer;
