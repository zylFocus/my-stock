import React from "react";
import { Button, Input, InputNumber } from "antd";

interface FilterControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  cookie: string;
  setCookie: (value: string) => void;
  cookie2: string;
  setCookie2: (value: string) => void;
  tongHuaShunUrl: string;
  loading: boolean;
  pageStart: number;
  setPageStart: (value: number) => void;
  pageEnd: number;
  setPageEnd: (value: number) => void;
  onRefresh: () => void;
  onRefreshAndAppend: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  cookie,
  setCookie,
  cookie2,
  setCookie2,
  tongHuaShunUrl,
  loading,
  pageStart,
  setPageStart,
  pageEnd,
  setPageEnd,
  onRefresh,
  onRefreshAndAppend,
  ...rest
}) => {
  return (
    <div {...rest}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          background: "#f5f5f5",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "300px",
          }}
        >
          <span style={{ width: "70px", fontWeight: "500" }}>Cookie1:</span>
          <Input
            placeholder="输入Cookie1"
            value={cookie}
            style={{ flex: 1 }}
            onChange={(e) => {
              setCookie(e.target.value);
              localStorage.setItem("cookie", e.target.value);
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "300px",
          }}
        >
          <span style={{ width: "70px", fontWeight: "500" }}>Cookie2:</span>
          <Input
            placeholder="输入Cookie2"
            value={cookie2}
            style={{ flex: 1 }}
            onChange={(e) => {
              setCookie2(e.target.value);
              localStorage.setItem("cookie2", e.target.value);
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "200px",
          }}
        >
          <span style={{ width: "70px", fontWeight: "500" }}>页数:</span>
          <InputNumber
            min={1}
            max={100}
            value={pageStart}
            style={{ flex: 1 }}
            onChange={(value) => setPageStart(value)}
          />
          <InputNumber
            min={1}
            max={100}
            value={pageEnd}
            style={{ flex: 1 }}
            onChange={(value) => setPageEnd(value)}
          />
        </div>

        <Button type="primary" onClick={onRefresh} loading={loading}>
          刷新数据
        </Button>
        <Button type="primary" onClick={onRefreshAndAppend} loading={loading}>
          增加数据
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(tongHuaShunUrl);
            window.open(tongHuaShunUrl);
          }}
        >
          同花顺网址
        </Button>
      </div>
    </div>
  );
};
