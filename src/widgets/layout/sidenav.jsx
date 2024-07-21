import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Collapse,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import swall from "@/configs/sweetalert";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const [activeCollapse, setActiveCollapse] = useState([]);
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const onChangeCollapse = (name) => {
    if (activeCollapse.includes(name)) {
      setActiveCollapse(activeCollapse.filter((v) => v !== name));
    } else {
      setActiveCollapse((prev) => [...prev, name]);
    }
  };

  const handleSignOut = () => {
    swall(
      "warning",
      "Peringatan",
      "Apakah anda yakin untuk keluar?",
      true,
      (e) => {
        if (e.isConfirmed) {
          localStorage.clear();
          window.location.reload();
        }
      },
    );
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-auto `}
    >
      <div className={`relative`}>
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, children }) => {
              return !children ? (
                <li key={name}>
                  {name === "sign out" ? (
                    <Button
                      fullWidth
                      className="flex items-center gap-4 px-4 capitalize"
                      variant="text"
                      onClick={handleSignOut}
                    >
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  ) : (
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              ) : (
                <li key={name}>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-4 px-4 capitalize relative"
                    fullWidth
                    onClick={() => onChangeCollapse(name)}
                  >
                    {icon}
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      {name}
                    </Typography>
                    <ChevronDownIcon className="w-5 h-5 text-inherit absolute right-2" />
                  </Button>
                  <Collapse open={activeCollapse.includes(name)}>
                    <ul className="p-2">
                      {children.map(({ icon, name, path, element }, key) => (
                        <li key={key}>
                          <NavLink to={`/${layout}${path}`}>
                            {({ isActive }) => (
                              <Button
                                variant={isActive ? "gradient" : "text"}
                                color={isActive ? sidenavColor : "blue-gray"}
                                className="flex items-center gap-4 px-4 capitalize"
                                fullWidth
                              >
                                {icon}
                                <Typography
                                  color="inherit"
                                  className="font-medium capitalize"
                                >
                                  {name}
                                </Typography>
                              </Button>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Restaurant Backoffice",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
