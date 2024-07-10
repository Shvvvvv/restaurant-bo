import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import menuSlice from "./menu/menuSlice";
import accessManagementSlice from "./accessManagement/accessManagementSlice";
import cashSlice from "./cash/cashSlice";
import diningTableSlice from "./diningTable/diningTableSlice";
import paymentMethodSlice from "./paymentMethod/paymentMethodSlice";
import taxSlice from "./tax/taxSlice";
import visitSlice from "./visit/visitSlice";
import dashboardSlice from "./dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    menu: menuSlice,
    accessManagement: accessManagementSlice,
    cash: cashSlice,
    diningTable: diningTableSlice,
    paymentMethod: paymentMethodSlice,
    tax: taxSlice,
    visit: visitSlice,
    dashboard: dashboardSlice,
  },
});
