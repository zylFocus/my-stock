import React from "react";
import { ShangZhengStock } from "./pages/dong-cai/shang-zheng-stock";
import { Tabs } from "antd";
import { ShenZhengStock } from "./pages/dong-cai/shen-zheng-stock";
import { Note } from "./pages/note/note";

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
    {
      key: "note",
      label: "笔记",
      children: <Note />,
    },
  ];

  return <Tabs defaultActiveKey="shanghai" items={items} />;
};

const App: React.FC = () => {
  return <StockTabs />;
};

export default App;
