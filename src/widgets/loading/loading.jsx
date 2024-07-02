import { Dialog, Spinner } from "@material-tailwind/react";
import React from "react";

export function Loading({ isShow }) {
  return (
    <Dialog open={isShow} className="bg-transparent border-0 shadow-none">
      <Spinner color="blue-gray" className="m-auto h-12 w-12" />
    </Dialog>
  );
}

export default Loading;
