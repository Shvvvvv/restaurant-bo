import { convertToTitleCase } from "@/configs/capitalizer";
import swall from "@/configs/sweetalert";
import { pagingDummy, taxData } from "@/data/dummy";
import {
  addTax,
  clearMessage,
  clearPaging,
  clearTax,
  getListTax,
  getTax,
  removeTax,
  setPage,
  updateTax,
} from "@/stores/tax/taxSlice";
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
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function Tax() {
  const dispatch = useDispatch();
  const {
    listTax,
    paging,
    loading,
    loadingTable,
    loadingSingle,
    error,
    message,
    tax,
  } = useSelector((state) => state.tax);
  const column = [
    { key: "no", label: "No." },
    { key: "nama_pajak", label: "Nama Pajak" },
    { key: "pajak_persen", label: "Pajak Persen" },
    { key: "keterangan", label: "Keterangan" },
    { key: "createdName", label: "Created Name" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "Action" },
  ];
  const [filterTax, setFilterTax] = useState({
    search_key: "",
  });
  const [payloadTax, setPayloadTax] = useState({
    nama_pajak: "",
    pajak_persen: "",
    keterangan: "",
  });
  const [isOpenModal, setIsOpenModal] = useState(false);

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
                getTax({
                  query: {
                    id_pajak: data.id_pajak,
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
            onClick={() => deleteTax(data?.id_pajak)}
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
    pajak_persen: (data) => {
      return <Typography>{data.pajak_persen}%</Typography>;
    },
  };
  const onChangePage = (noPage) => {
    dispatch(setPage(noPage));
  };

  const getData = () => {
    dispatch(
      getListTax({
        query: {
          ...paging,
          ...filterTax,
        },
      }),
    );
  };

  const clearPayloadTax = () => {
    setPayloadTax({
      nama_pajak: "",
      pajak_persen: "",
      keterangan: "",
    });
  };

  const createTax = () => {
    let err = null;
    Object.keys(payloadTax).map((key) => {
      if (!payloadTax[key]) err = key;
    });
    if (err) {
      swall("error", "Error", `${convertToTitleCase(err)} tidak boleh kosong`);
      return;
    }
    if (!tax) {
      dispatch(
        addTax({
          ...payloadTax,
          pajak_persen: parseInt(payloadTax.pajak_persen),
        }),
      );
    } else {
      dispatch(
        updateTax({
          ...payloadTax,
          id_pajak: tax.id_pajak,
          pajak_persen: parseInt(payloadTax.pajak_persen),
        }),
      );
    }
  };

  const deleteTax = (id) => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin untuk menghapus?",
      true,
      (result) => {
        if (result.isConfirmed) {
          dispatch(
            removeTax({
              id_pajak: id,
            }),
          );
        }
      },
    );
  };

  const closeFormTax = () => {
    clearPayloadTax();
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
  }, [paging.pages]);

  useEffect(() => {
    if (message) {
      swall("success", "Berhasil", message, false, () => {
        if (tax) {
          dispatch(clearTax());
        }
        dispatch(clearMessage());
        clearPayloadTax();
        setIsOpenModal(false);
        getData();
      });
    }
    if (error) {
      swall("error", "Gagal", error, false);
    }
    if (tax && !error && !message) {
      setPayloadTax({
        nama_pajak: tax.nama_pajak,
        pajak_persen: tax.pajak_persen,
        keterangan: tax.keterangan,
      });
      setIsOpenModal(true);
    }
  }, [message, error, tax]);

  return (
    <ContainerPage>
      <Loading isShow={loading} />
      <Dialog size="xs" open={isOpenModal}>
        <DialogHeader>Form Pajak</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            <Input
              label="Nama Pajak"
              className="w-full"
              value={payloadTax.nama_pajak}
              onChange={(e) =>
                setPayloadTax({
                  ...payloadTax,
                  nama_pajak: e.target.value,
                })
              }
            />
            <Input
              label="Pajak Persen"
              type="number"
              className="w-full"
              value={payloadTax.pajak_persen}
              onChange={(e) =>
                setPayloadTax({
                  ...payloadTax,
                  pajak_persen: e.target.value,
                })
              }
            />
            <Textarea
              label="Keterangan"
              value={payloadTax.keterangan}
              onChange={(e) =>
                setPayloadTax({
                  ...payloadTax,
                  keterangan: e.target.value,
                })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button color="red" onClick={() => closeFormTax()}>
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => createTax()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <div className="mb-10 flex justify-between md:flex-auto flex-wrap gap-2">
        <div className="min-w-[200px] md:w-72 w-full"></div>
        <div className="flex gap-4">
          <div>
            <Input
              className="bg-white py-2 px-4"
              label="Cari"
              size="md"
              icon={<MagnifyingGlassIcon />}
              onChange={(e) =>
                setFilterTax({
                  search_key: e.target.value,
                })
              }
              onKeyUp={(e) => (e.key === "Enter" ? getData() : null)}
            />
          </div>
          <Button
            className="py-2 px-4"
            color="green"
            onClick={() => setIsOpenModal(true)}
          >
            Tambah Pajak
          </Button>
        </div>
      </div>
      <Tables
        columns={column}
        datas={listTax}
        changePage={onChangePage}
        isLoading={loadingTable}
        paging={paging}
        children={children}
      />
    </ContainerPage>
  );
}

export default Tax;
