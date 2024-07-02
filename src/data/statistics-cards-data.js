import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Saldo Kas",
    value: "Rp 34.200.000",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "dalam Seminggu",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Pengunjung",
    value: "248",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "dalam Sebulan",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Penjualan",
    value: "Rp 5.120.000",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "dari Kemarin",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Pengeluaran",
    value: "Rp 2.250.000",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "dari Kemarin",
    },
  },
];

export default statisticsCardsData;
