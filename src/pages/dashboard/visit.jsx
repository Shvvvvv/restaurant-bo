import { currencyFormat } from "@/configs/currency";
import swall from "@/configs/sweetalert";
import { getResourceCash } from "@/stores/cash/cashSlice";
import { getResourceTable } from "@/stores/diningTable/diningTableSlice";
import {
  addMenuSales,
  clearMenuSales,
  clearMessageMenu,
  getListMenuSales,
  getResourceMenu,
} from "@/stores/menu/menuSlice";
import { getResourcePayment } from "@/stores/paymentMethod/paymentMethodSlice";
import { getResourceTax } from "@/stores/tax/taxSlice";
import {
  addBooking,
  addVisit,
  bookingPayment,
  bookingToRegistrasi,
  cancelVisit,
  clearError,
  clearMessageSuccess,
  clearMessageSuccessFinished,
  clearPaging,
  clearVisit,
  clearVisitCreated,
  finishedVisit,
  getListVisit,
  getVisit,
  printBill,
  setPage,
  updateBooking,
  visitPayment,
} from "@/stores/visit/visitSlice";
import { ContainerPage } from "@/widgets/container";
import { Tables } from "@/widgets/tables";
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
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
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";

export function Visit() {
  const {
    listVisit,
    visitCreated,
    paging,
    loadingVisit,
    loadingTable,
    loadingSingle,
    error,
    messageSuccess,
    messageSuccessFinished,
    visit,
  } = useSelector((state) => state.visit);
  const {
    menuSales,
    listMenuSales,
    totalHargaMenu,
    loadingMenu,
    errorMenu,
    messageMenu,
    resourceTable,
    loading,
  } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [diningIn, setDiningIn] = useState(false);
  const [activaPage, setActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState("home");
  const [defaultOptionsMeja, setDefaultOptionsMeja] = useState([]);
  const [defaultOptionsMenu, setDefaultOptionsMenu] = useState([]);
  const [defaultOptionsPayment, setDefaultOptionsPayment] = useState([]);
  const [defaultOptionsTax, setDefaultOptionsTax] = useState([]);
  const [defaultOptionsCash, setDefaultOptionsCash] = useState([]);
  const [selectedCash, setSelectedCash] = useState("");
  const [totalCashPayment, setTotalCashPayment] = useState(null);
  const [showDetailVisit, setShowDetailVisit] = useState(false);
  const [showChangeMenu, setShowChangeMenu] = useState(false);

  const columns = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "id_kunjungan",
      label: "ID",
    },
    {
      key: "nama",
      label: "Nama Pelanggan",
    },
    {
      key: "nomor_hp",
      label: "Nomor Hp",
    },
    {
      key: "tgl_kunjungan",
      label: "Tanggal Kunjungan",
    },
    {
      key: "jumlah_orang",
      label: "Jumlah Orang",
    },
    {
      key: "nama_meja",
      label: "Meja",
    },
    {
      key: "nama_metode_pembayaran",
      label: "Metode Pembayaran",
    },
    {
      key: "total_tagihan",
      label: "Total Tagihan",
    },
    {
      key: "total_pajak",
      label: "Total Pajak",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "status_booking",
      label: "Status Booking",
    },
    {
      key: "alasan_batal",
      label: "Alasan Pembatalan",
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
  const [paramVisit, setParamVisit] = useState({
    status: "",
    search_key: "",
    status_booking: "",
  });
  const children = {
    tgl_kunjungan: (data) => {
      return (
        <Typography>
          {dayjs(data.tgl_kunjungan).format("DD-MM-YYYY")}
        </Typography>
      );
    },
    total_tagihan: (data) => {
      return <Typography>{currencyFormat(data.total_tagihan)}</Typography>;
    },
    total_pajak: (data) => {
      return <Typography>{currencyFormat(data.total_pajak)}</Typography>;
    },
    status: (data) => {
      switch (data.status) {
        case 1:
          return "Booking";
          break;
        case 2:
          return "Registrasi";
          break;
        case 3:
          return "Selesai";
          break;
        case 4:
          return "Lunas";
          break;
        case 99:
          return "Batal";
          break;
        default:
      }
    },
    status_booking: (data) => {
      switch (data.status_booking) {
        case 1:
          return "Draft";
          break;
        case 2:
          return "Dikonfirmasi";
          break;
        case 99:
          return "Batal";
          break;
        default:
      }
    },
    action: (data) => {
      return (
        <div className="flex gap-4">
          <IconButton
            color="blue-gray"
            size="sm"
            onClick={() => handleClickDetailVisit(data.id_kunjungan)}
          >
            <EyeIcon height={20} />
          </IconButton>
        </div>
      );
    },
    createdAt: (data) => {
      return (
        <Typography>{dayjs(data.createdAt).format("DD-MM-YYYY")}</Typography>
      );
    },
  };
  const styleShowTab = {
    opacity: 1,
    top: 0,
    left: 0,
    zIndex: 2,
    position: "relative",
    transform: "translateX(0)",
    transition: "opacity 0.5s, transform 0.5s",
  };
  const styleHideTab = {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    transform: "translateX(-100%)",
    opacity: 0,
    transition: "opacity 0.5s, transform 0.5s",
  };
  const [payloadCreateVisiting, setPayloadCreateVisiting] = useState({
    tgl_kunjungan: "",
    nama: "",
    nomor_hp: "",
    jumlah_orang: "",
    id_meja: null,
    id_metode_pembayaran: null,
    id_pajak: null,
    email: "",
  });
  const [payloadCreateBooking, setPayloadCreateBooking] = useState({
    tgl_kunjungan: "",
    nama: "",
    nomor_hp: "",
    jumlah_orang: "",
    id_meja: null,
    id_metode_pembayaran: null,
    id_pajak: null,
    email: "",
    jam: "",
    keteraangan: "",
  });
  const [payloadAddMenu, setPayloadAddMenu] = useState([
    {
      id_menu: "",
      qty: 0,
      id_penjualan_menu: null,
    },
  ]);

  const clearPayloadVisiting = () => {
    dispatch(clearVisit());
    dispatch(clearVisitCreated());
    dispatch(clearMenuSales());
    setPayloadAddMenu([
      {
        id_menu: null,
        qty: 0,
        id_penjualan_menu: null,
      },
    ]);
    setPayloadCreateVisiting({
      tgl_kunjungan: "",
      nama: "",
      nomor_hp: "",
      email: "",
      jumlah_orang: "",
      id_meja: null,
      id_metode_pembayaran: null,
      id_pajak: null,
      email: "",
    });
    setDiningIn(false);
    setSelectedCash(null);
  };
  const clearPayloadBooking = () => {
    dispatch(clearVisit());
    dispatch(clearVisitCreated());
    dispatch(clearMenuSales());
    setPayloadAddMenu([
      {
        id_menu: null,
        qty: 0,
        id_penjualan_menu: null,
      },
    ]);
    setPayloadCreateBooking({
      tgl_kunjungan: "",
      nama: "",
      nomor_hp: "",
      jumlah_orang: "",
      id_meja: null,
      id_metode_pembayaran: null,
      id_pajak: null,
      email: "",
      jam: "",
      keteraangan: "",
    });
  };
  const loadOptionsDiningTable = async (inputValue, callback) => {
    try {
      const resultAction = await dispatch(
        getResourceTable({
          query: {
            search_key: inputValue,
            tanggal: dayjs(
              payloadCreateVisiting.tgl_kunjungan
                ? payloadCreateVisiting.tgl_kunjungan
                : new Date(),
            ).format("YYYY-MM-DD"),
            kapasitas: payloadCreateVisiting.jumlah_orang,
            jam: String(payloadCreateVisiting.jam),
          },
        }),
      );
      if (getResourceTable.fulfilled.match(resultAction)) {
        callback(
          resultAction.payload.data?.list.map((v) => ({
            label: v.label,
            value: v.id?.toString(),
          })),
        );
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  const loadOptionsCash = async (inputValue, callback) => {
    try {
      const resultAction = await dispatch(
        getResourceCash({
          query: {
            search_key: inputValue,
          },
        }),
      );
      if (getResourceCash.fulfilled.match(resultAction)) {
        callback(
          resultAction.payload.data?.list.map((v) => ({
            label: v.label,
            value: v.id?.toString(),
          })),
        );
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  const loadOptionsMenu = async (inputValue, callback) => {
    try {
      const resultAction = await dispatch(
        getResourceMenu({
          query: {
            search_key: inputValue,
          },
        }),
      );
      if (getResourceMenu.fulfilled.match(resultAction)) {
        callback(
          resultAction.payload.data?.list.map((v) => ({
            label: v.label,
            value: v.id?.toString(),
          })),
        );
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  const loadOptionsPayment = async (inputValue, callback) => {
    try {
      const resultAction = await dispatch(
        getResourcePayment({
          query: {
            search_key: inputValue,
          },
        }),
      );
      if (getResourcePayment.fulfilled.match(resultAction)) {
        callback(
          resultAction.payload.data?.list.map((v) => ({
            label: v.label,
            value: v.id?.toString(),
          })),
        );
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  const loadOptionsTax = async (inputValue, callback) => {
    try {
      const resultAction = await dispatch(
        getResourceTax({
          query: {
            search_key: inputValue,
          },
        }),
      );
      if (getResourceTax.fulfilled.match(resultAction)) {
        callback(
          resultAction.payload.data?.list.map((v) => ({
            label: v.label,
            value: v.id?.toString(),
          })),
        );
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  const handleClickAddMenu = () => {
    setPayloadAddMenu((oldValue) => [
      ...oldValue,
      {
        id_menu: "",
        qty: 0,
        id_penjualan_menu: null,
      },
    ]);
  };
  const handleClickEditMenu = () => {
    dispatch(
      addMenuSales({
        menu: payloadAddMenu.map((item) => ({
          id_menu: item.id_menu.value,
          qty: item.qty,
          id_penjualan_menu: item.id_penjualan_menu,
        })),
        id_penjualan: visit?.id_penjualan,
      }),
    );
  };
  const handleCreateVisiting = () => {
    dispatch(
      addVisit({
        ...payloadCreateVisiting,
        tgl_kunjungan: dayjs(payloadCreateVisiting.tgl_kunjungan).format(
          "YYYY-MM-DD",
        ),
        id_meja: payloadCreateVisiting.id_meja?.value || null,
        id_metode_pembayaran:
          payloadCreateVisiting.id_metode_pembayaran.value || null,
        id_pajak: payloadCreateVisiting.id_pajak.value || null,
        take_away: !diningIn,
      }),
    );
  };
  const handleCreateBooking = () => {
    dispatch(
      addBooking({
        ...payloadCreateBooking,
        tgl_kunjungan: dayjs(payloadCreateBooking.tgl_kunjungan).format(
          "YYYY-MM-DD",
        ),
        id_meja: payloadCreateBooking.id_meja?.value || null,
        id_metode_pembayaran:
          payloadCreateBooking.id_metode_pembayaran?.value || null,
        id_pajak: payloadCreateBooking.id_pajak?.value || null,
      }),
    );
  };
  const handleCreateMenuSales = () => {
    dispatch(
      addMenuSales({
        menu: payloadAddMenu.map((item) => ({
          id_menu: item.id_menu?.value,
          qty: item.qty,
          id_penjualan_menu: item.id_penjualan_menu,
        })),
        id_penjualan: visitCreated?.id_penjualan || "",
      }),
    );
  };
  const handlePayment = () => {
    dispatch(
      visitPayment({
        id_kunjungan: visit?.id_kunjungan,
        bayar_nominal:
          visit?.id_metode_pembayaran != 6
            ? visit?.total_tagihan
            : parseInt(totalCashPayment),
        id_metode_pembayaran: visit?.id_metode_pembayaran,
        id_kas: selectedCash?.value,
      }),
    );
  };
  const handleBookingPayment = () => {
    dispatch(
      bookingPayment({
        id_kunjungan: visit?.id_kunjungan,
        id_metode_pembayaran: visit?.id_metode_pembayaran,
        id_kas: selectedCash?.value,
        bayar_nominal:
          visit?.id_metode_pembayaran != 6
            ? visit?.total_tagihan
            : parseInt(totalCashPayment),
      }),
    );
  };
  const handleFinishedVisit = () => {
    dispatch(
      finishedVisit({
        id_kunjungan: visit?.id_kunjungan,
      }),
    );
  };
  const handleCancelPayment = () => {
    Swal.fire({
      title: "Alasan kunjungan dibatalkan?",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      customClass: {
        container: "z-[9999]",
      },
      showLoaderOnConfirm: true,
      preConfirm: async (alasan) => {
        try {
          const cancel = await dispatch(
            cancelVisit({
              id_kunjungan: visit?.id_kunjungan,
              alasan_batal: alasan,
            }),
          );
          if (cancelVisit.fulfilled.match(cancel)) {
            swall(
              "success",
              "Berhasil",
              "Kunjungan berhasil dibatalkan",
              false,
              () => {
                dispatch(clearVisit());
                dispatch(clearMenuSales());
                setPayloadAddMenu([
                  {
                    id_menu: "",
                    qty: 0,
                    id_penjualan_menu: null,
                  },
                ]);
                setPayloadCreateVisiting({
                  tgl_kunjungan: "",
                  nama: "",
                  nomor_hp: "",
                  jumlah_orang: "",
                  id_meja: null,
                  id_metode_pembayaran: null,
                  id_pajak: null,
                });
                setActiveTab("home");
                setShowDetailVisit(false);
                getData();
              },
            );
          }
        } catch (err) {
          swall("error", "Gagal", "Kunjungan gagal dibatalkan", false);
        }
      },
    });
  };
  const handleConfirmBooking = async () => {
    try {
      const confirm = await dispatch(
        updateBooking({
          id_kunjungan: visit?.id_kunjungan || "",
          status_booking: 2,
        }),
      );
      if (updateBooking.fulfilled.match(confirm)) {
        if (confirm.payload.status) {
          swall(
            "success",
            "Berhasil",
            "Booking berhasil disetujui",
            false,
            () => {
              setShowDetailVisit(false);
              getData();
            },
          );
        } else {
          swall("error", "Gagal", confirm.payload.message, false);
        }
      }
    } catch (err) {
      swall("error", "Error", err.message, false);
    }
  };
  const handleBookingToRegistrasi = async () => {
    try {
      const confirm = await dispatch(
        bookingToRegistrasi({
          id_kunjungan: visit?.id_kunjungan,
        }),
      );
      if (bookingToRegistrasi.fulfilled.match(confirm)) {
        if (confirm.payload.status) {
          swall("success", "Berhasil", confirm.payload.message, false, () => {
            setShowDetailVisit(false);
            getData();
          });
        } else {
          swall("error", "Gagal", confirm.payload.message, false);
        }
      }
    } catch (err) {
      swall("error", "Error", err.message, false);
    }
  };
  const handleCancelBooking = () => {
    Swal.fire({
      title: "Alasan booking dibatalkan?",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      customClass: {
        container: "z-[9999]",
      },
      showLoaderOnConfirm: true,
      preConfirm: async (alasan) => {
        try {
          const cancel = await dispatch(
            updateBooking({
              id_kunjungan: visit?.id_kunjungan,
              status_booking: 3,
              alasan_batal: alasan,
            }),
          );
          if (updateBooking.fulfilled.match(cancel)) {
            swall(
              "success",
              "Berhasil",
              "Booking berhasil dibatalkan",
              false,
              () => {
                dispatch(clearVisit());
                dispatch(clearMenuSales());
                setPayloadAddMenu([
                  {
                    id_menu: "",
                    qty: 0,
                    id_penjualan_menu: null,
                  },
                ]);
                clearPayloadBooking();
                setActiveTab("home");
                setShowDetailVisit(false);
                getData();
              },
            );
          }
        } catch (err) {
          swall("error", "Gagal", "Kunjungan gagal dibatalkan", false);
        }
      },
    });
  };
  const handleClickDetailVisit = (id) => {
    setShowDetailVisit(true);
    dispatch(
      getVisit({
        query: {
          id_kunjungan: id,
        },
      }),
    );
  };
  const handleChangeTab = async (tab) => {
    setActiveTab(tab);
    if (tab === "booking") {
      clearPayloadBooking();
    } else if (tab === "kunjungan") {
      clearPayloadVisiting();
    }
  };
  const getData = () => {
    dispatch(
      getListVisit({
        query: {
          ...paging,
          ...paramVisit,
        },
      }),
    );
  };
  const changePage = (page) => {
    dispatch(setPage(page));
  };
  const loadDefaultOptionsDiningTable = async () => {
    try {
      if (activeTab === "kunjungan") {
        const resultAction = await dispatch(
          getResourceTable({
            query: {
              search_key: "",
              tanggal: dayjs(
                payloadCreateVisiting.tgl_kunjungan
                  ? payloadCreateVisiting.tgl_kunjungan
                  : new Date(),
              ).format("YYYY-MM-DD"),
              kapasitas: payloadCreateVisiting.jumlah_orang || "",
            },
          }),
        );
        if (getResourceTable.fulfilled.match(resultAction)) {
          setDefaultOptionsMeja(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
              kapasitas: v.kapasitas?.toString(),
            })),
          );
        }
      } else if (activeTab === "booking") {
        const resultAction = await dispatch(
          getResourceTable({
            query: {
              search_key: "",
              tanggal: dayjs(
                payloadCreateBooking.tgl_kunjungan
                  ? payloadCreateBooking.tgl_kunjungan
                  : new Date(),
              ).format("YYYY-MM-DD"),
              kapasitas: payloadCreateBooking.jumlah_orang || "",
              jam: payloadCreateBooking.jam || "",
            },
          }),
        );
        if (getResourceTable.fulfilled.match(resultAction)) {
          setDefaultOptionsMeja(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
              kapasitas: v.kapasitas?.toString(),
            })),
          );
        }
      }
    } catch (err) {
      swall("error", "Gagal", err.message, false);
    }
  };
  useEffect(() => {
    getData();
    return () => {
      dispatch(clearPaging());
    };
  }, []);
  useEffect(() => {
    getData();
  }, [paging.pages]);
  useEffect(() => {
    const loadDefaultOptionsMenu = async () => {
      try {
        const resultAction = await dispatch(
          getResourceMenu({
            query: {
              search_key: "",
            },
          }),
        );
        if (getResourceMenu.fulfilled.match(resultAction)) {
          setDefaultOptionsMenu(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
            })),
          );
        }
      } catch (err) {
        swall("error", "Gagal", err.message, false);
      }
    };
    const loadDefaultOptionsCash = async () => {
      try {
        const resultAction = await dispatch(
          getResourceCash({
            query: {
              search_key: "",
            },
          }),
        );
        if (getResourceCash.fulfilled.match(resultAction)) {
          setDefaultOptionsCash(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
            })),
          );
        }
      } catch (err) {
        swall("error", "Gagal", err.message, false);
      }
    };
    const loadDefaultOptionsTax = async () => {
      try {
        const resultAction = await dispatch(
          getResourceTax({
            query: {
              search_key: "",
            },
          }),
        );
        if (getResourceTax.fulfilled.match(resultAction)) {
          setDefaultOptionsTax(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
            })),
          );
        }
      } catch (err) {
        swall("error", "Gagal", err.message, false);
      }
    };
    const loadDefaultOptionsPayment = async () => {
      try {
        const resultAction = await dispatch(
          getResourcePayment({
            query: {
              search_key: "",
            },
          }),
        );
        if (getResourcePayment.fulfilled.match(resultAction)) {
          setDefaultOptionsPayment(
            resultAction.payload.data?.list.map((v) => ({
              label: v.label,
              value: v.id?.toString(),
            })),
          );
        }
      } catch (err) {
        swall("error", "Gagal", err.message, false);
      }
    };

    loadDefaultOptionsCash();
    loadDefaultOptionsDiningTable();
    loadDefaultOptionsMenu();
    loadDefaultOptionsPayment();
    loadDefaultOptionsTax();
  }, [dispatch, activeTab]);
  useEffect(() => {
    if (messageMenu) {
      swall("success", "Berhasil", messageMenu, false, () => {
        dispatch(clearMessageMenu());
        setShowDetailVisit(true);
        dispatch(
          getVisit({
            query: {
              id_kunjungan: visitCreated?.id_kunjungan || visit?.id_kunjungan,
            },
          }),
        );
      });
    }
    if (visit) {
      if (visit?.penjualan_menu.length > 0)
        setPayloadAddMenu(
          visit?.penjualan_menu.map((item) => ({
            id_menu: {
              value: item.id_menu,
              label: item.nama_menu,
            },
            qty: item.qty,
            id_penjualan_menu: item.id_penjualan_menu,
          })),
        );
    }

    if (error) {
      swall("error", "Gagal", error, false);
      dispatch(clearError());
    }
    if (messageSuccess) {
      Swal.fire({
        title: "Berhasil",
        text: "berhasil",
        icon: "success",
        customClass: {
          container: "z-[9999]",
        },
        confirmButtonText: "Cetak Tagihan",
      }).then(async (res) => {
        if (res.isConfirmed) {
          const res = await dispatch(
            printBill({
              query: {
                id_kunjungan: visit?.id_kunjungan,
              },
            }),
          );
          if (printBill.fulfilled.match(res)) {
            const blob = new Blob([res.payload], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Tagihan-${visit?.nama}-${dayjs(new Date()).format(
              "DDMMYYYY",
            )}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }
        }
        dispatch(clearMessageSuccess());
        clearPayloadVisiting();
        clearPayloadBooking();
        setShowDetailVisit(false);
        setTotalCashPayment(null);
        loadDefaultOptionsDiningTable();
        getData();
        setActiveTab("home");
      });
    }
    if (messageSuccessFinished) {
      swall("success", "Berhasil", "Kunjungan telah selesai", false, () => {
        dispatch(clearMessageSuccessFinished());
        setShowDetailVisit(false);
        getData();
      });
    }
  }, [error, messageSuccess, visit, messageMenu, messageSuccessFinished]);

  return (
    <ContainerPage>
      {/* MODAL RINCIAN KUNJUNGAN */}
      <Dialog open={showDetailVisit}>
        <DialogHeader className="border-b">
          <div className="flex justify-between w-full">
            <Typography variant="h3">Rincian Kunjungan</Typography>
            {activeTab === "home" && (
              <IconButton
                variant="text"
                onClick={() => {
                  setShowChangeMenu(false);
                  setShowDetailVisit(false);
                  setPayloadAddMenu([
                    {
                      id_menu: null,
                      qty: 0,
                      id_penjualan_menu: null,
                    },
                  ]);
                }}
              >
                <XMarkIcon className="h-6 w-6" />
              </IconButton>
            )}
          </div>
        </DialogHeader>
        <DialogBody>
          {loadingVisit ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div>
              <Typography className="font-semibold">
                Informasi Pelanggan
              </Typography>
              <div className="grid grid-cols-3 grid-flow-col mt-2">
                <div className="cols-span-2">Nama Pelanggan</div>
                <div className="cols-span-2">: {visit?.nama}</div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col mt-2">
                <div className="cols-span-2">Nomor Hp</div>
                <div className="cols-span-2">: {visit?.nomor_hp}</div>
              </div>
              {!visit?.take_away && (
                <div className="grid grid-cols-3 grid-flow-col mt-2">
                  <div className="cols-span-2">Meja</div>
                  <div className="cols-span-2">: {visit?.nama_meja}</div>
                </div>
              )}
              <div className="grid grid-cols-3 grid-flow-col mt-2">
                <div className="cols-span-2">Jumlah Orang</div>
                <div className="cols-span-2">: {visit?.jumlah_orang}</div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col mt-2">
                <div className="cols-span-2">Metode Pembayaran</div>
                <div className="cols-span-2">
                  : {visit?.nama_metode_pembayaran}
                </div>
              </div>
              <div className="flex justify-between items-baseline my-4">
                <Typography className="font-semibold mt-6">
                  Informasi Pesanan
                </Typography>
                {!visit?.invoice && (
                  <Button
                    className="bg-orange-300 w-32"
                    size="sm"
                    onClick={() => setShowChangeMenu(!showChangeMenu)}
                  >
                    {showChangeMenu ? "Batal" : "Ubah Menu"}
                  </Button>
                )}
              </div>
              {showChangeMenu ? (
                <div className="my-2">
                  <div className="grid grid-cols-10 grid-flow-col gap-2 mt-4">
                    <div className="col-span-10 flex gap-2">
                      <Button
                        disabled={loadingMenu}
                        variant="sm"
                        className="py-1 flex justify-center items-center bg-blue-400 w-24"
                        onClick={handleClickAddMenu}
                      >
                        <PlusIcon className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="sm"
                        className="py-1 flex justify-center items-center bg-green-400 w-24"
                        onClick={handleClickEditMenu}
                        disabled={loadingMenu}
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>
                  {payloadAddMenu.map((menu, idx) => (
                    <div className="grid grid-cols-10 grid-flow-col gap-4 mt-4">
                      <div className="col-span-4">
                        <AsyncSelect
                          placeholder="Pilih Menu"
                          isDisabled={loadingMenu}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "transparent",
                            }),
                            option: (base) => ({
                              ...base,
                            }),
                          }}
                          cacheOptions
                          isMulti={false}
                          loadOptions={loadOptionsMenu}
                          defaultOptions={defaultOptionsMenu}
                          value={payloadAddMenu[idx].id_menu}
                          onChange={(e) => {
                            setPayloadAddMenu((prevData) => {
                              const data = [...prevData];
                              data[idx] = {
                                ...data[idx],
                                id_menu: e,
                              };
                              return data;
                            });
                          }}
                          menuPosition="fixed"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          disabled={loadingMenu}
                          label="Qty"
                          type="number"
                          value={payloadAddMenu[idx].qty}
                          onChange={(e) =>
                            setPayloadAddMenu((prevData) => {
                              const data = [...prevData];
                              data[idx] = {
                                ...data[idx],
                                qty: e.target.value,
                              };
                              return data;
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <IconButton
                          variant="text"
                          onClick={() => {
                            setPayloadAddMenu((prevData) => {
                              const data = [...prevData];
                              data.splice(idx, 1);
                              return data;
                            });
                          }}
                        >
                          <XMarkIcon className="h-5" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-10 grid-flow-col mt-2 w-full">
                    <div className="col-span-5">Nama Menu</div>
                    <div className="col-span-1">Qty</div>
                    <div className="col-span-2">Harga</div>
                    <div className="col-span-2">Total Harga</div>
                  </div>
                  {loading ? (
                    <div className="flex w-full justify-center py-2">
                      <Spinner />
                    </div>
                  ) : (
                    visit?.penjualan_menu?.map((menu) => {
                      return (
                        <div
                          className="grid grid-cols-10 grid-flow-col mt-2 w-full"
                          key={menu.id_penjualan_menu}
                        >
                          <div className="col-span-5">{menu.nama_menu}</div>
                          <div className="col-span-1">x{menu.qty}</div>
                          <div className="col-span-2">
                            {currencyFormat(menu.harga)}
                          </div>
                          <div className="col-span-2">
                            {currencyFormat(menu.total_harga)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              <div className="grid grid-cols-12 grid-flow-col mt-2 w-full">
                <div className="col-span-5"></div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <Typography className="float-right">Diskon :</Typography>
                </div>
                <div className="col-span-4">
                  <Typography className="float-right">0%</Typography>
                </div>
              </div>
              <div className="grid grid-cols-12 grid-flow-col mt-2 w-full">
                <div className="col-span-5"></div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <Typography className="float-right">
                    Pajak ({visit?.pajak_persen}%) :
                  </Typography>
                </div>
                <div className="col-span-4">
                  <Typography className="float-right">
                    {currencyFormat(visit?.total_pajak)}
                  </Typography>
                </div>
              </div>
              <div className="grid grid-cols-12 grid-flow-col mt-2 w-full border-b">
                <div className="col-span-2"></div>
                <div className="col-span-1"></div>
                <div className="col-span-5">
                  <Typography className="float-right">
                    Total Pembayaran :
                  </Typography>
                </div>
                <div className="col-span-4">
                  <Typography className="float-right" variant="lead">
                    {currencyFormat(visit?.total_tagihan)}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        {!loadingVisit && (
          <DialogFooter>
            <div className="flex gap-24 justify-between flex-grow">
              <div className="w-1/2">
                {!visit?.invoice && (
                  <AsyncSelect
                    className="w-full"
                    isDisabled={loadingMenu}
                    placeholder="Pilih Kas"
                    loadOptions={loadOptionsCash}
                    cacheOptions
                    isMulti={false}
                    isSearchable={false}
                    defaultOptions={defaultOptionsCash}
                    value={selectedCash}
                    onChange={(e) => setSelectedCash(e)}
                  />
                )}
              </div>

              <div className="w-1/2">
                {visit?.id_metode_pembayaran == 6 &&
                  (visit?.status == 1 || visit?.status == 2) &&
                  !visit?.invoice && (
                    <CurrencyInput
                      className="h-[90%] border border-blue-gray-200 rounded w-full p-2"
                      name="cash-payment"
                      placeholder="Jumlah Pembayaran"
                      decimalsLimit={2}
                      defaultValue={totalCashPayment}
                      onValueChange={(e) => {
                        setTotalCashPayment(e);
                      }}
                    />
                  )}
              </div>

              <div className="flex gap-2">
                {visit?.status === 4 && (
                  <Button
                    variant="sm"
                    className="bg-blue-gray-400"
                    disabled={loadingMenu || loadingSingle}
                    onClick={handleFinishedVisit}
                  >
                    {loadingSingle ? <Spinner /> : "Selesai"}
                  </Button>
                )}
                {visit?.status == 1 &&
                  visit?.status_booking == 1 &&
                  (visit?.invoice ||
                    (!visit?.invoice && visit?.id_metode_pembayaran == 6)) && (
                    <>
                      <Button
                        variant="sm"
                        className="bg-red-400"
                        disabled={loadingSingle || loadingMenu}
                        onClick={handleCancelBooking}
                      >
                        Tolak
                      </Button>
                      <Button
                        variant="sm"
                        className="bg-green-400"
                        onClick={handleConfirmBooking}
                      >
                        Setujui
                      </Button>
                    </>
                  )}
                {visit?.status == 1 && visit?.status_booking == 2 && (
                  <Button
                    size="sm"
                    className="bg-green-400"
                    onClick={handleBookingToRegistrasi}
                  >
                    Konfirmasi
                  </Button>
                )}
                {!visit?.invoice && (
                  <>
                    <Button
                      variant="sm"
                      className="bg-red-400"
                      disabled={loadingSingle || loadingMenu}
                      onClick={handleCancelPayment}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="sm"
                      className="bg-green-400"
                      onClick={() => {
                        if (visit?.status == 1) {
                          handleBookingPayment();
                        } else if (visit?.status == 2) {
                          handlePayment();
                        }
                      }}
                      disabled={loadingSingle || loadingMenu}
                    >
                      {loadingSingle ? <Spinner /> : "Bayar"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogFooter>
        )}
      </Dialog>
      <div className="relative overflow-hidden">
        {/* HOME  */}
        <div
          style={activeTab === "home" ? styleShowTab : styleHideTab}
          className="mt-6"
        >
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-grow">
                <Input
                  className="bg-white py-2 px-4"
                  label="Cari"
                  size="md"
                  value={paramVisit.search_key}
                  onChange={(e) =>
                    setParamVisit({
                      ...paramVisit,
                      search_key: e.target.value,
                    })
                  }
                />
              </div>
              <div className="min-w-[200px] flex-grow">
                <Select
                  id="status"
                  label="Status"
                  className="bg-white"
                  value={paramVisit.status}
                  onChange={(e) =>
                    setParamVisit({
                      ...paramVisit,
                      status: e,
                    })
                  }
                >
                  <Option value="">
                    <em>None</em>
                  </Option>
                  <Option value="1">Booking</Option>
                  <Option value="2">Registrasi</Option>
                  <Option value="3">Selesai</Option>
                  <Option value="4">Lunas</Option>
                  <Option value="99">Batal</Option>
                </Select>
              </div>
              <div className="min-w-[200px] flex-grow">
                <Select
                  id="status-booking"
                  label="Status Booking"
                  className="bg-white"
                  value={paramVisit.status_booking}
                  onChange={(e) => {
                    console.log(e);
                    setParamVisit({
                      ...paramVisit,
                      status_booking: e,
                    });
                  }}
                >
                  <Option value="">
                    <em>None</em>
                  </Option>
                  <Option value="1">Draft</Option>
                  <Option value="2">Dikonfirmasi</Option>
                  <Option value="99">Batal</Option>
                </Select>
              </div>
            </div>
            <div className="ms-auto flex gap-4">
              <Button
                className="bg-red-400"
                size="sm"
                onClick={() =>
                  setParamVisit({
                    ...paramVisit,
                    search_key: "",
                    status: "",
                    status_booking: "",
                  })
                }
              >
                Reset
              </Button>
              <Button size="sm" className="bg-blue-400" onClick={getData}>
                Cari
              </Button>
            </div>
            <div className="ms-auto mt-2 flex gap-4">
              <Button
                onClick={() => handleChangeTab("booking")}
                className="bg-orange-400 flex gap-2 justify-center items-center w-48"
                size="sm"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Booking
              </Button>
              <Button
                onClick={() => handleChangeTab("kunjungan")}
                className="bg-green-400 flex gap-2 justify-center items-center w-48"
                size="sm"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Kunjungan
              </Button>
            </div>
          </div>
          <Tables
            datas={listVisit}
            columns={columns}
            changePage={changePage}
            active={activaPage}
            setActive={setActivePage}
            isLoading={loadingTable}
            paging={paging}
            children={children}
          />
        </div>
        {/* ADD KUNJUNGAN  */}
        <div style={activeTab === "kunjungan" ? styleShowTab : styleHideTab}>
          <div className="flex justify-between items-center">
            <Typography className="font-bold" variant="lead">
              Tambah Kunjungan
            </Typography>
            <Button
              variant="text"
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2"
            >
              <ArrowUturnLeftIcon className="h-6 w-6" /> Kembali
            </Button>
          </div>
          <div className="mt-8">
            <div>
              <Typography>Kunjungan Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    value={payloadCreateVisiting.tgl_kunjungan}
                    onChange={(e) => {
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        tgl_kunjungan: e.target.value,
                      });
                      loadDefaultOptionsDiningTable();
                    }}
                    type="date"
                    label="Tanggal Kunjungan"
                    min={dayjs(new Date()).format("YYYY-MM-DD")}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Jumlah Orang"
                    required
                    type="number"
                    value={payloadCreateVisiting.jumlah_orang}
                    onChange={(e) =>
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        jumlah_orang: e.target.value,
                      })
                    }
                    onBlur={loadDefaultOptionsDiningTable}
                  />
                </div>
                <div className="col-span-1 relative">
                  <Card className="absolute right-0 w-full">
                    <CardHeader className="bg-blue-gray-600">
                      <div className="px-4 py-2">
                        <Typography
                          variant="lead"
                          className="text-base text-white"
                        >
                          Meja Tersedia
                        </Typography>
                      </div>
                    </CardHeader>
                    <CardBody className="max-h-80 overflow-auto">
                      <Tabs value="2">
                        <TabsHeader
                          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 overflow-auto"
                          indicatorProps={{
                            className:
                              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                          }}
                        >
                          <Tab value={"2"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 2
                            </Typography>
                          </Tab>
                          <Tab value={"4"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 4
                            </Typography>
                          </Tab>
                          <Tab value={"8"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 8
                            </Typography>
                          </Tab>
                          <Tab value={"12"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 12
                            </Typography>
                          </Tab>
                        </TabsHeader>
                        <TabsBody>
                          <TabPanel value={"2"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter((item) => item.kapasitas <= 2)
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"4"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter(
                                  (item) =>
                                    item.kapasitas <= 4 && item.kapasitas > 2,
                                )
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"8"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter(
                                  (item) =>
                                    item.kapasitas <= 8 && item.kapasitas > 4,
                                )
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"12"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter((item) => item.kapasitas > 8)
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                        </TabsBody>
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <Checkbox
                  label="Makan Ditempat"
                  color="blue-gray"
                  checked={diningIn}
                  onChange={(e) => setDiningIn(e.target.checked)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Typography>Data Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    label="Nama Pelanggan"
                    required
                    value={payloadCreateVisiting.nama}
                    onChange={(e) =>
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        nama: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Nomor Hp"
                    required
                    type="number"
                    value={payloadCreateVisiting.nomor_hp}
                    onChange={(e) =>
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        nomor_hp: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    label="Email"
                    required
                    value={payloadCreateVisiting.email}
                    onChange={(e) =>
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        email: e.target.value,
                      })
                    }
                    type="email"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Typography>Informasi Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                {diningIn && (
                  <div className="col-span-1">
                    <AsyncSelect
                      placeholder="Pilih Meja"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "transparent",
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      cacheOptions
                      isMulti={false}
                      menuPortalTarget={document.getElementById("main-content")}
                      loadOptions={loadOptionsDiningTable}
                      defaultOptions={defaultOptionsMeja}
                      value={payloadCreateVisiting.id_meja}
                      onChange={(e) => {
                        setPayloadCreateVisiting({
                          ...payloadCreateVisiting,
                          id_meja: e,
                        });
                      }}
                    />
                  </div>
                )}
                <div className="col-span-1">
                  <AsyncSelect
                    placeholder="Pilih Metode Pembayaran"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    menuPortalTarget={document.getElementById("main-content")}
                    cacheOptions
                    isMulti={false}
                    loadOptions={loadOptionsPayment}
                    defaultOptions={defaultOptionsPayment}
                    value={payloadCreateVisiting.id_metode_pembayaran}
                    onChange={(e) => {
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        id_metode_pembayaran: e,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <AsyncSelect
                    placeholder="Pilih Pajak"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    cacheOptions
                    menuPortalTarget={document.getElementById("main-content")}
                    isMulti={false}
                    loadOptions={loadOptionsTax}
                    defaultOptions={defaultOptionsTax}
                    value={payloadCreateVisiting.id_pajak}
                    onChange={(e) => {
                      setPayloadCreateVisiting({
                        ...payloadCreateVisiting,
                        id_pajak: e,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 border-b border-blue-gray-400 pb-2 flex justify-end">
              <Button
                className=" bg-green-400 relative w-40  md:w-60 2xl:w-80"
                variant="sm"
                disabled={loadingSingle || visitCreated}
                onClick={() => handleCreateVisiting()}
              >
                Lanjut
              </Button>
            </div>
            {loadingSingle && (
              <div className="p-10 flex justify-center">
                <Spinner className="h-10 w-10" color="blue-gray" />
              </div>
            )}
            {visitCreated && (
              <div className="mt-6 pb-10">
                <Typography>Pilihan Menu</Typography>
                <div className="grid grid-cols-10 grid-flow-col gap-2 mt-4">
                  <div className="col-span-2 flex gap-2">
                    <Button
                      variant="sm"
                      className="py-1 flex justify-center items-center bg-blue-400 w-32"
                      onClick={() => handleClickAddMenu()}
                    >
                      <PlusIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="sm"
                      className="py-1 flex justify-center items-center bg-green-400 w-32"
                      onClick={() => handleCreateMenuSales()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                {payloadAddMenu.map((menu, idx) => (
                  <div className="grid grid-cols-10 grid-flow-col gap-4 mt-4">
                    <div className="col-span-4">
                      <AsyncSelect
                        placeholder="Pilih Menu"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                          }),
                          option: (base) => ({
                            ...base,
                          }),
                        }}
                        cacheOptions
                        isMulti={false}
                        loadOptions={loadOptionsMenu}
                        defaultOptions={defaultOptionsMenu}
                        value={payloadAddMenu[idx].id_menu}
                        onChange={(e) => {
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data[idx] = {
                              ...data[idx],
                              id_menu: e,
                              id_penjualan_menu: null,
                            };
                            return data;
                          });
                        }}
                        menuPosition="fixed"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label="Qty"
                        type="number"
                        value={payloadAddMenu[idx].qty}
                        onChange={(e) =>
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data[idx] = {
                              ...data[idx],
                              qty: e.target.value,
                            };
                            return data;
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <IconButton
                        variant="text"
                        onClick={() => {
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data.splice(idx, 1);
                            return data;
                          });
                        }}
                      >
                        <XMarkIcon className="h-5" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* ADD BOOKING  */}
        <div style={activeTab === "booking" ? styleShowTab : styleHideTab}>
          <div className="flex justify-between items-center">
            <Typography className="font-bold" variant="lead">
              Tambah Booking
            </Typography>
            <Button
              variant="text"
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2"
            >
              <ArrowUturnLeftIcon className="h-6 w-6" /> Kembali
            </Button>
          </div>
          <div className="mt-8">
            <div>
              <Typography>Kunjungan Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    value={payloadCreateBooking.tgl_kunjungan}
                    onChange={(e) => {
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        tgl_kunjungan: e.target.value,
                      });
                      loadDefaultOptionsDiningTable();
                    }}
                    type="date"
                    min={dayjs(new Date()).format("YYYY-MM-DD")}
                    label="Tanggal Kunjungan"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={payloadCreateBooking.jam}
                    onChange={(e) => {
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        jam: e.target.value,
                      });
                      loadDefaultOptionsDiningTable();
                    }}
                    type="time"
                    label="Jam Kunjungan"
                    required
                  />
                </div>
                <div className="col-span-1 relative">
                  <Card className="absolute right-0 w-full">
                    <CardHeader className="bg-blue-gray-600">
                      <div className="px-4 py-2">
                        <Typography
                          variant="lead"
                          className="text-base text-white"
                        >
                          Meja Tersedia
                        </Typography>
                      </div>
                    </CardHeader>
                    <CardBody className="max-h-80 overflow-auto">
                      <Tabs value="2">
                        <TabsHeader
                          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                          indicatorProps={{
                            className:
                              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                          }}
                        >
                          <Tab value={"2"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 2
                            </Typography>
                          </Tab>
                          <Tab value={"4"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 4
                            </Typography>
                          </Tab>
                          <Tab value={"8"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 8
                            </Typography>
                          </Tab>
                          <Tab value={"12"}>
                            <Typography className="text-xs font-bold">
                              Kapasitas 12
                            </Typography>
                          </Tab>
                        </TabsHeader>
                        <TabsBody>
                          <TabPanel value={"2"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter((item) => item.kapasitas <= 2)
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"4"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter(
                                  (item) =>
                                    item.kapasitas <= 4 && item.kapasitas > 2,
                                )
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"8"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter(
                                  (item) =>
                                    item.kapasitas <= 8 && item.kapasitas > 4,
                                )
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                          <TabPanel value={"12"}>
                            <div className="flex flex-wrap gap-1">
                              {defaultOptionsMeja
                                ?.filter((item) => item.kapasitas > 8)
                                .map((item) => {
                                  return (
                                    <div className="bg-blue-gray-600 px-2 py-1 rounded-lg w-[45%]">
                                      <Typography className="text-white text-center text-sm">
                                        {item.label}
                                      </Typography>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabPanel>
                        </TabsBody>
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    label="Jumlah Orang"
                    required
                    type="number"
                    value={payloadCreateBooking.jumlah_orang}
                    onChange={(e) =>
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        jumlah_orang: e.target.value,
                      })
                    }
                    onBlur={loadDefaultOptionsDiningTable}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Typography>Data Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    label="Nama Pelanggan"
                    required
                    value={payloadCreateBooking.nama}
                    onChange={(e) =>
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        nama: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Nomor Hp"
                    required
                    type="number"
                    value={payloadCreateBooking.nomor_hp}
                    onChange={(e) =>
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        nomor_hp: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Input
                    label="Email"
                    required
                    type="email"
                    value={payloadCreateBooking.email}
                    onChange={(e) =>
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Typography>Informasi Pelanggan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <AsyncSelect
                    placeholder="Pilih Meja"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    menuPortalTarget={document.getElementById("main-content")}
                    cacheOptions
                    isMulti={false}
                    loadOptions={loadOptionsDiningTable}
                    defaultOptions={defaultOptionsMeja}
                    value={payloadCreateBooking.id_meja}
                    onChange={(e) => {
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        id_meja: e,
                      });
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <AsyncSelect
                    placeholder="Pilih Metode Pembayaran"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    menuPortalTarget={document.getElementById("main-content")}
                    cacheOptions
                    isMulti={false}
                    loadOptions={loadOptionsPayment}
                    defaultOptions={defaultOptionsPayment}
                    value={payloadCreateBooking.id_metode_pembayaran}
                    onChange={(e) => {
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        id_metode_pembayaran: e,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <AsyncSelect
                    placeholder="Pilih Pajak"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    menuPortalTarget={document.getElementById("main-content")}
                    cacheOptions
                    isMulti={false}
                    loadOptions={loadOptionsTax}
                    defaultOptions={defaultOptionsTax}
                    value={payloadCreateBooking.id_pajak}
                    onChange={(e) => {
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        id_pajak: e,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Typography>Keterangan</Typography>
              <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
                <div className="col-span-1">
                  <Textarea
                    label="Keterangan"
                    value={payloadCreateBooking.keteraangan}
                    onChange={(e) =>
                      setPayloadCreateBooking({
                        ...payloadCreateBooking,
                        keteraangan: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-3 grid-flow-col gap-4 mt-2">
              <div className="col-span-1 flex items-center">
                <Checkbox
                  value={payloadCreateBooking.ada_menu}
                  onChange={(e) =>
                    setPayloadCreateBooking({
                      ...payloadCreateBooking,
                      ada_menu: e.target.checked,
                    })
                  }
                />
                Pesan Menu
              </div>
            </div> */}
            <div className="mt-6 border-b border-blue-gray-400 pb-2 flex justify-end">
              <Button
                className=" bg-green-400 relative w-72"
                variant="sm"
                disabled={loadingSingle || visitCreated}
                onClick={() => handleCreateBooking()}
              >
                Lanjut
              </Button>
            </div>
            {loadingSingle && (
              <div className="p-10 flex justify-center">
                <Spinner className="h-10 w-10" color="blue-gray" />
              </div>
            )}
            {visitCreated && (
              <div className="mt-6 pb-10">
                <Typography>Pilihan Menu</Typography>
                <div className="grid grid-cols-10 grid-flow-col gap-2 mt-4">
                  <div className="col-span-2 flex gap-2">
                    <Button
                      variant="sm"
                      className="flex-grow py-1 flex justify-center items-center bg-blue-400"
                      onClick={() => handleClickAddMenu()}
                    >
                      <PlusIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="sm"
                      className="flex-grow py-1 flex justify-center items-center bg-green-400"
                      onClick={() => handleCreateMenuSales()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                {payloadAddMenu.map((menu, idx) => (
                  <div className="grid grid-cols-10 grid-flow-col gap-4 mt-4">
                    <div className="col-span-4">
                      <AsyncSelect
                        placeholder="Pilih Menu"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                          }),
                          option: (base) => ({
                            ...base,
                          }),
                        }}
                        menuPosition="fixed"
                        cacheOptions
                        isMulti={false}
                        loadOptions={loadOptionsMenu}
                        defaultOptions={defaultOptionsMenu}
                        value={payloadAddMenu[idx].id_menu}
                        onChange={(e) => {
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data[idx] = {
                              ...data[idx],
                              id_menu: e,
                              id_penjualan_menu: null,
                            };
                            return data;
                          });
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label="Qty"
                        type="number"
                        value={payloadAddMenu[idx].qty}
                        onChange={(e) =>
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data[idx] = {
                              ...data,
                              qty: e.target.value,
                            };
                            return data;
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <IconButton
                        variant="text"
                        onClick={() => {
                          setPayloadAddMenu((prevData) => {
                            const data = [...prevData];
                            data.splice(idx, 1);
                            return data;
                          });
                        }}
                      >
                        <XMarkIcon className="h-5" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ContainerPage>
  );
}

export default Visit;
