import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./Components/Navbar";
import LoginPage from "./pages/LoginPage";
import RoomPage from "./pages/Roompage";
import Battlepage from "./pages/Battlepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Homepage />
      </>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/room",
    element: <RoomPage />,
  },
  {
    path: "/game",
    element: <Battlepage />,
  },
]);

export default router;
