import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./Components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
    <Navbar/>
    <Homepage />
    </>
  },
]);

export default router;
