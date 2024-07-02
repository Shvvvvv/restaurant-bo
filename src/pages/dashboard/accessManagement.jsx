import { pagingDummy, userData } from "@/data/dummy";
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
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import React from "react";

export function AccessManagement() {
  const data = userData;
  const paging = pagingDummy;
  const column = [
    { key: "no", label: "No." },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "nomor_hp", label: "Nomor HP" },
    { key: "createdName", label: "Created Name" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "Action" },
  ];
  const children = {
    action: (data) => {
      return (
        <div className="w-full flex gap-4">
          <IconButton size="sm" variant="filled" color="blue">
            <PencilIcon
              strokeWidth={3}
              fill="currentColor"
              className="h-5 w-5"
            />
          </IconButton>
          <IconButton size="sm" variant="filled" color="red">
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
  return (
    <ContainerPage>
      {/* <Loading isShow={true} /> */}
      <div className="mb-10 flex justify-between md:flex-auto flex-wrap gap-2">
        <div className="min-w-[200px] md:w-72 w-full"></div>
        <div className="flex gap-4">
          <div>
            <Input
              className="bg-white py-2 px-4"
              label="Cari"
              size="md"
              icon={<MagnifyingGlassIcon />}
            />
          </div>
          <Button className="py-2 px-4" color="green">
            Tambah User
          </Button>
        </div>
      </div>
      <Tables
        columns={column}
        datas={data}
        changePage={onChangePage}
        isLoading={false}
        paging={paging}
        children={children}
      />
    </ContainerPage>
  );
}

export default AccessManagement;
