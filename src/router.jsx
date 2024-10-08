import { createBrowserRouter, redirect } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Roompage from "./pages/Roompage";
import BattlePage from "./pages/Battlepage";
import Layout from "./layouts/rootLayouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: () => {
      const access_token = localStorage.getItem("username");
      if (!access_token) {
        throw redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "/rooms",
        element: <Roompage />,
      },
      {
        path: "rooms/:roomId", // Tambahkan route untuk BattlePage
        element: <BattlePage />,
        loader: () => {
          const access_token = localStorage.getItem("username");
          if (!access_token) {
            throw redirect("/login");
          }
          return null;
        },
      },
    ],
  },
  {
    path: "/",
    loader: () => {
      const access_token = localStorage.getItem("username");
      if (access_token) {
        throw redirect("/");
      }
      return null;
    },
    children: [
      {
        path: "/login",
        element: <Loginpage />,
      },
    ],
  },
]);
