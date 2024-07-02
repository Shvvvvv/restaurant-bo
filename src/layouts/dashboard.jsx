import { Routes, Route } from "react-router-dom";
import { Sidenav, DashboardNavbar, Configurator } from "@/widgets/layout";
import routes from "@/routes";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} brandName="Restaurant Backoffice" />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element, children }) =>
                path ? (
                  <Route exact path={path} element={element} />
                ) : (
                  children.map(({ path, element }) => (
                    <Route exact path={path} element={element}></Route>
                  ))
                ),
              ),
          )}
        </Routes>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
