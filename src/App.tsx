import React from "react";
import { Stock } from "./pages/tong-hua-shun/stock";
import { Note } from "./pages/Note";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ShangZhengStock } from "./pages/dong-cai/shang-zheng-stock";
import { Tabs } from "antd";
import { ShenZhengStock } from "./pages/dong-cai/shen-zheng-stock";

const StockTabs = () => {
  const items = [
    {
      key: "shanghai",
      label: "上证A股",
      children: <ShangZhengStock />,
    },
    {
      key: "shenzheng",
      label: "深证A股",
      children: <ShenZhengStock />,
    },
  ];

  return <Tabs defaultActiveKey="shanghai" items={items} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <StockTabs />,
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
