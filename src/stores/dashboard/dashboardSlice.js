import { get } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalExpenditure: null,
  totalBalance: null,
  totalIncome: null,
  totalVisits: null,
  loadingDashboard: false,
  messageDashboard: null,
  errorDashboard: null,
};

export const getDataDashboard = get(
  "GET_DATA_DASHBOARD",
  "penjualan/list-dashboard",
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDataDashboard.pending, (state) => {
      state.loadingDashboard = true;
      state.errorDashboard = null;
    });
    builder.addCase(getDataDashboard.fulfilled, (state, action) => {
      state.loadingDashboard = false;
      const res = action.payload;
      if (res.status) {
        state.totalBalance = res.data.total_saldo;
        state.totalExpenditure = res.data.total_pengeluaran;
        state.totalIncome = res.data.total_pemasukan;
        state.totalVisits = res.data.total_kunjungan;
        state.messageDashboard = res.message;
      } else {
        state.errorDashboard = res.message;
      }
    });
    builder.addCase(getDataDashboard.rejected, (state, action) => {
      state.loadingDashboard = false;
      state.errorDashboard = action.payload.message;
    });
  },
});

export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
