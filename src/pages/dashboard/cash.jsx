import { convertToTitleCase } from "@/configs/capitalizer";
import { currencyFormat } from "@/configs/currency";
import swall from "@/configs/sweetalert";
import {
  addAdjustment,
  addCash,
  addMutationCash,
  clearMessage,
  clearMessageAdjustment,
  clearMessageMutationCash,
  clearPaging,
  clearPagingHistoryCash,
  getHistoryCash,
  getListCash,
  getSummaryCash,
  removeCash,
  setPage,
  updateCash,
} from "@/stores/cash/cashSlice";
import { ContainerPage } from "@/widgets/container";
import DatePicker from "@/widgets/inputs/datePicker";
import { Loading } from "@/widgets/loading";
import { Tables } from "@/widgets/tables";
import {
  ArrowPathIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";

export function Cash() {
  const dispatch = useDispatch();
  const {
    listCash,
    paging,
    loading,
    loadingSingle,
    loadingTable,
    error,
    message,
    cash,
    listHistory,
    summaryCash,
    pagingHistoryCash,
    messageAdjustmant,
    messageMutationCash,
  } = useSelector((state) => state.cash);
  const [selectedCashResource, setSelectedCashResource] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalFormAdjustment, setIsOpenModalFormAdjustmen] =
    useState(false);
  const [isOpenModalFormMutation, setIsOpenModalFormMutation] = useState(false);
  const [payloadCash, setPayloadCash] = useState({
    nama_kas: "",
    saldo: null,
    status: null,
    color: null,
  });
  const [payloadHistoryCash, setPayloadHistoryCash] = useState({
    id_kas: "",
    tanggal_awal: "",
    tanggal_akhir: "",
  });
  const [payloadFormAdjustment, setPayloadFormAdjustment] = useState({
    jumlah: 0,
    keterangan: "",
    id_kas: null,
    jenis: null,
  });
  const [payloadCashMutation, setPayloadCashMutation] = useState({
    id_kas_sumber: "",
    id_kas_tujuan: "",
    jumlah: null,
    keterangan: null,
  });
  const [selectedCash, setSelectedCash] = useState(null);
  const [selectedFirstDate, setSelectedFirstDate] = useState(null);
  const [selectedLastDate, setSelectedLastDate] = useState(null);
  // const []
  const [pageActive, setPageActive] = useState(1);
  const columns = [
    { key: "no", label: "No." },
    { key: "keterangan", label: "Keterangan" },
    { label: "Tipe Transaksi", key: "tipe" },
    { label: "Tanggal", key: "createdAt" },
    { label: "Jumlah", key: "jumlah" },
    { label: "Saldo Awal", key: "saldo_awal" },
    { label: "Saldo Akhir", key: "saldo_akhir" },
  ];
  const children = {
    saldo_awal: (data) => {
      return <Typography>{currencyFormat(data.saldo_awal)}</Typography>;
    },
    saldo_akhir: (data) => {
      return <Typography>{currencyFormat(data.saldo_akhir)}</Typography>;
    },
    jumlah: (data) => {
      return (
        <Typography
          className={`text-${
            data.jenis === "pengeluaran" ? "red" : "green"
          }-500`}
        >
          {currencyFormat(data.jumlah)}
        </Typography>
      );
    },
    createdAt: (data) => {
      return (
        <Typography>{dayjs(data.createdAt).format("DD-MM-YYYY")}</Typography>
      );
    },
  };
  const onChangePage = (noPage) => {
    dispatch(setPage(noPage));
  };

  const getData = () => {
    dispatch(
      getListCash({
        query: {
          ...paging,
        },
      }),
    );
  };

  const createCash = () => {
    let err = null;
    Object.keys(payloadCash).map((key) => {
      if (!payloadCash[key]) err = key;
    });
    if (err) {
      swall("error", "Error", `${convertToTitleCase(err)} tidak boleh kosong`);
      return;
    }
    if (!selectedCash) {
      dispatch(
        addCash({
          ...payloadCash,
          saldo: parseInt(payloadCash.saldo),
        }),
      );
    } else {
      dispatch(
        updateCash({
          color: payloadCash.color,
          nama_kas: payloadCash.nama_kas,
          status: payloadCash.status,
          id_kas: selectedCash.id_kas,
        }),
      );
    }
  };

  const deleteCash = (id) => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin untuk menghapus?",
      true,
      (result) => {
        if (result.isConfirmed) {
          dispatch(
            removeCash({
              id_kas: id,
            }),
          );
        }
      },
    );
  };

  const onEditCash = (cash) => {
    setPayloadCash({
      nama_kas: cash.nama_kas,
      saldo: cash.saldo,
      status: cash.status,
      color: cash.color,
      id_kas: cash.id_kas,
    });
    setIsOpenModal(true);
  };

  const getListHistoryCash = (id) => {
    dispatch(
      getHistoryCash({
        query: {
          ...pagingHistoryCash,
          ...payloadHistoryCash,
          tanggal_awal: selectedFirstDate
            ? String(format(selectedFirstDate, "yyyy-MM-dd"))
            : "",
          tanggal_akhir: selectedLastDate
            ? String(format(selectedLastDate, "yyyy-MM-dd"))
            : "",
          id_kas: selectedCash?.id_kas,
        },
      }),
    );
  };

  const getSummary = (id) => {
    dispatch(
      getSummaryCash({
        query: {
          id_kas: id,
          tanggal_awal: "",
          tanggal_akhir: "",
        },
      }),
    );
  };

  const handleClickCashCard = (cash) => {
    setSelectedCash(cash);
    getSummary(cash.id_kas);
  };

  const handleClickAdjustment = (type) => {
    setPayloadFormAdjustment({
      ...payloadFormAdjustment,
      jenis: type,
      id_kas: selectedCash?.id_kas,
    });
    setIsOpenModalFormAdjustmen(true);
  };

  const closeFormAdjustment = () => {
    clearPayloadFormAdjustment();
    setIsOpenModalFormAdjustmen(false);
  };

  const clearPayloadFormAdjustment = () => {
    setPayloadFormAdjustment({
      id_kas: null,
      jumlah: null,
      jenis: null,
      keterangan: "",
    });
  };

  const createAdjustment = () => {
    let err = null;
    Object.keys(payloadFormAdjustment).map((key) => {
      if (!payloadFormAdjustment[key] && key !== "keterangan") err = key;
    });
    if (err) {
      swall(
        "error",
        "Error",
        `${convertToTitleCase(err)} tidak boleh kosong`,
        false,
      );
      return;
    }
    dispatch(
      addAdjustment({
        ...payloadFormAdjustment,
        jumlah: parseInt(payloadFormAdjustment.jumlah),
      }),
    );
  };

  const clearPayloadCash = () => {
    setPayloadCash({
      nama_kas: "",
      saldo: null,
      status: null,
      color: null,
    });
  };

  const clearPayloadCashMutation = () => {
    setPayloadCashMutation({
      id_kas_sumber: null,
      id_kas_tujuan: null,
      jumlah: null,
      keterangan: null,
    });
  };

  const createMutationCash = () => {
    let err = null;
    Object.keys(payloadCashMutation).map((key) => {
      if (!payloadCashMutation[key] && key !== "keterangan") err = key;
    });
    if (err) {
      swall(
        "error",
        "Error",
        `${convertToTitleCase(err)} tidak boleh kosong`,
        false,
      );
      return;
    }
    dispatch(
      addMutationCash({
        ...payloadCashMutation,
        id_kas_sumber: parseInt(payloadCashMutation.id_kas_sumber),
        jumlah: parseInt(payloadCashMutation.jumlah),
        id_kas_tujuan: parseInt(payloadCashMutation.id_kas_tujuan),
      }),
    );
  };

  const closeFormCashMutation = () => {
    setPayloadCashMutation({
      id_kas_sumber: null,
      id_kas_tujuan: null,
      jumlah: null,
      keterangan: null,
    });
    setIsOpenModalFormMutation(false);
  };

  useEffect(() => {
    getData();
    return () => {
      dispatch(clearPagingHistoryCash());
    };
  }, []);

  useEffect(() => {
    if (selectedCash) {
      dispatch(setPage(1));
      setPageActive(1);
      getListHistoryCash();
    }
  }, [selectedCash]);

  useEffect(() => {
    if (selectedCash) getListHistoryCash();
  }, [pagingHistoryCash.pages]);

  useEffect(() => {
    if (message) {
      swall("success", "Berhasil", message, false, () => {
        dispatch(clearMessage());
        clearPayloadCash();
        setIsOpenModal(false);
        handleClickCashCard(selectedCash?.id_kas);
        getData();
      });
    }
    if (error) {
      swall("error", "Gagal", error);
    }
    if (messageAdjustmant) {
      swall("success", "Berhasil", messageAdjustmant, false, () => {
        dispatch(clearMessageAdjustment());
        clearPayloadFormAdjustment();
        setIsOpenModalFormAdjustmen(false);
        getListHistoryCash();
        getSummary(selectedCash?.id_kas);
        getData();
      });
    }
    if (messageMutationCash) {
      swall("success", "Berhasil", messageMutationCash, false, () => {
        dispatch(clearMessageMutationCash());
        clearPayloadCashMutation();
        setIsOpenModalFormMutation(false);
        getListHistoryCash();
        getSummary(selectedCash?.id_kas);
        getData();
      });
    }
  }, [message, messageAdjustmant, error, messageMutationCash]);

  return (
    <ContainerPage>
      <Loading isShow={loading} />
      <Dialog size="sm" open={isOpenModalFormAdjustment}>
        <DialogHeader>Form Adjustment</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-1 w-full items-center">
              <div className="flex-grow bg-green-100 border-2 border-green-500 text-green-600 rounded-md p-2 flex justify-center items-center flex-col">
                <Typography>Saldo Saat Ini</Typography>
                <Typography>{currencyFormat(selectedCash?.saldo)}</Typography>
              </div>
              {payloadFormAdjustment?.jenis === "pemasukan" ? "+" : "-"}
              <div className="flex-grow bg-orange-100 border-2 border-orange-500 text-orange-600 rounded-md p-2 flex justify-center items-center flex-col">
                <Typography>Jumlah Pemasukan</Typography>
                <Typography>
                  {currencyFormat(payloadFormAdjustment?.jumlah)}
                </Typography>
              </div>
              =
              <div className="flex-grow bg-blue-100 border-2 border-blue-500 text-blue-600 rounded-md p-2 flex justify-center items-center flex-col">
                <Typography>Saldo Akhir</Typography>
                <Typography>
                  {payloadFormAdjustment?.jenis === "pemasukan"
                    ? currencyFormat(
                        selectedCash?.saldo +
                          parseInt(payloadFormAdjustment?.jumlah),
                      )
                    : currencyFormat(
                        selectedCash?.saldo -
                          parseInt(payloadFormAdjustment?.jumlah),
                      )}
                </Typography>
              </div>
            </div>
            <CurrencyInput
              className="flex-grow w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
              id="jumlah-pemasukan"
              name="jumlah-pemasukan"
              placeholder="Jumlah"
              defaultValue={payloadFormAdjustment.jumlah}
              decimalsLimit={2}
              onValueChange={(value) =>
                setPayloadFormAdjustment({
                  ...payloadFormAdjustment,
                  jumlah: value,
                })
              }
            />
            <Textarea
              label="Keterangan"
              className="w-full"
              onChange={(e) =>
                setPayloadFormAdjustment({
                  ...payloadFormAdjustment,
                  keterangan: e.target.value,
                })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button color="red" onClick={() => closeFormAdjustment()}>
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => createAdjustment()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <Dialog size="sm" open={isOpenModalFormMutation}>
        <DialogHeader>Form Mutasi Kas</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4 text-blue">
            <div className="w-full">
              <ReactSelect
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "rgb(120 144 156/0.5)",
                    borderRadius: 7,
                  }),
                  input: (base) => ({
                    ...base,
                    color: "rgb(120 144 156/0.5)",
                  }),
                }}
                placeholder="Kas Sumber"
                options={listCash.map((v) => ({
                  label: v.nama_kas,
                  value: v.id_kas.toString(),
                }))}
                defaultValue={
                  listCash
                    .map((v) => ({
                      label: v.nama_kas,
                      value: v.id_kas.toString(),
                    }))
                    .filter(
                      (e) => e.value === payloadCashMutation.id_kas_sumber,
                    )[0]
                }
                value={payloadCashMutation.id_kas_sumber?.value}
                onChange={(e) =>
                  setPayloadCashMutation({
                    ...payloadCashMutation,
                    id_kas_sumber: e.value,
                  })
                }
                isDisabled
              />
            </div>
            <div className="w-full">
              <ReactSelect
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "rgb(120 144 156/0.5)",
                    borderRadius: 7,
                  }),
                  input: (base) => ({
                    ...base,
                    color: "rgb(120 144 156/0.5)",
                  }),
                }}
                placeholder="Kas Tujuan"
                options={listCash.map((v) => ({
                  label: v.nama_kas,
                  value: String(v.id_kas),
                }))}
                value={payloadCashMutation.id_kas_tujuan?.value}
                onChange={(e) =>
                  setPayloadCashMutation({
                    ...payloadCashMutation,
                    id_kas_tujuan: e.value,
                  })
                }
              />
            </div>
            <CurrencyInput
              className="flex-grow w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
              id="jumlah-mutasi"
              name="jumlah-mutasi"
              placeholder="Jumlah"
              defaultValue={payloadCashMutation.jumlah}
              decimalsLimit={2}
              onValueChange={(value) =>
                setPayloadCashMutation({
                  ...payloadCashMutation,
                  jumlah: value,
                })
              }
            />
            <Textarea
              label="Keterangan"
              className="w-full"
              onChange={(e) =>
                setPayloadCashMutation({
                  ...payloadCashMutation,
                  keterangan: e.target.value,
                })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button color="red" onClick={() => closeFormCashMutation()}>
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => createMutationCash()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <Dialog size="xs" open={isOpenModal}>
        <DialogHeader>Form Kas</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            <Input
              label="Nama Kas"
              className="w-full"
              value={payloadCash.nama_kas}
              onChange={(e) =>
                setPayloadCash({
                  ...payloadCash,
                  nama_kas: e,
                })
              }
            />
            <div className="flex w-full gap-4">
              <span className="flex items-center justify-center">
                <Typography variant="h5">Rp</Typography>
              </span>
              <CurrencyInput
                disabled={payloadCash.id_kas}
                className="flex-grow w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                id="saldo"
                name="Saldo"
                placeholder="Saldo"
                defaultValue={payloadCash.saldo}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setPayloadCash({ ...payloadCash, saldo: value })
                }
              />
            </div>
            <div className="min-w-[200px] w-full">
              <Select
                id="status-kas"
                label="Status"
                value={payloadCash.status}
                onChange={(val) => {
                  setPayloadCash({
                    ...payloadCash,
                    status: val,
                  });
                }}
              >
                <Option value="">
                  <em>None</em>
                </Option>
                <Option value="true">Aktif</Option>
                <Option value="false">Tidak Aktif</Option>
              </Select>
            </div>
            <div className="w-full flex gap-4">
              <div
                className={`bg-gradient-to-tr from-${
                  payloadCash.color ? payloadCash.color : "gray"
                }-600 to-black flex flex-col w-44 rounded-lg py-2 px-4 items-center justify-center gap-1 h-[5.6rem]`}
              ></div>
              <div className="flex flex-col">
                {payloadCash.color}
                <Typography>Pilih Warna Kartu</Typography>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`h-10 w-10 bg-gradient-to-tr from-red-400 to-black rounded-full ${
                      payloadCash.color === "red"
                        ? "border-blue-gray-900 border-2"
                        : ""
                    }`}
                    role="button"
                    onClick={() =>
                      setPayloadCash({ ...payloadCash, color: "red" })
                    }
                  ></span>
                  <span
                    className={`h-10 w-10 bg-gradient-to-tr from-green-400 to-black rounded-full ${
                      payloadCash.color === "green"
                        ? "border-blue-gray-900 border-2"
                        : ""
                    }`}
                    role="button"
                    onClick={() =>
                      setPayloadCash({ ...payloadCash, color: "green" })
                    }
                  ></span>
                  <span
                    className={`h-10 w-10 bg-gradient-to-tr from-blue-400 to-black rounded-full ${
                      payloadCash.color === "blue"
                        ? "border-blue-gray-900 border-2"
                        : ""
                    }`}
                    role="button"
                    onClick={() =>
                      setPayloadCash({ ...payloadCash, color: "blue" })
                    }
                  ></span>
                  <span
                    className={`h-10 w-10 bg-gradient-to-tr from-yellow-400 to-black rounded-full ${
                      payloadCash.color === "yellow"
                        ? "border-blue-gray-900 border-2"
                        : ""
                    }`}
                    role="button"
                    onClick={() =>
                      setPayloadCash({ ...payloadCash, color: "yellow" })
                    }
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              color="red"
              onClick={() => {
                clearPayloadCash();
                setIsOpenModal(false);
              }}
            >
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => createCash()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <div>
        <Tabs id="tab-kas">
          <TabsHeader
            className="rounded-none bg-transparent gap-2 w-fit p-2 pb-0"
            indicatorProps={{
              className:
                "bg-white border-none rounded-br-none rounded-bl-none shadow-none",
            }}
          >
            {listCash.map((value, key) => {
              return (
                <Tab
                  key={key}
                  value={value.nama_kas}
                  className={`w-48 rounded-lg`}
                  onClick={() => handleClickCashCard(value)}
                >
                  <div
                    className={`bg-gradient-to-tr from-${value.color}-400 from-${value.color}-600 to-black flex flex-col w-44 rounded-lg py-2 px-4 items-start gap-1`}
                  >
                    <Typography variant="small" color="white">
                      {value.nama_kas}
                    </Typography>
                    <Typography color="white">
                      {currencyFormat(value.saldo)}
                    </Typography>
                    <div className="flex gap-2 bg-white rounded-full items-center px-2 ms-auto text-sm">
                      <span
                        className={`h-3 w-3 rounded-full bg-${
                          value.status ? "green" : "red"
                        }-500`}
                      ></span>
                      {value.status ? "Aktif" : "Tidak Aktif"}
                    </div>
                  </div>
                </Tab>
              );
            })}
            <Tab value="" onClick={() => setIsOpenModal(true)}>
              <div
                className={`bg-gradient-to-tr from-gray-600 to-black flex flex-col w-44 rounded-lg py-2 px-4 items-center justify-center gap-1 h-[5.6rem]`}
              >
                <PlusCircleIcon className="text-white h-8 w-8" />
                <Typography variant="small" color="white">
                  Tambah Kas Baru
                </Typography>
              </div>
            </Tab>
          </TabsHeader>
          <TabsBody className="bg-transparent px-2">
            {listCash.map((value, key) => {
              return (
                <TabPanel key={key} value={value.nama_kas} className="bg-white">
                  <div className="mt-4 mb-4 flex gap-2">
                    <Button
                      className="flex gap-2 px-6 py-2 bg-blue-500"
                      onClick={() => onEditCash(value)}
                    >
                      <PencilIcon className="w-5 h-5" />
                      <Typography variant="small" className="text-nowrap">
                        Edit Kas
                      </Typography>
                    </Button>
                    <Button
                      className="flex gap-2 px-6 py-2 bg-red-500"
                      onClick={() => deleteCash(value.id_kas)}
                    >
                      <TrashIcon className="w-5 h-5" />
                      <Typography variant="small" className="text-nowrap">
                        Hapus Kas
                      </Typography>
                    </Button>
                  </div>
                  <div className="flex gap-4 mb-6">
                    <Card className="p-2 flex-grow">
                      <Typography
                        variant="small"
                        className="text-blue-gray-400"
                      >
                        Saldo Awal
                      </Typography>
                      {loadingSingle ? (
                        <Spinner />
                      ) : (
                        <Typography
                          variant="lead"
                          className="font-bold text-blue-gray-400"
                        >
                          {currencyFormat(summaryCash?.saldo_awal)}
                        </Typography>
                      )}
                    </Card>
                    <Card className="p-2 flex-grow relative">
                      <Typography
                        variant="small"
                        className="text-blue-gray-400"
                      >
                        Pemasukan
                      </Typography>
                      {loadingSingle ? (
                        <Spinner />
                      ) : (
                        <Typography
                          variant="lead"
                          className="font-bold text-blue-gray-400"
                        >
                          {currencyFormat(summaryCash?.pemasukan)}
                        </Typography>
                      )}
                      <div className="absolute right-2 bottom-2 shadow-md border border-blue-gray-400 p-1">
                        <Typography className="text-xs">
                          x{summaryCash?.jumlah_pemasukan || ""}
                        </Typography>
                      </div>
                    </Card>
                    <Card className="p-2 flex-grow relative">
                      <Typography
                        variant="small"
                        className="text-blue-gray-400"
                      >
                        Pengeluaran
                      </Typography>
                      {loadingSingle ? (
                        <Spinner />
                      ) : (
                        <Typography
                          variant="lead"
                          className="font-bold text-blue-gray-400"
                        >
                          {currencyFormat(summaryCash?.pengeluaran)}
                        </Typography>
                      )}
                      <div className="absolute right-2 bottom-2 shadow-md border border-blue-gray-400 p-1">
                        <Typography className="text-xs">
                          x{summaryCash?.jumlah_pengeluaran || ""}
                        </Typography>
                      </div>
                    </Card>
                    <Card className="p-2 flex-grow">
                      <Typography
                        variant="small"
                        className="text-blue-gray-400"
                      >
                        Saldo Akhir
                      </Typography>
                      {loadingSingle ? (
                        <Spinner />
                      ) : (
                        <Typography
                          variant="lead"
                          className="font-bold text-blue-gray-400"
                        >
                          {currencyFormat(summaryCash?.saldo_akhir)}
                        </Typography>
                      )}
                    </Card>
                  </div>
                  <div className="flex gap-4">
                    <Card
                      className="flex flex-row gap-2 p-1 flex-grow"
                      role="button"
                      onClick={() => handleClickAdjustment("pemasukan")}
                    >
                      <div className="bg-green-50 rounded-sm w-fit p-2 flex justify-center items-center">
                        <PlusCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <Typography className="w-fit text-blue-gray-400 font-bold text-sm">
                          Tambah Pemasukan
                        </Typography>
                        <Typography className="w-fit text-blue-gray-400 text-xs">
                          Buat Pemasukan Manual
                        </Typography>
                      </div>
                    </Card>
                    <Card
                      className="flex flex-row gap-2 p-1 flex-grow"
                      role="button"
                      onClick={() => handleClickAdjustment("pengeluaran")}
                    >
                      <div className="bg-red-50 rounded-sm w-fit p-2 flex justify-center items-center">
                        <MinusCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <Typography className="w-fit text-blue-gray-400 font-bold text-sm">
                          Tambah Pengeluaran
                        </Typography>
                        <Typography className="w-fit text-blue-gray-400 text-xs">
                          Buat Pengeluaran Manual
                        </Typography>
                      </div>
                    </Card>
                    <Card
                      className="flex flex-row gap-2 p-1 flex-grow"
                      role="button"
                      onClick={() => {
                        setPayloadCashMutation({
                          ...payloadCashMutation,
                          id_kas_sumber: String(selectedCash?.id_kas),
                        });
                        setIsOpenModalFormMutation(true);
                      }}
                    >
                      <div className="bg-blue-50 rounded-sm w-fit p-2 flex justify-center items-center">
                        <ArrowPathIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <Typography className="w-fit text-blue-gray-400 font-bold text-sm">
                          Transfer Saldo
                        </Typography>
                        <Typography className="w-fit text-blue-gray-400 text-xs">
                          Pindahkan Saldo ke Kas lain
                        </Typography>
                      </div>
                    </Card>
                  </div>
                  <div className="mb-10 mt-6 flex justify-end md:flex-auto flex-wrap gap-2">
                    <div className="flex gap-2">
                      <div className="w-56">
                        <DatePicker
                          value={selectedFirstDate}
                          label={"Tanggal Awal"}
                          setDate={setSelectedFirstDate}
                        />
                      </div>
                      <div className="w-56">
                        <DatePicker
                          value={selectedLastDate}
                          label={"Tanggal Akhir"}
                          setDate={setSelectedLastDate}
                        />
                      </div>
                    </div>
                    <Button
                      className="flex justify-center items-center gap-2 text-white bg-blue-500 py-0 px-2"
                      onClick={() => {
                        dispatch(setPage(1));
                        setPageActive(1);
                        getListHistoryCash();
                      }}
                    >
                      <Typography>Cari</Typography>
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Tables
                    columns={columns}
                    datas={listHistory}
                    changePage={onChangePage}
                    isLoading={loadingTable}
                    paging={pagingHistoryCash}
                    children={children}
                    title="History Kas"
                    active={pageActive}
                    setActive={setPageActive}
                  />
                </TabPanel>
              );
            })}
          </TabsBody>
        </Tabs>
      </div>
    </ContainerPage>
  );
}

export default Cash;
