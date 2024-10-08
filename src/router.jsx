import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./Components/Navbar";
import LoginPage from "./pages/LoginPage";
import RoomPage from "./pages/Roompage";

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
    <Navbar/>
    <Homepage />
    </>
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/room",
    element: <RoomPage />,
  },
]);

export default router;
