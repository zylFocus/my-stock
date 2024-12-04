import React from "react";
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

const App: React.FC = () => {
  return <StockTabs />;
};

export default App;
