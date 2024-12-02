import React from "react";
import { Stock } from "./pages/tong-hua-shun/stock";
import { Note } from "./pages/Note";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DongCaiStock } from "./pages/dong-cai/dong-cai-stock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DongCaiStock />,
  },
  {
    path: "/dong-cai",
    element: <DongCaiStock />,
  },
  {
    path: "/tong-hua-shun",
    element: <Stock />,
  },
  {
    path: "/note",
    element: <Note />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
