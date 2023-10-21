import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./app/dashboard/page.tsx";
import { MainNav } from "./components/ui/main-nav.tsx";
import ErrorPage from "./app/error/page.tsx";
import ExpensesPage from "@/app/expenses/page.tsx";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage></DashboardPage>,
  },
  {
    path: "/expenses",
    element: <ExpensesPage></ExpensesPage>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <MainNav className="h-8 shadow-amber-700 flex items-center space-x-4 lg:space-x-6" />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
