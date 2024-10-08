import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RoomPage from "./pages/Roompage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/room",
    element: <RoomPage />,
  },
]);

export default router;
