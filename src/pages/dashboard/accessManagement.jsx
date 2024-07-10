import swall from "@/configs/sweetalert";
import { pagingDummy, userData } from "@/data/dummy";
import {
  addUser,
  clearUser,
  getListUser,
  getUser,
  removeUser,
} from "@/stores/accessManagement/accessManagementSlice";
import { ContainerPage } from "@/widgets/container";
import { Loading } from "@/widgets/loading";
import { Tables } from "@/widgets/tables";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function AccessManagement() {
  const dispatch = useDispatch();
  const {
    paging,
    loadingUser,
    loadingUser2,
    errorUser,
    messageUser,
    listUser,
    user,
  } = useSelector((state) => state.accessManagement);
  const column = [
    { key: "no", label: "No." },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "nomor_hp", label: "Nomor HP" },
    { key: "createdName", label: "Created Name" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "Action" },
  ];
  const [activePage, setActivePage] = useState(1);
  const [showFormUser, setShowFormUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [payloadUser, setPayloadUser] = useState({
    nama: "",
    username: "",
    password: "",
    nomor_hp: "",
    email: "",
    status: false,
  });
  const [searchKey, setSearchKey] = useState("");
  const children = {
    action: (data) => {
      return (
        <div className="w-full flex gap-4">
          <IconButton
            size="sm"
            variant="filled"
            color="blue"
            onClick={() => handleEditUser(data.id_user)}
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
            onClick={() => handleDeleteUser(data.id_user)}
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
  };
  const onChangePage = (noPage) => {
    console.log(noPage);
  };

  const handleDeleteUser = (id) => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin ingin menghapus?",
      true,
      (res) => {
        if (res.isConfirmed) {
          dispatch(
            removeUser({
              id_user: id,
            }),
          );
        }
      },
    );
  };

  const clearPayloadUser = () => {
    setPayloadUser({
      nama: "",
      username: "",
      password: "",
      email: "",
      nomor_hp: "",
      status: false,
    });
    dispatch(clearUser());
  };

  const handleEditUser = (id) => {
    dispatch(
      getUser({
        param: "",
        query: {
          id_user: id,
        },
      }),
    );
  };

  const handleBatalFormUser = () => {
    clearPayloadUser();
    setShowFormUser(false);
  };

  const handleTambahFormUser = () => {
    dispatch(addUser(payloadUser));
  };

  const getDataUser = () => {
    dispatch(
      getListUser({
        param: "",
        query: {
          ...paging,
          search_key: searchKey,
        },
      }),
    );
  };

  useEffect(() => {
    if (messageUser) {
      swall("success", "Berhasil", messageUser, false);
      setShowFormUser(false);
      clearPayloadUser();
      getDataUser();
    }
    if (errorUser) {
      swall("error", "Error", errorUser, false);
    }
    if (user) {
      setPayloadUser({
        nama: user.nama,
        email: user.email,
        nomor_hp: user.nomor_hp,
        username: user.username,
        status: user.status || false,
      });
      setShowFormUser(true);
    }
  }, [messageUser, errorUser, user]);

  useEffect(() => {
    getDataUser();
  }, []);
  return (
    <ContainerPage>
      <Loading isShow={loadingUser2} />
      <Dialog open={showFormUser}>
        <DialogHeader>Form User</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Nama"
              placeholder="Nama"
              required
              value={payloadUser.nama}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  nama: e.target.value,
                })
              }
            />
            <Input
              label="Username"
              placeholder="Username"
              required
              value={payloadUser.username}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  username: e.target.value,
                })
              }
            />
            <Input
              label="Password"
              value={payloadUser.password}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  password: e.target.value,
                })
              }
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              icon={
                <EyeIcon
                  role="button"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            <Input
              value={payloadUser.nomor_hp}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  nomor_hp: e.target.value,
                })
              }
              label="Nomor HP"
              type="number"
              placeholder="Nomor HP"
              required
            />
            <Input
              label="Email"
              value={payloadUser.email}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  email: e.target.value,
                })
              }
              type="email"
              placeholder="Email"
              required
            />
            <Checkbox
              label="Super Admin"
              color="blue-gray"
              checked={payloadUser.status}
              onChange={(e) =>
                setPayloadUser({
                  ...payloadUser,
                  status: e.target.checked,
                })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              color="red"
              onClick={handleBatalFormUser}
              disabled={loadingUser}
            >
              Batal
            </Button>
            <Button
              color="green"
              onClick={handleTambahFormUser}
              disabled={loadingUser}
            >
              {loadingUser ? <Spinner /> : "Simpan"}
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
              onKeyUp={(e) => (e.key === "Enter" ? getDataUser() : null)}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              icon={<MagnifyingGlassIcon />}
            />
          </div>
          <Button
            className="py-2 px-4"
            color="green"
            onClick={() => setShowFormUser(true)}
          >
            Tambah User
          </Button>
        </div>
      </div>
      <Tables
        columns={column}
        datas={listUser}
        changePage={onChangePage}
        isLoading={loadingUser}
        paging={paging}
        children={children}
        active={activePage}
        setActive={setActivePage}
      />
    </ContainerPage>
  );
}

export default AccessManagement;
