import {
  HomeIcon,
  ArrowLeftCircleIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  BanknotesIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  PaymentMethod,
  Menu,
  Tax,
  DiningTable,
  Cash,
  AccessManagement,
  Visit,
} from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "Main",
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "master",
        children: [
          {
            icon: <ChevronRightIcon {...icon} />,
            name: "metode pembayaran",
            path: "/metode-pembayaran",
            element: <PaymentMethod />,
          },
          {
            icon: <ChevronRightIcon {...icon} />,
            name: "pajak",
            path: "/pajak",
            element: <Tax />,
          },
          {
            icon: <ChevronRightIcon {...icon} />,
            name: "menu makanan",
            path: "/menu-makanan",
            element: <Menu />,
          },
          {
            icon: <ChevronRightIcon {...icon} />,
            name: "meja",
            path: "/meja",
            element: <DiningTable />,
          },
        ],
      },
      {
        icon: <BuildingStorefrontIcon {...icon} />,
        name: "kunjungan",
        path: "/kunjungan",
        element: <Visit />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "kas",
        path: "/kas",
        element: <Cash />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "manejemen akses",
        children: [
          {
            icon: <ChevronRightIcon {...icon} />,
            name: "user",
            path: "/user",
            element: <AccessManagement />,
          },
        ],
      },
    ],
  },
  {
    title: "AUTH",
    layout: "auth",
    pages: [
      {
        icon: <ArrowLeftCircleIcon {...icon} />,
        name: "sign out",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
