import { convertToTitleCase } from "@/configs/capitalizer";
import { currencyFormat } from "@/configs/currency";
import swall from "@/configs/sweetalert";
import {
  addPayment,
  clearError,
  clearMessage,
  clearPaging,
  clearPayment,
  getListPayment,
  getPayment,
  removePayment,
  setPage,
  updatePayment,
} from "@/stores/paymentMethod/paymentMethodSlice";
import { ContainerPage } from "@/widgets/container";
import { Loading } from "@/widgets/loading";
import Tables from "@/widgets/tables/tables";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";

export function PaymentMethod() {
  const dispatch = useDispatch();
  const {
    listPayment,
    message,
    error,
    paging,
    payment,
    loading,
    loadingSingle,
    loadingTable,
  } = useSelector((state) => state.paymentMethod);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState({
    search_key: "",
    jenis: "",
  });
  const [activePage, setActivePage] = useState(1);
  const [payloadPayment, setPayloadPayment] = useState({
    nama_metode_pembayaran: "",
    kode: "",
    logo: null,
    keterangan: "",
    status: "",
    jenis: "",
    biaya_admin: "",
  });
  const [imageUpload, setImageUpload] = useState(null);
  const columns = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "logo",
      label: "Logo",
    },
    {
      key: "nama_metode_pembayaran",
      label: "Nama Metode Pembayaran",
    },
    {
      key: "kode",
      label: "Kode",
    },
    {
      key: "jenis",
      label: "Jenis",
    },
    {
      key: "biaya_admin",
      label: "Biaya Admin",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "keterangan",
      label: "Keterangan",
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
  const children = {
    logo: (data) => {
      return (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${data?.logo}`}
          alt={data?.nama_metode_pembayaran}
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
                getPayment({
                  query: {
                    id_metode_pembayaran: data.id_metode_pembayaran,
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
            onClick={() => deletePayment(data?.id_metode_pembayaran)}
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
    biaya_admin: (data) => {
      return <Typography>{currencyFormat(data.biaya_admin)}</Typography>;
    },
    status: (data) => {
      return data.status ? (
        <Typography color="green">AKTIF</Typography>
      ) : (
        <Typography color="red">TIDAK AKTIF</Typography>
      );
    },
  };

  const getData = () => {
    dispatch(
      getListPayment({
        query: {
          ...paging,
          ...filterPaymentMethod,
        },
      }),
    );
  };

  const resetPayloadPayment = () => {
    setPayloadPayment({
      nama_metode_pembayaran: "",
      logo: null,
      kode: "",
      status: "",
      jenis: "",
      biaya_admin: "",
      keterangan: "",
    });
  };

  const addPaymentMethod = () => {
    let err = null;
    Object.keys(payloadPayment).map((key) => {
      if (!payloadPayment[key]) err = key;
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
    if (!payment) {
      dispatch(
        addPayment({
          ...payloadPayment,
          biaya_admin: parseInt(payloadPayment.biaya_admin),
        }),
      );
    } else {
      let payload = null;
      if (payloadPayment.logo?.type?.startsWith("image/")) {
        payload = Object.assign({
          ...payloadPayment,
          biaya_admin: parseInt(payloadPayment.biaya_admin),
          id_metode_pembayaran: payment.id_metode_pembayaran,
        });
      } else {
        payload = Object.assign({
          id_metode_pembayaran: payment.id_metode_pembayaran,
          nama_metode_pembayaran: payloadPayment.nama_metode_pembayaran,
          kode: payloadPayment.kode,
          status: payloadPayment.status,
          jenis: payloadPayment.jenis,
          biaya_admin: parseInt(payloadPayment.biaya_admin),
          keterangan: payloadPayment.keterangan,
        });
      }
      dispatch(updatePayment(payload));
    }
  };

  const deletePayment = (id) => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin untuk menghapus?",
      true,
      (result) => {
        if (result.isConfirmed) {
          dispatch(
            removePayment({
              id_metode_pembayaran: id,
            }),
          );
        }
      },
    );
  };

  const cancelFormPaymentMethod = () => {
    clearPayloadPayment();
    setIsOpenModal(!isOpenModal);
  };

  const clearPayloadPayment = () => {
    setPayloadPayment({
      nama_metode_pembayaran: "",
      kode: "",
      logo: null,
      keterangan: "",
      status: "",
      jenis: "",
      biaya_admin: "",
    });
  };

  const onChangePage = (noPage) => {
    dispatch(setPage(noPage));
  };

  const readerFileImage = (file) => {
    const reader = new FileReader(file);
    reader.onload = (e) => {
      setImageUpload(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    getData();
    return () => {
      clearPaging();
    };
  }, []);

  useEffect(() => {
    getData();
  }, [paging.pages, filterPaymentMethod.jenis]);

  useEffect(() => {
    if (payloadPayment.logo?.type?.startsWith("image/")) {
      readerFileImage(payloadPayment.logo);
    } else {
      setImageUpload(
        `${import.meta.env.VITE_BASE_URL_IMAGE}/${payloadPayment.logo}`,
      );
    }
  }, [payloadPayment.logo]);

  useEffect(() => {
    if (message) {
      swall("success", "Berhasil", message, false, () => {
        if (payment) {
          dispatch(clearPayment());
        }
        dispatch(clearMessage());
        resetPayloadPayment();
        setIsOpenModal(false);
        getData();
      });
    }
    if (error) {
      swall("error", "Gagal", error, false);
    }
    if (payment && !error && !message) {
      setPayloadPayment({
        nama_metode_pembayaran: payment.nama_metode_pembayaran,
        kode: payment.kode,
        logo: payment.logo,
        keterangan: payment.keterangan,
        status: payment.status,
        jenis: payment.jenis,
        biaya_admin: payment.biaya_admin,
      });
      setIsOpenModal(true);
    }
  }, [message, error, payment]);
  return (
    <ContainerPage>
      <Loading isShow={loading} />
      <Dialog size="xs" open={isOpenModal}>
        <DialogHeader>Form Metode Pembayaran</DialogHeader>
        <DialogBody>
          <div className="flex flex-wrap gap-4">
            {payloadPayment.logo?.name || ""}
            <div className="relative w-full h-40">
              {!payloadPayment.logo ? (
                <div className="flex justify-center items-center bg-blue-gray-50 w-full h-full rounded-md">
                  <label
                    htmlFor="upload-image"
                    role="button"
                    className="w-2/3 h-2/3 bg-blue-gray-100 rounded-md flex justify-center items-center flex-col"
                  >
                    <ArrowDownTrayIcon className="w-16 h-16" />
                    <Typography variant="small" className="text-center">
                      Upload Logo
                    </Typography>
                  </label>
                </div>
              ) : (
                <img
                  src={imageUpload}
                  alt="gambar-menu"
                  className="w-full h-full"
                />
              )}
              {payloadPayment.logo && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <label
                    htmlFor="upload-image"
                    role="button"
                    className="border-2 border-blue-gray-400 p-2 rounded-md"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </label>
                  <Button
                    variant="outlined"
                    className="p-2 border-2 border-blue-gray-400 text-blue-gray-400"
                  >
                    <XMarkIcon
                      className="h-5 w-5"
                      onClick={() =>
                        setPayloadPayment({
                          ...payloadPayment,
                          logo: null,
                        })
                      }
                    />
                  </Button>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  setPayloadPayment((prev) => ({
                    ...payloadPayment,
                    logo:
                      e.target.files.length > 0 ? e.target.files[0] : prev.logo,
                  }))
                }
                id="upload-image"
              />
            </div>
            <Input
              label="Nama Metode Pembayaran"
              className="w-full"
              value={payloadPayment.nama_metode_pembayaran}
              onChange={(e) =>
                setPayloadPayment({
                  ...payloadPayment,
                  nama_metode_pembayaran: e.target.value,
                })
              }
            />
            <Input
              label="Kode"
              className="w-full"
              value={payloadPayment.kode}
              onChange={(e) =>
                setPayloadPayment({
                  ...payloadPayment,
                  kode: e.target.value,
                })
              }
            />
            <div className="min-w-[200px] w-full">
              <Select
                id="status-payment"
                label="Status"
                value={payloadPayment.status}
                onChange={(val) => {
                  setPayloadPayment({
                    ...payloadPayment,
                    status: val,
                  });
                }}
              >
                <Option value="">
                  <em>None</em>
                </Option>
                <Option value={true}>Aktif</Option>
                <Option value={false}>Tidak Aktif</Option>
              </Select>
            </div>
            <div className="min-w-[200px] w-full">
              <Select
                id="jenis-payment"
                label="Jenis"
                value={payloadPayment.jenis}
                onChange={(val) => {
                  setPayloadPayment({
                    ...payloadPayment,
                    jenis: val,
                  });
                }}
              >
                <Option value="">
                  <em>None</em>
                </Option>
                <Option value="VA">VA</Option>
                <Option value="QR">QR</Option>
                <Option value="TUNAI">TUNAI</Option>
              </Select>
            </div>
            <div className="flex w-full gap-4">
              <span className="flex items-center justify-center">
                <Typography variant="h5">Rp</Typography>
              </span>
              <CurrencyInput
                className="flex-grow w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                id="harga-menu"
                name="harga-menu"
                placeholder="Biaya Admin"
                defaultValue={payloadPayment.biaya_admin}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setPayloadPayment({ ...payloadPayment, biaya_admin: value })
                }
              />
            </div>
            <Textarea
              label="Keterangan"
              value={payloadPayment.keterangan}
              onChange={(e) =>
                setPayloadPayment({
                  ...payloadPayment,
                  keterangan: e.target.value,
                })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button color="red" onClick={cancelFormPaymentMethod}>
              Batal
            </Button>
            <Button
              disabled={loadingSingle}
              color="green"
              onClick={() => addPaymentMethod()}
            >
              {loadingSingle ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <div className="mb-10 flex justify-between md:flex-auto flex-wrap gap-2">
        <div className="min-w-[200px] md:w-72 w-full">
          <Select
            id="kategori-makanan"
            label="Kategori"
            className="bg-white"
            onChange={(e) =>
              setFilterPaymentMethod({
                ...filterPaymentMethod,
                jenis: e,
              })
            }
          >
            <Option value="">
              <em>None</em>
            </Option>
            <Option value="VA">VA</Option>
            <Option value="QR">QR</Option>
            <Option value="TUNAI">TUNAI</Option>
          </Select>
        </div>
        <div className="flex gap-4">
          <div>
            <Input
              className="bg-white py-2 px-4"
              label="Cari"
              size="md"
              onChange={(e) =>
                setFilterPaymentMethod({
                  ...filterPaymentMethod,
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
            onClick={() => setIsOpenModal(!isOpenModal)}
          >
            Tambah Metode Pembayaran
          </Button>
        </div>
      </div>
      <Tables
        columns={columns}
        datas={listPayment}
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

export default PaymentMethod;
