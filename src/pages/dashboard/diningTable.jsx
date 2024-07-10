import { convertToTitleCase } from "@/configs/capitalizer";
import swall from "@/configs/sweetalert";
import {
  addDiningTable,
  clearDiningTable,
  clearMessage,
  clearPaging,
  getDiningTable,
  getListDiningTable,
  removeDiningTable,
  updateDiningTable,
} from "@/stores/diningTable/diningTableSlice";
import { setPage } from "@/stores/menu/menuSlice";
import { ContainerPage } from "@/widgets/container";
import { Loading } from "@/widgets/loading";
import { Tables } from "@/widgets/tables";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  list,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function DiningTable() {
  const dispatch = useDispatch();
  const {
    listDiningTable,
    paging,
    loading,
    loadingTable,
    loadingSingle,
    error,
    message,
    diningTable,
  } = useSelector((state) => state.diningTable);
  const [filterDiningTable, setFilterDiningTable] = useState({
    search_key: "",
    status: "",
  });
  const [payloadDiningTable, setPayloadDiningTable] = useState({
    nama_meja: "",
    nomor: "",
    status: "",
    kapasitas: 0,
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const column = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "nama_meja",
      label: "Nama Meja",
    },
    {
      key: "nomor",
      label: "Nomor Meja",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "kapasitas",
      label: "Kapasitas",
    },
    {
      key: "createdName",
      label: "Create Name",
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
  const children = {
    action: (data) => {
      return (
        <div className="w-full flex gap-4">
          <IconButton
            size="sm"
            variant="filled"
            color="blue"
            onClick={() =>
              dispatch(
                getDiningTable({
                  query: {
                    id_meja: data.id_meja,
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
            onClick={() => deleteDiningTable(data?.id_meja)}
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
    status: (data) => {
      switch (data.status) {
        case 1:
          return (
            <div className="flex gap-2 items-center">
              <span className="rounded-full h-3 w-3 bg-green-600"></span>{" "}
              Tersedia
            </div>
          );
          break;
        case 2:
          return (
            <div className="flex gap-2 items-center">
              <span className="rounded-full h-3 w-3 bg-red-600"></span>{" "}
              Ditempati
            </div>
          );
          break;
        case 3:
          return (
            <div className="flex gap-2 items-center">
              <span className="rounded-full h-3 w-3 bg-orange-600"></span>{" "}
              Dipesan
            </div>
          );
          break;
        default:
      }
    },
  };

  const onChangePage = (page) => {
    dispatch(setPage(page));
  };

  const getData = () => {
    dispatch(
      getListDiningTable({
        query: {
          ...paging,
          ...filterDiningTable,
        },
      }),
    );
  };

  const clearPayloadDiningTable = () => {
    setPayloadDiningTable({
      nama_meja: "",
      nomor: "",
      status: "",
      kapasitas: 0,
    });
  };

  const createDiningTable = () => {
    let err = null;
    Object.keys(payloadDiningTable).map((key) => {
      if (!payloadDiningTable[key]) err = key;
    });
    if (err) {
      swall("error", "Error", `${convertToTitleCase(err)} tidak boleh kosong`);
      return;
    }
    if (!diningTable) {
      dispatch(
        addDiningTable({
          ...payloadDiningTable,
          status: parseInt(payloadDiningTable.status),
          kapasitas: parseInt(payloadDiningTable.kapasitas),
        }),
      );
    } else {
      dispatch(
        updateDiningTable({
          ...payloadDiningTable,
          status: parseInt(payloadDiningTable.status),
          kapasitas: parseInt(payloadDiningTable.kapasitas),
          id_meja: diningTable.id_meja,
        }),
      );
    }
  };

  const deleteDiningTable = (id) => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin untuk menghapus?",
      true,
      (result) => {
        if (result.isConfirmed) {
          dispatch(
            removeDiningTable({
              id_meja: id,
            }),
          );
        }
      },
    );
  };

  const closeFormDiningTable = () => {
    clearPayloadDiningTable();
    if (diningTable) {
      dispatch(clearDiningTable());
    }
    setIsOpenModal(false);
  };

  useEffect(() => {
    getData();
    return () => {
      clearPaging();
    };
  }, []);

  useEffect(() => {
    getData();
  }, [paging.pages, filterDiningTable.status]);

  useEffect(() => {
    if (message) {
      swall("success", "Berhasil", message, false, () => {
        if (diningTable) {
          dispatch(clearDiningTable());
        }
        dispatch(clearMessage());
        clearPayloadDiningTable();
        setIsOpenModal(false);
        getData();
      });
    }
    if (error) {
      swall("error", "Gagal", error, false);
    }
    if (diningTable && !error && !message) {
      setPayloadDiningTable({
        nama_meja: diningTable.nama_meja,
        nomor: diningTable.nomor,
        status: diningTable.status.toString(),
        kapasitas: diningTable.kapasitas,
      });
      setIsOpenModal(true);
    }
  }, [message, error, diningTable]);

  return (
    <ContainerPage>
      <Loading isShow={loading} />
      <Dialog size="xs" open={isOpenModal}>
        <DialogHeader>Form Meja</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            <Input
              label="Nama Meja"
              className="w-full"
              value={payloadDiningTable.nama_meja}
              onChange={(e) =>
                setPayloadDiningTable({
                  ...payloadDiningTable,
                  nama_meja: e.target.value,
                })
              }
            />
            <Input
              label="Nomor Meja"
              className="w-full"
              value={payloadDiningTable.nomor}
              onChange={(e) =>
                setPayloadDiningTable({
                  ...payloadDiningTable,
                  nomor: e.target.value,
                })
              }
            />
            <div className="min-w-[200px] w-full">
              <Select
                disabled={diningTable}
                id="status-meja"
                label="Status"
                value={payloadDiningTable.status}
                onChange={(val) => {
                  setPayloadDiningTable({
                    ...payloadDiningTable,
                    status: val,
                  });
                }}
              >
                <Option value="">
                  <em>None</em>
                </Option>
                <Option value="1">Tersedia</Option>
                <Option value="2">Ditempati</Option>
                <Option value="3">Dipesan</Option>
              </Select>
            </div>
            <Select
              id="kapasitas-meja"
              label="Kapasitas"
              value={payloadDiningTable.kapasitas}
              onChange={(val) => {
                setPayloadDiningTable({
                  ...payloadDiningTable,
                  kapasitas: val,
                });
              }}
            >
              <Option value={2}>2</Option>
              <Option value={4}>4</Option>
              <Option value={8}>8</Option>
              <Option value={12}>12</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button color="red" onClick={() => closeFormDiningTable()}>
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => createDiningTable()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <div className="mb-10 flex justify-between md:flex-auto flex-wrap gap-2">
        <div className="min-w-[200px] md:w-72 w-full">
          <Select
            id="status-meja"
            label="Status Meja"
            className="bg-white"
            onChange={(e) =>
              setFilterDiningTable({
                ...filterDiningTable,
                status: e,
              })
            }
          >
            <Option value="">
              <em>None</em>
            </Option>
            <Option value="1">Tersedia</Option>
            <Option value="2">Ditempati</Option>
            <Option value="3">Dipesan</Option>
          </Select>
        </div>
        <div className="flex gap-4">
          <div>
            <Input
              className="bg-white py-2 px-4"
              label="Cari"
              size="md"
              onChange={(e) =>
                setFilterDiningTable({
                  ...filterDiningTable,
                  search_key: e.target.value,
                })
              }
              onKeyUp={(e) => (e.key === "Enter" ? getData() : null)}
              icon={<MagnifyingGlassIcon />}
            />
          </div>
          <Button
            className="py-2 px-4"
            color="green"
            onClick={() => setIsOpenModal(true)}
          >
            Tambah Meja
          </Button>
        </div>
      </div>
      <Tables
        columns={column}
        datas={listDiningTable}
        changePage={onChangePage}
        isLoading={loadingTable}
        paging={paging}
        children={children}
        active={activePage}
        setActive={setActivePage}
      />
    </ContainerPage>
  );
}

export default DiningTable;
