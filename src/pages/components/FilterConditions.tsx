import React from "react";
import { InputNumber, Switch, Input } from "antd";
import { FilterObject } from "../../types";

interface FilterConditionsProps {
  filterObj: FilterObject;
  onChange: (newFilterObj: FilterObject) => void;
  styles?: React.CSSProperties;
  onSearch?: (searchText: string) => void;
  searchValue?: string;
}

export const FilterConditions: React.FC<FilterConditionsProps> = ({
  filterObj,
  onChange,
  styles,
  onSearch,
  searchValue,
}) => {
  const [searchText, setSearchText] = React.useState(searchValue);
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Input.Search
          placeholder="搜索股票代码或名称"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => {
            console.log("on search ====");
            onSearch?.(searchText);
          }}
          style={{ width: 300 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          ...styles,
        }}
      >
        {Object.entries(filterObj).map(([key, value]) => {
          const label = {
            changeRate: "涨跌幅",
            turnoverRate: "换手率",
            volumeRatio: "量比",
            marketValue: "流通市值",
            amplitude: "振幅",
            peRatio: "市盈率",
          }[key];

          return (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Switch
                checked={value.enabled}
                onChange={(checked) =>
                  onChange({
                    ...filterObj,
                    [key]: { ...filterObj[key], enabled: checked },
                  })
                }
              />
              <span>{label}：</span>
              <InputNumber
                style={{ width: 100 }}
                placeholder="最小值"
                value={value.min}
                onChange={(newValue) =>
                  onChange({
                    ...filterObj,
                    [key]: { ...filterObj[key], min: newValue },
                  })
                }
                disabled={!value.enabled}
              />
              <span>至</span>
              <InputNumber
                style={{ width: 100 }}
                placeholder="最大值"
                value={value.max}
                onChange={(newValue) =>
                  onChange({
                    ...filterObj,
                    [key]: { ...filterObj[key], max: newValue },
                  })
                }
                disabled={!value.enabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
