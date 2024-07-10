import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsChartsData } from "@/data";
import {
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { getDataDashboard } from "@/stores/dashboard/dashboardSlice";
import { currencyFormat } from "@/configs/currency";

export function Home() {
  const dispatch = useDispatch();
  const {
    loadingDashboard,
    errorDashboard,
    messageDashboard,
    totalExpenditure,
    totalBalance,
    totalIncome,
    totalVisits,
  } = useSelector((state) => state.dashboard);
  const [statistics, setStatistics] = useState([
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Saldo Kas",
      value: 0,
      footer: {
        color: "text-green-500",
        value: "",
        label: "",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "Pengunjung",
      value: 0,
      footer: {
        color: "text-green-500",
        value: "",
        label: "",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Pemasukan",
      value: 0,
      footer: {
        color: "text-green-500",
        value: "",
        label: "",
      },
    },
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "Pengeluaran",
      value: 0,
      footer: {
        color: "text-red-500",
        value: "",
        label: "",
      },
    },
  ]);

  useEffect(() => {
    const getDashboard = () => {
      dispatch(
        getDataDashboard({
          param: "",
          query: "",
        }),
      );
    };

    getDashboard();
  }, []);

  useEffect(() => {
    if (messageDashboard) {
      setStatistics((prevData) => {
        const data = prevData;
        const result = data.map((item) => {
          if (item.title === "Pengeluaran") {
            return {
              ...item,
              value: currencyFormat(totalExpenditure),
            };
          } else if (item.title === "Pemasukan") {
            return {
              ...item,
              value: currencyFormat(totalIncome),
            };
          } else if (item.title === "Pengunjung") {
            return {
              ...item,
              value: totalVisits,
            };
          } else if (item.title === "Saldo Kas") {
            return {
              ...item,
              value: currencyFormat(totalBalance),
            };
          }
        });
        return result;
      });
    }
  }, [messageDashboard, errorDashboard]);
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            loading={loadingDashboard}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
