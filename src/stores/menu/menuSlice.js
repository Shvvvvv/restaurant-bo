import { doDelete, get, post, postFormData, putFormData } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listMenu: [],
  paging: {
    search_key: "",
    pages: 1,
    limit: 10,
    count: 0,
    sort_key: "id_menu",
    sort_by: "desc",
  },
  loading: false,
  loadingCreate: false,
  loadingCommon: false,
  error: null,
  errorCreate: null,
  message: null,
  successDelete: null,
  menu: null,
  menuSales: null,
  loadingMenu: false,
  errorMenu: null,
  messageMenu: null,
  listMenuSales: [],
  totalHargaMenu: 0,
};

export const getListMenu = get("GET_LIST_MENU", "menu/list-filter");
export const createMenu = postFormData("CREATE_MENU", "menu/create");
export const deleteMenu = doDelete("DELETE_MENU", "menu/delete");
export const getMenu = get("GET_MENU_BY_ID", "menu/menu-by-id");
export const updateMenu = putFormData("EDIT_MENU", "menu/update");
export const getResourceMenu = get("GET_RESOURCE_MENU", "menu/resource");
export const addMenuSales = post("CREATE_MENU_SALES", "penjualan-menu/update");
export const getListMenuSales = get(
  "GET_LIST_MENU_SALES",
  "penjualan-menu/list-filter",
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearMenu: (state) => {
      state.menu = null;
    },
    clearErrorCreate: (state) => {
      state.errorCreate = null;
    },
    setPage: (state, action) => {
      state.paging.pages = action.payload;
    },
    resetPaging: (state) => {
      state.paging = {
        pages: 1,
        limit: 10,
        count: 0,
        sort_key: "id_menu",
        sort_by: "desc",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListMenu.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.listMenu = res.data.list;
        state.paging = { ...state.paging, ...res.data.meta_data };
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(createMenu.pending, (state) => {
      state.loadingCreate = true;
      state.errorCreate = null;
    });
    builder.addCase(createMenu.fulfilled, (state, action) => {
      state.loadingCreate = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.errorCreate = null;
      } else {
        state.errorCreate = res.message;
      }
    });
    builder.addCase(createMenu.rejected, (state, action) => {
      state.loadingCreate = false;
      state.errorCreate = action.payload.message;
    });
    builder.addCase(updateMenu.pending, (state) => {
      state.loadingCreate = true;
      state.errorCreate = null;
    });
    builder.addCase(updateMenu.fulfilled, (state, action) => {
      state.loadingCreate = false;
      const res = action.payload;
      if (res.status) {
        state.message = res.message;
        state.errorCreate = null;
      } else {
        state.errorCreate = res.message;
      }
    });
    builder.addCase(updateMenu.rejected, (state, action) => {
      state.loadingCreate = false;
      state.errorCreate = action.payload.message;
    });
    builder.addCase(deleteMenu.pending, (state) => {
      state.loadingCommon = true;
      state.errorCreate = null;
    });
    builder.addCase(deleteMenu.fulfilled, (state, action) => {
      state.loadingCommon = false;
      const res = action.payload;
      if (res.status) {
        state.successDelete = res.message;
        state.errorCreate = null;
      } else {
        state.errorCreate = res.message;
      }
    });
    builder.addCase(deleteMenu.rejected, (state, action) => {
      state.loadingCommon = false;
      state.errorCreate = action.payload.message;
    });
    builder.addCase(getMenu.pending, (state) => {
      state.loadingCommon = true;
      state.errorCreate = null;
    });
    builder.addCase(getMenu.fulfilled, (state, action) => {
      state.loadingCommon = false;
      const res = action.payload;
      if (res.status) {
        state.menu = res.data;
        state.errorCreate = null;
      } else {
        state.errorCreate = res.message;
      }
    });
    builder.addCase(getMenu.rejected, (state, action) => {
      state.loadingCommon = false;
      state.errorCreate = action.payload.message;
    });
    builder.addCase(addMenuSales.pending, (state) => {
      state.loadingMenu = true;
      state.errorMenu = null;
    });
    builder.addCase(addMenuSales.fulfilled, (state, action) => {
      state.loadingMenu = false;
      const res = action.payload;
      if (res.status) {
        state.menuSales = res.data;
        state.messageMenu = res.message;
        state.errorMenu = null;
      } else {
        state.errorMenu = res.message;
      }
    });
    builder.addCase(addMenuSales.rejected, (state, action) => {
      state.loadingMenu = false;
      state.errorMenu = action.payload.message;
    });

    //list menu sales
    builder.addCase(getListMenuSales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListMenuSales.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.listMenuSales = res.data.list;
        state.totalHargaMenu = res.data.total_keseluruhan;
        state.message = res.message;
        state.error = null;
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(getListMenuSales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const {
  clearMessage,
  setPage,
  resetPaging,
  clearMenu,
  clearErrorCreate,
} = menuSlice.actions;
export default menuSlice.reducer;
