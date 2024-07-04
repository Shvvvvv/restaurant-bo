import { currencyFormat } from "@/configs/currency";
import swall from "@/configs/sweetalert";
import {
  clearErrorCreate,
  clearMenu,
  clearMessage,
  createMenu,
  deleteMenu,
  getListMenu,
  getMenu,
  resetPaging,
  setPage,
  updateMenu,
} from "@/stores/menu/menuSlice";
import { Loading } from "@/widgets/loading";
import Tables from "@/widgets/tables/tables";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Select,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Option,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";

export function Menu() {
  const {
    listMenu,
    paging,
    loading,
    error,
    loadingCreate,
    loadingCommon,
    errorCreate,
    message,
    successDelete,
    menu,
  } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [isOpenModalAddMenu, setIsOpenModalAddMenu] = useState(false);
  const [titleModalMenu, setTitleModalMenu] = useState("Tambah Menu");
  const [filterMenu, setFilterMenu] = useState({
    search_key: "",
    kategori: "",
  });
  const [payloadAddMenu, setPayloadAddMenu] = useState({
    nama_menu: "",
    gambar: "",
    harga: 0,
    kategori: "",
  });
  const [image, setImage] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const columnMenu = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "gambar",
      label: "Gambar",
    },
    {
      key: "nama_menu",
      label: "Nama Menu",
    },
    {
      key: "harga",
      label: "Harga",
    },
    {
      key: "createdName",
      label: "Created Name",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "action",
      label: "Action",
    },
  ];
  const childrenTable = {
    gambar: (data) => {
      return (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${data?.gambar}`}
          alt={data?.nama_menu}
          className="w-[1.9rem] h-[1.9rem]"
        />
      );
    },
    action: (data) => {
      return (
        <div className="w-full flex gap-4">
          <IconButton
            size="sm"
            variant="filled"
            color="blue"
            onClick={() =>
              dispatch(
                getMenu({
                  query: {
                    id_menu: data.id_menu,
                  },
                }),
              )
            }
          >
            <PencilIcon
              strokeWidth={3}
              fill="currentColor"
              className="h-5 w-5"
            />
          </IconButton>
          <IconButton
            size="sm"
            variant="filled"
            color="red"
            onClick={() => removeMenu(data?.id_menu)}
          >
            <TrashIcon
              strokeWidth={3}
              fill="currentColor"
              className="h-5 w-5"
            />
          </IconButton>
        </div>
      );
    },
    createdAt: (data) => {
      return (
        <Typography>{dayjs(data.createdAt).format("DD-MM-YYYY")}</Typography>
      );
    },
    harga: (data) => {
      return <Typography>{currencyFormat(data.harga)}</Typography>;
    },
  };

  const clearPayload = () => {
    setPayloadAddMenu({
      nama_menu: "",
      gambar: "",
      harga: 0,
      kategori: "",
    });
  };

  const getData = () => {
    dispatch(
      getListMenu({
        param: "",
        query: {
          ...paging,
          ...filterMenu,
        },
      }),
    );
  };

  const addMenu = () => {
    dispatch(
      createMenu({
        ...payloadAddMenu,
        harga: parseInt(payloadAddMenu.harga),
      }),
    );
  };

  const editMenu = () => {
    let payload = null;
    if (payloadAddMenu.gambar?.type?.startsWith("image/")) {
      payload = Object.assign({
        ...payloadAddMenu,
        harga: parseInt(payloadAddMenu.harga),
        id_menu: menu.id_menu,
      });
    } else {
      payload = Object.assign({
        id_menu: menu.id_menu,
        nama_menu: payloadAddMenu.nama_menu,
        harga: parseInt(payloadAddMenu.harga),
        kategori: payloadAddMenu.kategori,
      });
    }
    dispatch(updateMenu(payload));
  };

  const removeMenu = (id) => {
    dispatch(
      deleteMenu({
        id_menu: id,
      }),
    );
  };

  const readerFileImage = (file) => {
    const reader = new FileReader(file);
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onChangePage = (page) => {
    dispatch(setPage(page));
  };

  useEffect(() => {
    getData();
    return () => {
      dispatch(resetPaging());
    };
  }, []);

  useEffect(() => {
    getData();
  }, [paging.pages, filterMenu.kategori]);

  useEffect(() => {
    if (message) {
      setIsOpenModalAddMenu(!isOpenModalAddMenu);
      swall("success", "Berhasil", message, false, () => {
        dispatch(clearMessage());
        dispatch(clearMenu());
        clearPayload();
        getData();
      });
    }
    if (errorCreate) {
      swall("error", "Gagal", errorCreate, false, () => {
        dispatch(clearMenu());
      });
    }
    if (successDelete) {
      swall("success", "Berhasil", successDelete, false, () => {
        getData();
      });
    }
    if (menu && !errorCreate && !message) {
      setPayloadAddMenu({
        nama_menu: menu.nama_menu,
        harga: menu.harga,
        kategori: menu.kategori,
        gambar: menu.gambar,
      });
      setTitleModalMenu("Edit Menu");
      setIsOpenModalAddMenu(!isOpenModalAddMenu);
    }
    if (error) {
      swall("error", "Error", error, false);
    }
  }, [errorCreate, message, successDelete, menu, error]);

  useEffect(() => {
    if (payloadAddMenu.gambar?.type?.startsWith("image/")) {
      readerFileImage(payloadAddMenu.gambar);
    } else {
      setImage(
        `${import.meta.env.VITE_BASE_URL_IMAGE}/${payloadAddMenu.gambar}`,
      );
    }
  }, [payloadAddMenu.gambar]);

  return (
    <>
      <Loading isShow={loadingCommon} />
      <Dialog size="xs" open={isOpenModalAddMenu}>
        <DialogHeader>{titleModalMenu}</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            {titleModalMenu == "Edit Menu" && (
              <div className="relative w-full h-40">
                <img src={image} alt="gambar-menu" className="w-full h-full" />
                <label
                  htmlFor="gambar-menu"
                  role="button"
                  className="absolute bottom-2 right-2 border-2 border-blue-gray-400 p-2 rounded-md"
                >
                  <PencilIcon className="h-5 w-5" />
                </label>
              </div>
            )}
            <Input
              label="Nama Menu"
              className="w-full"
              value={payloadAddMenu.nama_menu}
              onChange={(e) =>
                setPayloadAddMenu({
                  ...payloadAddMenu,
                  nama_menu: e.target.value,
                })
              }
            />
            <div className="flex w-full gap-4">
              <span className="flex items-center justify-center">
                <Typography variant="h5">Rp</Typography>
              </span>
              <CurrencyInput
                className="flex-grow w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                id="harga-menu"
                name="harga-menu"
                placeholder="Harga Menu"
                defaultValue={payloadAddMenu.harga}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setPayloadAddMenu({ ...payloadAddMenu, harga: value })
                }
              />
            </div>
            {titleModalMenu == "Tambah Menu" && (
              <div className="flex w-full border border-gray-400 rounded-[7px] px-3 py-2.5 text-sm">
                <input
                  className="bg-transparent border border-transparent flex-grow"
                  placeholder="Upload file here"
                  disabled
                  value={payloadAddMenu.gambar?.name}
                />
                <label role="button" for="gambar-menu">
                  Browse
                </label>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setPayloadAddMenu({
                  ...payloadAddMenu,
                  gambar: e.target.files[0],
                })
              }
              id="gambar-menu"
            />
            <div className="min-w-[200px] w-full">
              <Select
                id="kategori-makanan-add"
                label="Kategori"
                value={payloadAddMenu.kategori}
                onChange={(val) => {
                  setPayloadAddMenu({
                    ...payloadAddMenu,
                    kategori: val,
                  });
                }}
              >
                <Option value="">
                  <em>None</em>
                </Option>
                <Option value="makanan">Makanan</Option>
                <Option value="minuman">Minuman</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              color="red"
              onClick={() => {
                clearPayload();
                dispatch(clearMenu());
                setIsOpenModalAddMenu(!isOpenModalAddMenu);
              }}
            >
              Batal
            </Button>
            <Button
              color="green"
              disabled={loadingCreate}
              onClick={() => {
                if (titleModalMenu == "Tambah Menu") {
                  addMenu();
                } else {
                  editMenu();
                }
              }}
            >
              {loadingCreate ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <div className="md:mt-12 mt-6">
        <div className="mb-10 flex justify-between md:flex-auto flex-wrap gap-2">
          <div className="min-w-[200px] md:w-72 w-full">
            <Select
              id="kategori-makanan"
              label="Kategori"
              className="bg-white"
              onChange={(e) =>
                setFilterMenu({
                  ...filterMenu,
                  kategori: e,
                })
              }
            >
              <Option value="">
                <em>None</em>
              </Option>
              <Option value="makanan">Makanan</Option>
              <Option value="minuman">Minuman</Option>
            </Select>
          </div>
          <div className="flex gap-4">
            <div>
              <Input
                onChange={(e) =>
                  setFilterMenu({
                    ...filterMenu,
                    search_key: e.target.value,
                  })
                }
                onKeyUp={(e) => (e.key == "Enter" ? getData() : null)}
                className="bg-white py-2 px-4"
                label="Cari"
                size="md"
                icon={<MagnifyingGlassIcon />}
              />
            </div>
            <Button
              onClick={() => {
                setIsOpenModalAddMenu(!isOpenModalAddMenu);
                setTitleModalMenu("Tambah Menu");
              }}
              className="py-2 px-4"
              color="green"
            >
              Tambah Menu
            </Button>
          </div>
        </div>
        <Tables
          columns={columnMenu}
          datas={listMenu}
          changePage={onChangePage}
          isLoading={loading}
          paging={paging}
          children={childrenTable}
          active={activePage}
          setActive={setActivePage}
        />
      </div>
    </>
  );
}

export default Menu;
