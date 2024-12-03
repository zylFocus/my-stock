import React from "react";
import { Button, Input, InputNumber } from "antd";

interface FilterControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  cookie: string;
  setCookie: (value: string) => void;
  dongCaiUrl: string;
  loading: boolean;
  queryPageSize: number;
  setQueryPageSize: (value: number) => void;
  onRefresh: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  cookie,
  setCookie,
  dongCaiUrl,
  loading,
  queryPageSize,
  setQueryPageSize,
  onRefresh,
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
            minWidth: "200px",
          }}
        >
          <span style={{ width: "70px", fontWeight: "500" }}>查询数量:</span>
          <InputNumber
            min={1}
            max={2000}
            value={queryPageSize}
            style={{ flex: 1 }}
            onChange={(value) => setQueryPageSize(value)}
          />
        </div>

        <Button type="primary" onClick={onRefresh} loading={loading}>
          刷新数据
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(dongCaiUrl);
            window.open(dongCaiUrl);
          }}
        >
          东方财富网址
        </Button>
      </div>
    </div>
  );
};
