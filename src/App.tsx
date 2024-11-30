import React from "react";
import { Stock } from "./pages/stock";
import { Note } from "./pages/Note";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
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
