import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export function Tables({
  columns,
  datas,
  children = {},
  changePage,
  isLoading,
  paging,
  title,
  active,
  setActive,
}) {
  const pageCount = Math.ceil(paging?.count / paging?.limit);

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => {
      changePage(index);
      setActive(index);
    },
    className: "rounded-full",
  });

  const next = () => {
    if (active === pageCount) return;

    setActive(active + 1);
    changePage(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
    changePage(active - 1);
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let start = Math.max(active - halfVisiblePages, 1);
    let end = Math.min(start + maxVisiblePages - 1, pageCount);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const showData = (data, children, key) => {
    return columns.map((col, index) => (
      <td
        className="border-b border-blue-gray-50 py-3 px-5 text-left"
        key={index}
      >
        {!children[col.key]
          ? col.key === "no"
            ? (active - 1) * paging.limit + key + 1
            : data[col.key]
          : children[col.key](data)}
      </td>
    ));
  };
  return (
    <Card>
      <CardHeader
        variant="gradient"
        color="gray"
        className={`mb-8 px-6 ${title ? "py-2" : "py-4"}`}
      >
        <Typography variant="paragraph">{title}</Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {columns.map((el) => (
                <th
                  key={el.key}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <Spinner className="mx-auto" />
                </td>
              </tr>
            )}
            {!isLoading &&
              datas.map((val, key) => {
                return <tr key={key}>{showData(val, children, key)}</tr>;
              })}
            {!isLoading && datas.length <= 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <Typography
                    variant="small"
                    className="text-center font-semibold text-blue-gray-400"
                  >
                    Tidak ada data
                  </Typography>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="text"
            className="flex items-center gap-2 rounded-full"
            onClick={prev}
            disabled={active === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            {getPageNumbers().map((number) => (
              <IconButton key={number} {...getItemProps(number)}>
                {number}
              </IconButton>
            ))}
          </div>
          <Button
            variant="text"
            className="flex items-center gap-2 rounded-full"
            onClick={next}
            disabled={active === pageCount}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default Tables;
